const express = require('express');
const {auth,roleCheck} = require('../middleware/authMiddleware');
const {getMyCourses,markAttendance,getAllAttendance,updateAttendance} = require('../controllers/professorController');

const router = express.Router();

router.get('/professor/getMyCourses',auth,roleCheck('professor'),getMyCourses);
router.post('/professor/markAttendance',auth,roleCheck('professor'),markAttendance);
router.get('/professor/getAllAttendance/:CourseID',auth,roleCheck('professor'),getAllAttendance);
router.put('/professor/updateAttendance/:id',auth,roleCheck('professor'),updateAttendance);

module.exports = router;