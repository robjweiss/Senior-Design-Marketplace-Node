const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const uuid = require("node-uuid");
const xss = require("xss");
const passport = require("passport");
const projectData = data.projects;
const proposalData = data.proposals;

router.post('/login/callback',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  }
);

router.get('/login',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  }
);

const projectsDB = data.projects;

router.get("/", async function (req, res) {
    res.redirect("/projects")
});

// router.post("/login", async function (req, res) {
//     let username = xss(req.body.username);
//     let password = xss(req.body.password);

//     const goodUsername = await usersData.checkForExistingUser(username);
//     const goodPassword = await usersData.validatePassword(username, password);
//     if (goodUsername && goodPassword) {
//         res.cookie('name', 'AuthCookie')
//         const sessionId = uuid.v4();
//         res.cookie("sessionId", sessionId)
//         await usersData.addSessionId(sessionId, username)
//         res.redirect("/private");
//     } else {
//         let error = ""
//         if (!goodUsername) {
//             error = "User does not exist"
//         } else {
//             error = "Password is invalid"
//         }
//         res.render("pages/index", {
//             title: "Login",
//             error: error
//         });
//     }
//     return req.cookies.sessionId
// });

router.get("/createProject", async function (req, res) {
    res.render("pages/createProject");
});

router.get("/createProposal", async function (req, res) {
    res.render("pages/createProposal");
});

router.get("/admin", async function (req, res) {
    let allProjectData = await projectData.getProjects()
    let allProposalData = await proposalData.getProposal()
    res.render("pages/admin", {projects: allProjectData, proposals: allProposalData});
});

router.get("/landing", async function (req, res) {
    res.render("pages/landing");
});

router.get("/newStudent", async function (req, res) {
    res.render("pages/newStudent");
});

router.get("/newProf", async function (req, res) {
    res.render("pages/newProf");
});

router.get("/projects", async function (req, res) {
	p = JSON.stringify(await projectsDB.getProjects());
    res.render("pages/projects", {projects: p});
});

router.post("/create", async function (req, res) {
    title= req.body.title;
    description = req.body.description;
    sponsors= req.body.sponsors;
    majors= req.body.majors;
    size= req.body.size;
    visibility= req.body.visibility;
    lockout= req.body.lockout;
    locked= req.body.locked;
    creator= req.body.creator;
    await projectData.createProject(title, description, sponsors, majors, size, visibility, lockout, locked, creator);
});

router.post("/createproposal", async function (req, res) {
    title= req.body.title;
    description = req.body.description;
    sponsors= req.body.sponsors;
    majors= req.body.majors;
    creator= req.body.creator;
    await proposalData.createProposal(title, description, sponsors, majors, creator);
});

module.exports = router;