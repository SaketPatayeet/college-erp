const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post('/login/student',authController.studentLogin);
router.post('/login/professor',authController.professorLogin);
router.post('/login/admin',authController.adminLogin);

module.exports = router;