const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const uuid = require("node-uuid");
const xss = require("xss");

router.get("/", async function (req, res) {
    res.render("pages/login", {
        title: "Login"
    });
});

router.post("/login", async function (req, res) {
    let username = xss(req.body.username);
    let password = xss(req.body.password);

    const goodUsername = await usersData.checkForExistingUser(username);
    const goodPassword = await usersData.validatePassword(username, password);
    if (goodUsername && goodPassword) {
        res.cookie('name', 'AuthCookie')
        const sessionId = uuid.v4();
        res.cookie("sessionId", sessionId)
        await usersData.addSessionId(sessionId, username)
        res.redirect("/private");
    } else {
        let error = ""
        if (!goodUsername) {
            error = "User does not exist"
        } else {
            error = "Password is invalid"
        }
        res.render("pages/index", {
            title: "Login",
            error: error
        });
    }
    return req.cookies.sessionId
});

router.get("/createProject", async function (req, res) {
    res.render("pages/createProject");
});

router.get("/createProposal", async function (req, res) {
    res.render("pages/createProposal");
});

router.get("/landing", async function (req, res) {
    res.render("pages/landing");
});

router.get("/projects", async function (req, res) {
    res.render("pages/projects");
});




module.exports = router;