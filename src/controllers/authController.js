const pool = require('../db');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const studentLogin = async (req,res)=> {
    const {email,password} = req.body;
    const result = await pool.query(
        'SELECT * FROM STUDENT WHERE emailID = $1',
        [email]
    );

    if(result.rowCount == 0){
        res.status(404).json({message: "The Student was not found"});
    }else{
        bcrypt.compare(password,result.rows[0].password,(err,data)=>{
            if(err) throw err;

            if(data){
                const token = jwt.sign(
                    {id:result.rows[0].StudentID, role:"student"},
                    process.env.JWT_SECRET,
                    {expiresIn:"1d"}
                );

                return res.status(200).json({token:token,message:"Login Successful"});
            }else{
                return res.status(404).json({message:"Invalid credentials"});
            }
        });
    }
};

const professorLogin = async (req,res)=>{
    const {email,password} = req.body;
    const result = await pool.query(
        'SELECT * FROM PROFESSOR WHERE emailID = $1',
        [email]
    );

    if(result.rowCount == 0){
        res.status(404).json({message:"The Professor was not found"});
    }else{
        bcrypt.compare(password,result.rows[0].password,(err,data)=>{
            if(err) throw err;

            if(data){
                const token = jwt.sign(
                    {id:result.rows[0].ProfessorID, role:"professor"},
                    process.env.JWT_SECRET,
                    {expiresIn:"1d"}
                );

                return res.status(200).json({token: token,message:"Login Successful"});
            }else{
                return res.status(404).json({message:"Invalid Credential"});
            }
        });
    }
}

const adminLogin = async (req,res)=>{
    const {email,password} = req.body;

    const result = await pool.query(
        'SELECT * FROM ADMIN WHERE emailID=$1',
        [email]
    )

    if(result.rowCount == 0){
        res.status(404).json({message:"Admin not found!"});
    }else{
        bcrypt.compare(password,result.rows[0].password,(err,data)=>{
            if(err) throw err;

            if(data){
                const token = jwt.sign(
                    {id:result.rows[0].AdminID,role:"admin"},
                    process.env.JWT_SECRET,
                    {expiresIn:"1d"}
                );

                return res.status(200).json({token:token,message:"Login Successful"});
            }else{
                return res.status(404).json({message:"Invalid Credentials"});
            }
        });
    }
}

module.exports = {studentLogin,professorLogin,adminLogin};



