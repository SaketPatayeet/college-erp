const pool = require('../db');

const checkEnrollment = async (StudentID,CourseID)=>{
    const result = await pool.query('SELECT * FROM ENROLLMENT WHERE StudentID = $1 AND CourseID = $2',
        [StudentID,CourseID]
    );

    return result.rowCount>0;
}

const enroll = async (req,res)=>{
    const StudentID = req.user.id;
    const {CourseID} = req.body;

    const checkAssignment = await pool.query('SELECT * FROM ENROLLMENT WHERE CourseID = $1 AND StudentID = $2',
        [CourseID,StudentID]
    );

    if(checkAssignment.rowCount == 0){
        try{
            await pool.query('INSERT INTO ENROLLMENT (StudentID,CourseID) VALUES ($1,$2)',
                [StudentID,CourseID]
            );

            return res.status(201).json({message:"Enrolled!"});
        }catch (error){
            throw error;
        }
    }else{
        return res.status(404).json({message:"Already Registered!"});
    }
}

const getEnrollment = async (req,res)=>{
    const StudentID = req.user.id;
    const CourseID = req.params.CourseID;

    const checkEnrollment = await pool.query('SELECT * FROM ENROLLMENT WHERE CourseID = $1 AND StudentID = $2',
        [CourseID,StudentID]
    );

    if(checkEnrollment.rowCount == 0){
        return res.status(200).json({message:"No Enrollments!"});
    }else{
        return res.status(200).json({message:checkEnrollment.rows});
    }
}

const getAttendance = async (req,res)=>{
    const StudentID = req.user.id;
    const CourseID = req.params.CourseID;
    
    const checkEnrollment = await pool.query('SELECT * FROM ENROLLMENT WHERE StudentID = $1 AND CourseID = $2',
        [StudentID,CourseID]
    );

    if(checkEnrollment.rowCount == 0){
        return res.status(404).json({message:"Student Not Enrolled!"});
    }

    const attendance = await pool.query('SELECT * FROM ATTENDANCE WHERE StudentID = $1 AND CourseID = $2',
        [StudentID,CourseID]
    );

    return res.status(200).json({message:attendance.rows});
}

const getResources = async (req,res)=>{
    const StudentID = req.user.id;
    const CourseID = req.params.CourseID;
    
    if(!await checkEnrollment(StudentID,CourseID)){
        return res.status(404).json({message:"Student Not Registered!"});
    }

    const resources = await pool.query('SELECT * FROM RESOURCES WHERE CourseID = $1',
        [CourseID]
    );

    return res.status(200).json({message:resources.rows});
}

const getAllAssignments = async (req,res)=>{
    const StudentID = req.user.id;
    const CourseID = req.params.CourseID;

    if(!await checkEnrollment(StudentID,CourseID)){
        return res.status(404).json({message:"Student Not Registered!"});
    }

    const allAssignments = await pool.query('SELECT * FROM ASSIGNMENT WHERE CourseID = $1',
        [CourseID]
    );

    return res.status(200).json({message:allAssignments.rows});
}

const getGrades = async (req,res)=>{
    const StudentID = req.user.id;
    const CourseID = req.params.CourseID;

    if(!await checkEnrollment(StudentID,CourseID)){
        return res.status(404).json({message:"Student not Registered!"});
    }

    const grades = await pool.query('SELECT Grades FROM ENROLLMENT WHERE StudentID = $1 AND CourseID = $2',
        [StudentID,CourseID]
    );

    return res.status(200).json({message:grades.rows});
}

const submitAssignments = async (req,res)=>{
    const StudentID = req.user.id;
    const {AssignmentID,FileURL} = req.body;

    const validAssignment = await pool.query('SELECT * FROM ASSIGNMENT AS a INNER JOIN ENROLLMENT AS e ON a.CourseID = e.CourseID WHERE StudentID=$1 AND AssignmentID = $2',
        [StudentID,AssignmentID]
    );

    if(validAssignment.rowCount==0){
        return res.status(404).json({message:"Not a valid Assignment!"});
    }

    const checkDouble = await pool.query('SELECT * FROM SUBMISSION WHERE AssignmentID = $1 AND StudentID = $2',
        [AssignmentID,StudentID]
    );

    if(checkDouble.rowCount>0){
        return res.status(404).json({message:"Already Submitted!"});
    }

    try{
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        await pool.query('INSERT INTO SUBMISSION (AssignmentID,StudentID,UploadedAt,FileURL) VALUES ($1,$2,$3,$4)',
            [AssignmentID,StudentID,date,FileURL]
        );

        return res.status(201).json({message:"Assignment Submitted!"});
    }catch (error){
        throw error;
    }
}

const viewSubmissions = async (req,res)=>{
    const StudentID = req.user.id;
    const AssignmentID = req.params.AssignmentID;

    const validAssignment = await pool.query('SELECT * FROM ASSIGNMENT AS a INNER JOIN ENROLLMENT AS e ON a.CourseID = e.CourseID WHERE StudentID = $1 AND AssignmentID = $2',
        [StudentID,AssignmentID]
    );

    if(validAssignment.rowCount == 0){
        return res.status(404).json({message:"Invalid Assignment!"});
    }

    const submissions = await pool.query('SELECT * FROM SUBMISSION WHERE AssignmentID = $1 AND StudentID = $2',
        [AssignmentID,StudentID]
    );

    return res.status(200).json({message:submissions.rows});
}

module.exports = {enroll,getEnrollment,getAttendance,getResources,getAllAssignments,getGrades,submitAssignments,viewSubmissions};