const express = require('express');
const router = express.Router();
const { regUser, authUser, allUsers } = require("../controllers/userControllers")
const {protect} = require("../middlewares/auth")

// router.route('/login')
router.route("/signUp").post(regUser).get(allUsers);
router.post("/auth", authUser)

module.exports = router;