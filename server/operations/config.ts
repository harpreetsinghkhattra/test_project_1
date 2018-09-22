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
        editUserProfile: ["id", "accessToken", "category", "business_name", "business_address", "name", "mobile_number", "email"],
        editUser: ["user_name", "name", "bio", "dob", "user_img", "email", "mobile_number"],
        getUser: ["id", "accessToken"],
        sendFriendRequest: ["id", "accessToken", "uid", "fid"],
        acceptFriendRequest: ["id", "accessToken", "status", "request_id", "uid", "fid"],
        getFriendsList: ["id", "accessToken"]
    }
}