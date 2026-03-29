const pool = require('../db');

const getMyCourses = async (req,res)=>{
    const professorId = req.user.id;
    
    const MyCourses = await pool.query('SELECT * FROM COURSE AS c INNER JOIN COURSEASSIGNMENT AS ca ON c.CourseID = ca.CourseID WHERE ca.ProfessorID = $1',
        [professorId]
    );

    if(MyCourses.rowCount == 0){
        return res.status(200).json({message:"No Course Assignment!"});
    }else{
        return res.status(200).json({message:MyCourses.rows});
    }
}

const markAttendance = async (req,res)=>{
    //check if the course belongs to the professor
    //check if the student is enrolled in the course
    //check for double 
    //Mark attendance
    const ProfessorID = req.user.id;
    const {StudentID,CourseID,AttendanceStatus} = req.body;

    const checkAssignment = await pool.query('SELECT * FROM COURSEASSIGNMENT WHERE ProfessorID = $1 AND CourseID = $2',
        [ProfessorID,CourseID]);
    
    if(checkAssignment.rowCount == 0){
        return res.status(404).json({message:"Incorrect Professor ID!"});
    }

    const checkEnrollment = await pool.query('SELECT * FROM ENROLLMENT WHERE StudentID = $1 AND CourseID = $2',
        [StudentID,CourseID]
    );

    if(checkEnrollment.rowCount == 0){
        return res.status(404).json({message:"Student not Enrolled!"});
    }

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    const checkDouble = await pool.query('SELECT * FROM ATTENDANCE WHERE StudentID = $1 AND CourseID = $2 AND AttendanceDate = $3 AND EXTRACT(HOUR FROM AttendanceTime) = EXTRACT(HOUR FROM CURRENT_TIME)',
        [StudentID,CourseID,date]
    );

    if(checkDouble.rowCount != 0){
        return res.status(404).json({message:"Already Marked!"});
    }

    try{
        await pool.query('INSERT INTO ATTENDANCE (StudentID,CourseID,AttendanceDate,AttendanceTime,AttendanceStatus) VALUES ($1,$2,$3,$4,$5)',
            [StudentID,CourseID,date,time,AttendanceStatus]
        );

        return res.status(201).json({message:"Attendance Marked!"});
    }catch (error){
        throw error;
    }
}

module.exports = {getMyCourses,markAttendance};