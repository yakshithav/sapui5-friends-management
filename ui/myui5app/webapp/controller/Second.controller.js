sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/Dialog",
    "sap/m/Input",
    "sap/m/Label",
    "sap/m/Button",
    "sap/m/MessageToast",
    "sap/m/VBox",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/ui/model/json/JSONModel",
    "myui5app/model/FriendsModel",
    "sap/base/Log",
  ],
  function (
    Controller,
    Fragment,
    Dialog,
    Input,
    Label,
    Button,
    MessageToast,
    VBox,
    Table,
    Column,
    ColumnListItem,
    Text,
    JSONModel,
    FriendsModel,
    Log
  ) {
    "use strict";

    return Controller.extend("myui5app.controller.Second", {
      // Initialize view with friends data
      onInit: function () {
        var oModel = FriendsModel.createFriendsModel();
        this.getView().setModel(oModel, "friendsModel");

        var oView = this.getView();
        Fragment.load({
          name: "myui5app.fragment.FriendsList",
          controller: this,
        }).then(function (oFragment) {
          oView.byId("friendsVBox").addItem(oFragment);
        });
      },

      // Show list of all friends in a table dialog
      onShowFriendsList: function () {
        var oModel = this.getView().getModel("friendsModel");

        var oTable = new Table({
          columns: [
            new Column({ header: new Text({ text: "Name" }) }),
            new Column({ header: new Text({ text: "City" }) }),
            new Column({ header: new Text({ text: "Education" }) }),
          ],
          items: {
            path: "friendsModel>/friends",
            template: new ColumnListItem({
              cells: [
                new Text({ text: "{friendsModel>name}" }),
                new Text({ text: "{friendsModel>city}" }),
                new Text({ text: "{friendsModel>education}" }),
              ],
            }),
          },
        });

        var oDialog = new Dialog({
          title: "List of All Friends",
          content: [oTable],
          beginButton: new Button({
            text: "Close",
            press: function () {
              oDialog.close();
            },
          }),
          afterClose: function () {
            oDialog.destroy();
          },
        });

        oDialog.setModel(oModel, "friendsModel");
        oDialog.open();
      },

      // Add a new friend
      onAddFriend: function () {
        var oController = this;

        var oNameInput = new Input({ placeholder: "Enter name" });
        var oCityInput = new Input({ placeholder: "Enter city" });
        var oEducationInput = new Input({ placeholder: "Enter education" });

        var oDialog = new Dialog({
          title: "Hi, Add Your Friend Details",
          content: new VBox({
            items: [
              new Label({ text: "Name:" }),
              oNameInput,
              new Label({ text: "City:" }),
              oCityInput,
              new Label({ text: "Education:" }),
              oEducationInput,
            ],
          }),
          beginButton: new Button({
            text: "Add",
            press: function () {
              var sName = oNameInput.getValue().trim();
              var sCity = oCityInput.getValue().trim();
              var sEducation = oEducationInput.getValue().trim();

              if (!sName || !sCity || !sEducation) {
                MessageToast.show("Please fill all fields");
                return;
              }

              var oNewFriend = {
                name: sName,
                city: sCity,
                education: sEducation,
              };

              FriendsModel.addFriend(oNewFriend)
                .then(function () {
                  return $.ajax({ url: "/api/friends", method: "GET" });
                })
                .then(function (data) {
                  oController
                    .getView()
                    .getModel("friendsModel")
                    .setProperty("/friends", data);
                  MessageToast.show("Friend added successfully");
                  oDialog.close();
                })
                .catch(function (error) {
                  Log.error("Failed to add friend");
                  MessageToast.show("Failed to add friend");
                });
            },
          }),
          endButton: new Button({
            text: "Cancel",
            press: function () {
              oDialog.close();
            },
          }),
        });

        oDialog.open();
      },

      onDeleteFriend: function (oEvent) {
        var oController = this;
        var oModel = this.getView().getModel("friendsModel");

        var oContext = oEvent.getSource().getBindingContext("friendsModel");
        var oFriend = oContext.getObject();

        FriendsModel.deleteFriend(oFriend.name.trim())
          .then(function (response) {
            MessageToast.show(response.message); // show backend message
            return $.ajax({ url: "/api/friends", method: "GET" });
          })
          .then(function (data) {
            oModel.setProperty("/friends", data);
          })
          .catch(function (error) {
            Log.error("Failed to delete friend");
            MessageToast.show("Failed to delete friend ");
          });
      },
    });
  }
);
