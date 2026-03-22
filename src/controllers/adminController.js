const pool = require('../db');
const bcrypt = require('bcryptjs');

const getAllStudents = async (req,res)=>{
    const AllStudents = await pool.query('SELECT studentid, firstname, lastname, class, rollno, department, emailid FROM STUDENT');

    if(AllStudents.rowCount == 0){
        res.status(404).json({message:"No Students!"});
    }else{
        res.status(200).json({message:AllStudents.rows});
    }
}

const createStudents = async (req,res)=>{
    const {firstName,lastName,Information, Class, RollNo, Department, emailID,Password} = req.body;
    const checkDouble = await pool.query('SELECT * FROM STUDENT WHERE emailID=$1',[emailID]);//checks if student already exists
    if(checkDouble.rowCount == 0){
        const hashedPassowrd = await bcrypt.hash(Password,10);
        try{
            await pool.query('INSERT INTO STUDENT (firstName,lastName,Information, Class, RollNo, Department, emailID,Password) values ($1,$2,$3,$4,$5,$6,$7,$8)',
                [firstName,lastName,Information, Class, RollNo, Department, emailID,hashedPassowrd]
            );
            res.status(201).json({message:"Student Created!"});
        }catch (error){
            throw error;
        }    
    }else{
        res.status(409).json({message:"Student Already exists!"});
    }
    
}

const getAllProfessors = async (req,res)=>{
    const AllProfessors = await pool.query('SELECT professorid, firstname, lastname,information,department,emailid FROM PROFESSOR');

    if(AllProfessors.rowCount == 0){
        res.status(404).json({message:"No Professors!"});
    }else{
        res.status(200).json({message:AllProfessors.rows});
    }
}

const createProfessors = async (req,res)=>{
    const {firstName,lastName,Information,Department, emailID,Password} = req.body;
    const checkDouble = await pool.query('SELECT * FROM PROFESSOR WHERE emailID = $1',[emailID]);//checks if professor already exists
    if(checkDouble.rowCount == 0){
        const hashedPassowrd = await bcrypt.hash(Password,10);
        try{
            await pool.query('INSERT INTO PROFESSOR (firstName,lastName,Information,Department, emailID,Password) VALUES ($1,$2,$3,$4,$5,$6)',
                [firstName,lastName,Information,Department, emailID,hashedPassowrd]
            );
            res.status(201).json({message:"Professor Created!"});
        }catch (error){
            throw error;
        }
    }else{
        res.status(409).json({message:"The Professor already exists!"});
    }
    
}

const getAllCourses = async (req,res)=>{
    const AllCourses = await pool.query('SELECT * FROM COURSE');

    if(AllCourses.rowCount == 0){
        res.status(404).json({message:"No Courses!"});
    }else{
        res.status(200).json({message:AllCourses.rows});
    }
}

const createCourses = async (req,res)=>{
    const {CourseName,Seats,Department,LessonPlan} = req.body;
    const checkDouble = await pool.query('SELECT * FROM COURSE WHERE CourseName = $1 AND Department = $2',[CourseName,Department]);//checks if course already exists

    if(checkDouble.rowCount == 0){
        try{
            await pool.query('INSERT INTO COURSE (CourseName,Seats,Department,LessonPlan) values ($1,$2,$3,$4)',
                [CourseName,Seats,Department,LessonPlan]
            );

            res.status(201).json({message:"Course Created!"});
        }catch (error){
            throw error;
        }
    }else{
        res.status(409).json({message:"The Course already exists!"});
    }
    
}

const assignProfessorToCourse = async (req,res)=>{
    const {CourseID,ProfessorID} = req.body;

    const checkProfessor = await pool.query('SELECT * FROM PROFESSOR WHERE ProfessorID = $1',
        [ProfessorID]
    );

    const checkCourse = await pool.query('SELECT * FROM COURSE WHERE CourseID = $1',
        [CourseID]
    );

    const checkDouble = await pool.query('SELECT * FROM COURSEASSIGNMENT WHERE CourseID = $1 AND ProfessorID=$2',
        [CourseID,ProfessorID]
    );

    if(checkProfessor.rowCount == 0){
        res.status(404).json({message:"Invalid Professor ID!"});
    }else if(checkCourse.rowCount == 0){
        res.status(404).json({message:"Invalid Course ID!"});
    }else if(checkDouble.rowCount != 0){
        res.status(409).json({message:"The Course has already been assigned!"});
    }else{
        await pool.query('INSERT INTO COURSEASSIGNMENT (CourseID,ProfessorID) values ($1,$2)',
            [CourseID,ProfessorID]
        );
        res.status(201).json({message:"Course Assigned!"});
    }
}

const getAllCourseAssignments = async (req,res)=>{
    const AllCourseAssignments = await pool.query('SELECT ca.CourseID,c.CourseName,ca.ProfessorID,p.firstName,p.lastName FROM COURSEASSIGNMENT AS ca INNER JOIN COURSE c ON ca.CourseID = c.CourseID INNER JOIN PROFESSOR as p ON ca.ProfessorID = p.ProfessorID');

    if(AllCourseAssignments.rowCount == 0){
        res.status(404).json({message:"No Courses Assigned!"});
    }else{
        res.status(200).json({message:AllCourseAssignments.rows});
    }
}

const deleteStudent = async (req,res)=>{
    const id = req.params.id;
    const getStudent = await pool.query('SELECT * FROM STUDENT WHERE StudentID = $1',[id]);

    if(getStudent.rowCount == 0){
        res.status(404).json({message:"Invalid Student ID!"});
    }else{
        try{
            await pool.query('DELETE FROM STUDENT WHERE StudentID = $1',[id]);
            res.status(200).json({message:"Deleted Student!"});
        }catch (error){
            throw error;
        }
    }
}

const deleteProfessor = async (req,res)=>{
    const id = req.params.id;
    const getProfessor = await pool.query('SELECT * FROM PROFESSOR WHERE ProfessorID = $1',[id]);

    if(getProfessor.rowCount == 0){
        res.status(404).json({message:"Invalid Professor ID!"});
    }else{
        try{
            await pool.query('DELETE FROM PROFESSOR WHERE ProfessorID = $1',[id]);
            res.status(200).json({message:"Deleted Professor!"});
        }catch (error){
            throw error;
        }
    }
}

const deleteCourse = async (req,res)=>{
    const id = req.params.id;
    const getCourse = await pool.query('SELECT * FROM COURSE WHERE CourseID = $1',[id]);

    if(getCourse.rowCount == 0){
        res.status(404).json({message:"Invalid Course ID!"});
    }else{
        try{
            await pool.query('DELETE FROM COURSE WHERE CourseID = $1',[id]);
            res.status(200).json({message:"Deleted Course!"});
        }catch (error){
            throw error;
        }
    }
}

const deleteCourseAssignment = async (req,res)=>{
    const {courseId,professorId} = req.params;
    const getCourseAssignment = await pool.query('SELECT * FROM COURSEASSIGNMENT WHERE CourseID = $1 AND ProfessorID = $2',
        [courseId,professorId]);

    if(getCourseAssignment.rowCount == 0){
        res.status(404).json({message:"Invalid Course Assignment Id!"});
    }else{
        try{
            await pool.query('DELETE FROM COURSEASSIGNMENT WHERE CourseID = $1 AND ProfessorID = $2',
                [courseId,professorId]
            );
            res.status(200).json({message:"Course Assignment Deleted!"});
        }catch (error){
            throw error;
        }
    }
}

module.exports = {getAllStudents,createStudents,getAllProfessors,createProfessors,getAllCourses,createCourses,assignProfessorToCourse,getAllCourseAssignments,deleteStudent,deleteProfessor,deleteCourse,deleteCourseAssignment};