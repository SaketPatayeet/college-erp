const express = require('express');
const {auth,roleCheck} = require('../middleware/authMiddleware');
const {getMyCourses,markAttendance} = require('../controllers/professorController');

const router = express.Router();

router.get('/professor/getMyCourses',auth,roleCheck('professor'),getMyCourses);
router.post('/professor/markAttendance',auth,roleCheck('professor'),markAttendance);

module.exports = router;