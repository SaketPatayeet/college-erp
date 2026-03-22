const pool = require('./db')
const bcrypt = require('bcryptjs');

const seed = async ()=>{
    const hashedPassword = await bcrypt.hash('test123',10);
    pool.query('INSERT INTO STUDENT (firstName,lastName,Information,Class,RollNo,Department,emailID,Password) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
        ['John','Doe','Test Info','SY',42,'Computer Science','student_test@gmail.com',hashedPassword]);

    pool.query('INSERT INTO PROFESSOR (firstName,lastName,Information,Department,emailID,Password) VALUES ($1,$2,$3,$4,$5,$6)',
        ['Alice','Johnson','Test Info','Computer Science','professor_test@gmail.com',hashedPassword]
    );

    pool.query('INSERT INTO ADMIN (firstName,lastName,Password,emailID) VALUES ($1,$2,$3,$4)',
        ['Bob','Gun',hashedPassword,'admin123@gmail.com']
    );
}

seed();