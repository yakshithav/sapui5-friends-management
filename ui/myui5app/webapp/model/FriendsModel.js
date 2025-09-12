sap.ui.define(
  ["sap/ui/model/json/JSONModel", "sap/base/Log"],
  function (JSONModel, Log) {
    "use strict";

    return {
      createFriendsModel: function () {
        var oModel = new JSONModel({ friends: [] });

        $.ajax({
          // url: "http://localhost:3000/api/friends",
          url: "/api/friends",
          method: "GET",
          dataType: "json",
          success: function (data) {
            oModel.setProperty("/friends", data);
          },
          error: function (error) {
            Log.error("Failed to load friends from server: " + error);

            oModel.setProperty("/friends", []);
          },
        });

        return oModel;
      },

      addFriend: function (friendData) {
        return $.ajax({
          //   url: "http://localhost:3000/api/friends",
          url: "/api/friends",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(friendData),
          dataType: "json",
        });
      },

      deleteFriend: function (friendData) {
        return $.ajax({
          //   url: "http://localhost:3000/api/friends",
          url: "/api/friends/" + encodeURIComponent(friendData),
          method: "DELETE",
          // contentType: "application/json",
          // data: JSON.stringify(friendData),
          dataType: "json",
        });
      },
    };
  }
);
