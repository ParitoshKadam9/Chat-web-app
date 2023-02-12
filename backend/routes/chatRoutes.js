const express = require('express')
const {accessChat, fetchChat, createGroup, renameGrp, removeFrmGrp, addToGrp} = require('../controllers/chatControllers');

const router = express.Router();

router.route("/").post(accessChat);
router.route("/aaa").get(fetchChat);
router.route("/group").post(createGroup)
router.route("/rename").put(renameGrp);
router.route("/grpRmv").put(removeFrmGrp);
router.route("/grpAd").put(addToGrp);

module.exports= router;