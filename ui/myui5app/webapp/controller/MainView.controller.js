sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function(Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("myui5app.controller.MainView", {
        onInit: function() {
            if (!this.getView().getModel("loginModel")) {
                var oLoginModel = new JSONModel({
                    username: "",
                    password: "",
                    loginSuccessful: false,
                    errorMessage: ""
                });
                this.getView().setModel(oLoginModel, "loginModel");
            }
        },

        onLogin: function() {
            var oView = this.getView();
            var oModel = oView.getModel("loginModel");
          
            var sUsername = oModel.getProperty("/username");
            var sPassword = oModel.getProperty("/password");

            if (!sUsername) {
                oModel.setProperty("/errorMessage", "Please enter username");
                MessageToast.show("Please enter username");
                return;
            }
            
            if (!sPassword) {
                oModel.setProperty("/errorMessage", "Please enter password");
                MessageToast.show("Please enter password");
                return;
            }
            
            
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("Second");

        }
    });
});