const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControllers = require("../controllers/users.js");


router
    .route("/signup")
    .get(userControllers.signupGet

    )
    .post(wrapAsync(userControllers.signupPost)
);

router
    .route("/login")
    .get(userControllers.loginGet

    )
    .post(saveRedirectUrl, 
        passport.authenticate("local",{
            failureRedirect:"/login", 
            failureFlash:true
        }),
    wrapAsync(userControllers.loginPost)
);

router.get("/logout",userControllers.logout);

module.exports = router;