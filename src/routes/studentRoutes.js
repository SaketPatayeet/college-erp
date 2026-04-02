    const express = require('express');
    const {auth,roleCheck} = require('../middleware/authMiddleware');
    const {enroll,getEnrollment} = require('../controllers/studentController');

    const router = express.Router();

    router.post('/student/enroll',auth,roleCheck('student'),enroll);
    router.get('/student/getEnrollment/:CourseID',auth,roleCheck('student'),getEnrollment);

    module.exports = router;