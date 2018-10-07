/** Route parameters */
module.exports = {
    routesFields: {
        login: ["email", "password"],
        loginViaFBAndGmail: ["userId", "email", "name"],
        forgetPassword: ["email"],
        userSignup: ["email", "password", "mobile_number", "terms_and_conditions"],
        resetPassword: ["email", "password"],
        logout: ["id", "accessToken"],
        sellerSignup: ["category", "business_name", "business_address", "name", "mobile_number", "email", "password", "terms_and_conditions"],
        verification: ["email", "token"],
        resendOTP: ["email"],
        editSellerProfile: ["id", "accessToken", "category", "business_name", "business_address", "name", "mobile_number", "email"],
        editUserProfile: ["id", "accessToken", "name", "mobile_number", "email", "location"],
        editUser: ["user_name", "name", "bio", "dob", "user_img", "email", "mobile_number"],
        editProfileImage: ["id", "accessToken", "imagePath"],
        getUser: ["id", "accessToken"],
        addProduct: ["id", "accessToken", "name", "description", "category", "itemCode", "price"],
        editProduct: ["id", "accessToken", "name", "description", "category", "itemCode", "price", "status", "deletedStatus"],
        uploadProductFiles: ["id", "accessToken", "itemCode", "images"],
        finalConfirmationOfProduct: ["id", "accessToken", "itemCode"],
        sendFriendRequest: ["id", "accessToken", "uid", "fid"],
        acceptFriendRequest: ["id", "accessToken", "status", "request_id", "uid", "fid"],
        getFriendsList: ["id", "accessToken"]
    }
}