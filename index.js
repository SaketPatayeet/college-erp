const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const studentRoutes = require('./src/routes/studentRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(authRoutes);
//app.use(studentRoutes);
app.use(adminRoutes);

app.listen(port,()=>{
    console.log(`Connected to ${port}`);
});