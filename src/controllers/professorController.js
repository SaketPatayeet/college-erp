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

const getAllAttendance = async (req,res)=>{
    const ProfessorID = req.user.id;
    const CourseID = req.params.CourseID;

    const checkAssignment = await pool.query('SELECT * FROM COURSEASSIGNMENT WHERE ProfessorID = $1 AND CourseID = $2',
        [ProfessorID,CourseID]);
    
    if(checkAssignment.rowCount == 0){
        return res.status(404).json({message:"Incorrect Professor ID!"});
    }

    const getAttendance = await pool.query(`SELECT s.studentid,s.firstname, s.lastname, COUNT(*) as total_classes, SUM(CASE WHEN a.attendancestatus = 'present' THEN 1 ELSE 0 END) as present_count, ROUND(SUM(CASE WHEN a.attendancestatus = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as percentage FROM STUDENT AS s INNER JOIN ATTENDANCE AS a ON s.studentid = a.studentid WHERE a.CourseID = $1 GROUP BY s.studentid, s.firstname, s.lastname`,
        [CourseID]
    );
    
    return res.status(200).json({message:getAttendance.rows});
}

const updateAttendance = async (req,res)=>{
    const AttendanceID = req.params.id;
    const {StudentID,CourseID,AttendanceStatus} = req.body;

    const checkAttendance = await pool.query('SELECT * FROM ATTENDANCE WHERE AttendanceID = $1 AND CourseID = $2 AND StudentID = $3',
        [AttendanceID,CourseID,StudentID]
    );

    if(checkAttendance.rowCount == 0){
        return res.status(404).json({message:"Invalid Attendance!"});
    }

    try{
        await pool.query('UPDATE ATTENDANCE SET AttendanceStatus = $1 WHERE AttendanceID = $2',
            [AttendanceStatus,AttendanceID]
        );
        
        return res.status(200).json({message:"Updated Attendance!"});
    }catch (error){
        throw error;
    }
}

const createAssignment = async (req,res)=>{
    const ProfessorID = req.user.id;
    const {CourseID,Title,Description,dueDate} = req.body;

    const checkAssignment = await pool.query('SELECT * FROM COURSEASSIGNMENT WHERE CourseID = $1 AND ProfessorID=$2',
        [CourseID,ProfessorID]
    );

    if(checkAssignment.rowCount == 0){
        return res.status(404).json({message:"Professor not assigned!"});
    }

    try{

        const now = new Date();
        const date = now.toISOString().split('T')[0];
        await pool.query('INSERT INTO ASSIGNMENT (CourseID,ProfessorID,Title,AssignmentDescription,Duedate,UploadedAt) VALUES ($1,$2,$3,$4,$5,$6)',
            [CourseID,ProfessorID,Title,Description,dueDate,date]
        );

        return res.status(201).json({message:"Created Assignment!"});
    }catch (error){
        throw error;
    }
}

const viewAssignments = async (req,res)=>{
    const ProfessorID = req.user.id;
    const CourseID = req.params.CourseID;

    const checkAssignment = await pool.query('SELECT * FROM COURSEASSIGNMENT WHERE CourseID = $1 AND ProfessorID = $2',
        [CourseID,ProfessorID]
    );

    if(checkAssignment.rowCount == 0){
        return res.status(404).json({message:"Invalid CourseID!"});
    }else{
        const getAssignments = await pool.query('SELECT * FROM ASSIGNMENT WHERE CourseID = $1 AND ProfessorID = $2',
            [CourseID,ProfessorID]
        );

        return res.status(200).json({message:getAssignments.rows});
    }
}

const uploadResources = async (req,res)=>{
    const ProfessorID = req.user.id;
    const CourseID = req.params.CourseID;
    const {Title,FileURL} = req.body;

    const checkAssignment = await pool.query('SELECT * FROM COURSEASSIGNMENT WHERE CourseID=$1 AND ProfessorID=$2',
        [CourseID,ProfessorID]
    );
    if(checkAssignment.rowCount == 0){
        return res.status(404).json({message:"Invalid CourseID!"});
    }else{
        try{

            const now = new Date();
            const date = now.toISOString().split('T')[0];
            await pool.query('INSERT INTO RESOURCES (CourseID,ProfessorID,UploadedAt,Title,FileURL) VALUES ($1,$2,$3,$4,$5)',
                [CourseID,ProfessorID,date,Title,FileURL]
            );

            return res.status(201).json({message:"Created Resource!"});
        }catch (error){
            throw error;
        }
    }
}

const viewResources = async (req,res)=>{
    const ProfessorID = req.user.id;
    const CourseID = req.params.CourseID;
    
    const checkAssignment = await pool.query('SELECT * FROM COURSEASSIGNMENT WHERE CourseID=$1 AND ProfessorID=$2',
        [CourseID,ProfessorID]
    );
    if(checkAssignment.rowCount == 0){
        return res.status(404).json({message:"Invalid CourseID!"});
    }else{
        const getResources = await pool.query('SELECT * FROM RESOURCES WHERE CourseID = $1 AND ProfessorID = $2',
            [CourseID,ProfessorID]
        );
        
        if(getResources.rowCount == 0){
            return res.status(200).json({message:"No Resources"});
        }else{
            return res.status(200).json({message:getResources.rows});
        }
    }
}

const uploadGrades = async (req,res)=>{
    const ProfessorID = req.user.id;
    const {StudentID,CourseID,Grades} = req.body;

    const checkAssignment = await pool.query('SELECT * FROM COURSEASSIGNMENT WHERE ProfessorID = $1 AND CourseID = $2',
        [ProfessorID,CourseID]
    );

    if(checkAssignment.rowCount == 0){
        return res.status(404).json({message:"Professor not assigned!"});
    }

    const checkEnrollment = await pool.query('SELECT * FROM ENROLLMENT WHERE StudentID = $1 AND CourseID = $2',
        [StudentID,CourseID]
    );

    if(checkEnrollment.rowCount == 0){
        return res.status(404).json({message:"No Students enrolled!"});
    }

    try{
        await pool.query('UPDATE ENROLLMENT SET Grades=$1 WHERE StudentID = $2 AND CourseID = $3',
            [Grades,StudentID,CourseID]
        );

        return res.status(201).json({message:"Updated Grades!"});
    }catch (error){
        throw error;
    }
}

const getGrades = async (req,res)=>{
    const ProfessorID = req.user.id;
    const {CourseID,StudentID} = req.params;

    const checkAssignment = await pool.query('SELECT * FROM COURSEASSIGNMENT WHERE ProfessorID = $1 AND CourseID = $2',
        [ProfessorID,CourseID]
    );

    if(checkAssignment.rowCount == 0){
        return res.status(404).json({message:"Professor not assigned!"});
    }

    const checkEnrollment = await pool.query('SELECT * FROM ENROLLMENT WHERE StudentID = $1 AND CourseID = $2',
        [StudentID,CourseID]
    );

    if(checkEnrollment.rowCount == 0){
        return res.status(404).json({message:"No Students enrolled!"});
    }

    const grades = await pool.query('SELECT * FROM ENROLLMENT WHERE StudentID=$1 AND CourseID = $2',
        [StudentID,CourseID]
    );

    return res.status(200).json({message:grades.rows});
}

module.exports = {getMyCourses,markAttendance,getAllAttendance,updateAttendance,createAssignment,viewAssignments,uploadResources,viewResources,uploadGrades,getGrades};