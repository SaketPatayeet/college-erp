const pool = require('../db');

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

module.exports = {enroll,getEnrollment};