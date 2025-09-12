const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const DATA_FILE = path.join(__dirname, "../data/friends.json");

const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  const initialData = [
    { name: "Sehla", city: "Mumbai", education: "MBA" },
    { name: "Nish", city: "Pune", education: "B.E" },
    { name: "Arbin", city: "Bangalore", education: "MCA" },
    { name: "Priya", city: "Mysore", education: "PhD" },
    { name: "Punith", city: "NewYork", education: "MS" },
  ];
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch (error) {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

router.get("/", (req, res) => {
  res.json(readData());
});

router.post("/", (req, res) => {
  const { name, education, city } = req.body;

  if (!name || !education || !city) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const friends = readData();
  const newFriend = { name, education, city };
  friends.push(newFriend);
  writeData(friends);
  res.status(201).json(newFriend);
});

router.delete("/:name", (req, res) => {
  const name = req.params.name.trim().toLowerCase();
  let friends = readData();
  const index = friends.findIndex((f) => f.name.trim().toLowerCase() === name);

  if (index === -1) {
    return res.status(404).json({ error: "Friend not found" });
  }

  const deleted = friends.splice(index, 1);
  writeData(friends);
  res.json({ message: `${deleted[0].name} deleted successfully` });
});

module.exports = router;
