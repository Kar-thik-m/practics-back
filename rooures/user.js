import express from 'express';
import { AppUserModel } from '../db-utils/moddal.js';

import nodemailer from 'nodemailer';

import bcrypt from "bcrypt";
import jwt  from 'jsonwebtoken';

const userRouter  = express.Router();
// Configure nodemailer to send emails
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'sparrowkarthik007@gmail.com',
    pass: 'gess xxge ihrh vrys',
  },
});
userRouter.post('/register',async function(req, res){
  const email=req.body.email;
  const checkUser=await AppUserModel.findOne({email:email})
  if(checkUser){
      res.status(409).send({message:"user already exists please login"});
      console.log("user already exists so login   ")
      return;
  }
  const password=await bcrypt.hash(req.body.password,10)
  const user=await AppUserModel({...req.body,password:password})
  await user.save(); 
  const verifyToken=jwt.sign({email:email},process.env.JWT_SECRET,{expiresIn:'1d'})
  const link=`${process.env.FRONTEND_URL}/verify?token=${verifyToken}`
  const mailOptions = {
    from: 'your_email@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
           Please click on the following link to complete the process:\n\n${ link}\n\n
           If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
      res.status(500).send('Failed to send the password reset email.');
    } else {
      res.status(200).send("user created successfully"+"data -> "+JSON.stringify(payload))
      console.log("user created successfully")
     
    }
  });

}) ;


userRouter.post('/login',async function(req,res){
  const payload=req.body;
  const user=await AppUserModel.findOne({email: payload.email},{email:1,firstname:1,lastname:1,password:1,isVerified:1})
 if(user.isVerified===false){
  res.status(402).send({message:"user  is not verified"})
  return
 }
  else if(user){
      bcrypt.compare(payload.password,user.password,(_err,result)=>{
      if(!result){
          res.status(401).send({message:"Invalid credentials"})
          return
      }
      else{ 
          const response =user.toObject();
          delete response.password
          console.log(response)
           res.send(response)  
      }
   }) 
 }
 else{
  res.status(404).send({code:-1,message:"User not found please try to create a new user"})
 }
});


userRouter.post('/verify',async (req, res)=>{
  const payload=req.body;
  try{
      jwt.verify(payload.token,process.env.JWT_SECRET,async(_err,result)=>{
          await AppUserModel.updateOne({email:result.email},{'$set':{isVerified:true}}) 
      })
      res.send({message:"user Verified"})
  }catch(err){
      console.log(err.message)
      res.status(500).send({message:"error in verification"})
  }
});

userRouter.post('/forgotpassword',async(req,res)=>{
  try {
  
   const email = req.body.email;
   const appUser = await user.findOne({ email: email }, { name: 1, email: 1, _id: 0 });
   if(appUser){
     const token=jwt.sign({email:email},process.env.JWT_SECRET,{expiresIn:'1d'});
     const link=`${process.env.FRONTEND_URL}/verify?token=${token}`
     await user.updateOne({email:email},{'$set':{token:token}})
   const mailOptions = {
     from: 'your_email@gmail.com',
     to: email,
     subject: 'Password Reset Request',
     text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link to complete the process:\n\n${ link}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
   };
 
   transporter.sendMail(mailOptions, (error) => {
     if (error) {
       console.log(error);
       res.status(500).send('Failed to send the password reset email.');
     } else {
       res.render('reset-success');
     }
   });
 }else{
   res.status(404).send({ msg: 'user not found' });
 }
  } catch (err) {
   console.log(err);
   res.status(500).send({ msg: 'Error in updating' })
  }
 
 });


 userRouter.post('/password-verify-token',async(req,res)=>{
 
  try{ 
      const token = req.body.token;
      jwt.verify(token,process.env.JWT_SECRET,async(err,result)=>{
         console.log(result,err)
          await AppUserModel.updateOne({email:result.email},{'$set':{passwordreset:true}})
          res.send({msg:"user verifed for password reset"})
      });
     
  }
 catch{
  res.status(500).send({msg:"verfication failed"}) 
 }  
})


userRouter.post('/updatePassword',async (req,res)=>{
  try{
      const payload=req.body;
      console.log(payload)
      const decodedtoken=jwt.verify(payload.token,process.env.JWT_SECRET)
      const hashedPassword=await bcrypt.hash(payload.password,10)
      console.log(decodedtoken.email,hashedPassword,payload.password)
      const verified=await AppUserModel.findOne({email:decodedtoken.email},{passwordreset:1})
      console.log("verified"+verified)
      if(verified.passwordreset==true){
          await AppUserModel.updateOne({email:decodedtoken.email},{'$set':{password:hashedPassword,token:'',passwordreset:false}});
          res.send({msg:"updated password"})
      }
      else{
          res.status(401).send({msg:"still password reset validation is not done"})
      }
     
      
  
  }catch{
      res.status(500).send({msg:"passwords updation failed"})  
  }
})


export default userRouter;