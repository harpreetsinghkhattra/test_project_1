/** Route parameters */
module.exports = {
    routesFields: {
        login: ["email", "password"],
        forgetPassword: ["email"],
        userSignup: ["email", "password", "mobile_number", "terms_and_conditions"],
        resetPassword: ["email", "password"],
        logout: ["id", "accessToken"],
        sellerSignup: ["category", "buisness_name", "buisness_address", "name", "mobile_number", "email"],
        verification: ["otp"],
        editUser: ["user_name", "name", "bio", "dob", "user_img", "email", "mobile_number"],
        getUser: ["id", "accessToken"],
        sendFriendRequest: ["id", "accessToken", "uid", "fid"],
        acceptFriendRequest: ["id", "accessToken", "status", "request_id", "uid", "fid"],
        getFriendsList: ["id", "accessToken"]
    }
}