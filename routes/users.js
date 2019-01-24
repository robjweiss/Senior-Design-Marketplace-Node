const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const uuid = require("node-uuid");
const xss = require("xss");

router.get("/", async function (req, res) {
    res.render("pages/projects");
});


module.exports = router;