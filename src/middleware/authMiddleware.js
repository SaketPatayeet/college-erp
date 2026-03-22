const jwt = require('jsonwebtoken');

const auth = (req,res,next)=>{
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];//checks is auth header exists and then splits

    if(!token){
        res.status(401).json({message:'Unauthorized'});
    }else{
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = decoded;
            next();
        }catch{
            res.status(401).json({message:"Unathorized"});
        }
    }
    
}

const roleCheck = (role)=>{
    return (req,res,next)=>{
        if(req.user.role === role){
            next();//if role matches go to the next middleware
        }else{
            res.status(403).json({message:"Forbidden"});
        }
    }

}

module.exports = {auth,roleCheck};