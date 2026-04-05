const express = require('express');
const {auth,roleCheck} = require('../middleware/authMiddleware');
const {getMyCourses,markAttendance,getAllAttendance,updateAttendance,createAssignment,viewAssignments,uploadResources,viewResources,uploadGrades,getGrades,viewSubmissions} = require('../controllers/professorController');

const router = express.Router();

router.get('/professor/getMyCourses',auth,roleCheck('professor'),getMyCourses);
router.post('/professor/markAttendance',auth,roleCheck('professor'),markAttendance);
router.get('/professor/getAllAttendance/:CourseID',auth,roleCheck('professor'),getAllAttendance);
router.put('/professor/updateAttendance/:id',auth,roleCheck('professor'),updateAttendance);
router.post('/professor/createAssignment',auth,roleCheck('professor'),createAssignment);
router.get('/professor/viewAssignments/:CourseID',auth,roleCheck('professor'),viewAssignments);
router.post('/professor/uploadResources/:CourseID',auth,roleCheck('professor'),uploadResources);
router.get('/professor/viewResources/:CourseID',auth,roleCheck('professor'),viewResources);
router.put('/professor/uploadGrades',auth,roleCheck('professor'),uploadGrades);
router.get('/professor/getGrades/:CourseID/:StudentID',auth,roleCheck('professor'),getGrades);
router.get('/professor/viewSubmissions/:AssignmentID',auth,roleCheck('professor'),viewSubmissions);

module.exports = router;