import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv .config(); 


const username=process.env.DB_USERNAME ||'';
const password=process.env.DB_PASSWORD ||'';
const clustername=process.env.DB_CLUSTER||'';
const database=process.env.DB_DATABASE||'';


const cloudMongoUrl=`mongodb+srv://${username}:${password}@${clustername}/${database}?retryWrites=true&w=majority`;

const dbconnect = async ()=>{
    try{
    await mongoose.connect(cloudMongoUrl,{
        useNewUrlParser: true,
    });
    console.log('connected');
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
    };
    export default dbconnect;
    