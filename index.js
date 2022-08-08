const express=require("express");
const mysql=require("mysql");
const app=express();
const PORT=3001;
const{encrypt,decrypt} = require("./EncryptionHandler");
const cors=require("cors");
app.use(cors());
app.use(express.json());
const db=mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"password",
    database:"PasswordManager"
});
db.connect(function(error){
    if(!!error){
        console.log(error);
    }else{
        console.log("connected");
    }
});
app.post("/addpassword",(req,res)=>{
    const {password,title}=req.body;
    const hashedPassword=encrypt(password);
    db.query("INSERT INTO passwords(password,title,iv)VALUES(?,?,?)",[hashedPassword.password,title,hashedPassword.iv],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.log("success");
        }
    });
});

app.get("/showpasswords",(req,res)=>{
    db.query("SELECT*FROM passwords;",(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    });
});

app.post("/decryptpassword",(req,res)=>{
    res.send(decrypt(req.body))
})
app.listen(PORT,()=>{
    console.log("Server is running :)");
});