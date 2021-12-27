const express = require("express");
const router = express.Router();
const passport = require("passport");
const usersController = require("../controllers/usersController");

router.get("/sign-up", usersController.signUp);
router.get("/sign-in", usersController.signIn);
router.post("/create-user", usersController.create);
// use passport as a middleware to authenticate
router.post("/create-session", passport.authenticate("local", { failureRedirect: "/users/sign-in" }), usersController.createSession);

// passport to destroy session
router.get("/sign-out", usersController.destroySession);


// for google auth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: "/users/sign-in" }), usersController.createSession);

// for facebook auth
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: "/users/sign-in" }), usersController.createSession);

module.exports = router;