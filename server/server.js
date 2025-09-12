const express = require("express");
const cors = require("cors");
const path = require("path");
const { glob } = require("glob");
const friendsRouter = require("./routes/friends");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../ui/myui5app/webapp")));
app.use("/api/friends", friendsRouter);
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../ui/myui5app/webapp/index.html"))
);
app.get("/api/files", async (req, res) => {
  try {
    const files = await glob("../ui/myui5app/webapp/**/*.{js,xml,json}", {
      nodir: true,
    });
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = app;

app.listen(PORT, () => {
  console.log(`Server is running on port : http://localhost:${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api/friends`);
});
