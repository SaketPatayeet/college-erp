const express = require('express');
const {auth,roleCheck} = require('../middleware/authMiddleware');
const router = express.Router();
const {getAllStudents, createStudents, getAllProfessors, createProfessors,getAllCourses,
    createCourses,assignProfessorToCourse,getAllCourseAssignments, 
    deleteStudent,deleteProfessor,deleteCourse,deleteCourseAssignment} = require('../controllers/adminController');

router.get('/admin/AllStudents',auth,roleCheck('admin'),getAllStudents);
router.post('/admin/createStudents',auth,roleCheck('admin'),createStudents);

router.get('/admin/AllProfessors',auth,roleCheck('admin'),getAllProfessors);
router.post('/admin/createProfessors',auth,roleCheck('admin'),createProfessors);

router.get('/admin/AllCourses',auth,roleCheck('admin'),getAllCourses);
router.post('/admin/createCourses',auth,roleCheck('admin'),createCourses);

router.get('/admin/getAllCourseAssignments',auth,roleCheck('admin'),getAllCourseAssignments);
router.post('/admin/assignProfessorToCourse',auth,roleCheck('admin'),assignProfessorToCourse);

router.delete('/admin/deleteStudent/:id',auth,roleCheck('admin'),deleteStudent);
router.delete('/admin/deleteProfessor/:id',auth,roleCheck('admin'),deleteProfessor);
router.delete('/admin/deleteCourse/:id',auth,roleCheck('admin'),deleteCourse);
router.delete('/admin/deleteCourseAssignment/:courseId/:professorId',auth,roleCheck('admin'),deleteCourseAssignment);

module.exports = router;