sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function(JSONModel) {
    "use strict";

    return {
        createLoginModel: function() {
            
            var oModel = new JSONModel({
                userName: "",
                password: "",
                loginSuccessful: false,
                errorMessage: " "
            });
            
            return oModel;
        }
    };
});