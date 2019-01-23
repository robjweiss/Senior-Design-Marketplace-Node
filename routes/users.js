const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const uuid = require("node-uuid");
const xss = require("xss");

router.use("/", async function (req, res, next) {
    if (xss(req.originalUrl) == "/") {
        let valID = await usersData.validateSessionId(xss(req.cookies.sessionId));
        if (xss(req.cookies.name) === 'AuthCookie' && valID) {
            next();
        } else {
            res.render("pages/index", {
                title: "Login"
            });
        }
    } else {
        next();
    }
});

router.use("/private", async function (req, res, next) {
    if (xss(req.cookies.name) === 'AuthCookie' && await usersData.validateSessionId(xss(req.cookies.sessionId))) {
        next();
    } else {
        res.clearCookie('name')
        res.clearCookie('sessionId')
        res.redirect("/")
        return;
    }
});

router.post("/signup", async function (req, res) {
    let firstName = xss(req.body.firstName);
    let lastName = xss(req.body.lastName);
    let username = xss(req.body.username);
    let password = xss(req.body.password);
    let password2 = xss(req.body.password2);
    const badUsername = await usersData.checkForExistingUser(username);

    if(password !== password2){
        let error = ""
        error = "Passwords do not match"
        res.render("pages/signup", {
            title: "Sign-Up",
            error: error
        });
    }else if (badUsername) {
        let error = ""
        error = "User already exist"
        res.render("pages/signup", {
            title: "Sign-Up",
            error: error
        });
    } else {
        await usersData.addUser(firstName, lastName, username, password);
        res.cookie('name', 'AuthCookie')
        const sessionId = uuid.v4();
        res.cookie("sessionId", sessionId)
        await usersData.addSessionId(sessionId, username)
        res.redirect("/private");
    }

});

router.get("/signup", async function (req, res) {
    res.render("pages/signup", {
        title: "Sign-Up"
    })
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

router.get("/", async function (req, res) {
    if (xss(req.cookies.name) === 'AuthCookie' && await usersData.validateSessionId(xss(req.cookies.sessionId))) {
        res.redirect("/private");
    } else {
        res.render("pages/index", {
            title: "Login"
        });
    }
});

router.get("/private", async function (req, res) {
    const sessionId = xss(req.cookies.sessionId);
    const user = await usersData.getUserInfoById(sessionId);
    let preGoalData = await goalsData.getAllGoals(user.Account.userName);
    let transactionData = await transHistory.getAllTransactions(user.Account.userName);
    let goalData = utilities.percentOfGoals(preGoalData, transactionData);
    let totalSpending = utilities.totalSpending(transactionData);
    let totalCategories = utilities.totalCategories(transactionData);
    let totalGoals = utilities.totalGoals(goalData);
    res.render("pages/private", {
        firstName: user.Account.firstName,
        lastName: user.Account.lastName,
        goalData: goalData,
        transactionData: transactionData,
        totalSpending: totalSpending,
        totalCategories: totalCategories,
        totalGoals: totalGoals
    });
});

router.get("/logout", async function (req, res) {
    const sessionId = xss(req.cookies.sessionId);
    await usersData.removeSessionId(sessionId);
    res.clearCookie('name')
    res.clearCookie('sessionId')
    res.render("pages/logout", {
        title: "You are now logged out!"
    })
});

module.exports = router;