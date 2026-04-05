    const express = require('express');
    const {auth,roleCheck} = require('../middleware/authMiddleware');
    const {enroll,getEnrollment,getAttendance,getResources, getAllAssignments, getGrades, submitAssignments, viewSubmissions} = require('../controllers/studentController');

    const router = express.Router();

    router.post('/student/enroll',auth,roleCheck('student'),enroll);
    router.get('/student/getEnrollment/:CourseID',auth,roleCheck('student'),getEnrollment);
    router.get('/student/getAttendance/:CourseID',auth,roleCheck('student'),getAttendance);
    router.get('/student/getResources/:CourseID',auth,roleCheck('student'),getResources);
    router.get('/student/getAllAssignments/:CourseID',auth,roleCheck('student'),getAllAssignments);
    router.get('/student/getGrades/:CourseID',auth,roleCheck('student'),getGrades);
    router.post('/student/submitAssignments',auth,roleCheck('student'),submitAssignments);
    router.get('/student/viewSubmissions/:AssignmentID',auth,roleCheck('student'),viewSubmissions);

    module.exports = router;