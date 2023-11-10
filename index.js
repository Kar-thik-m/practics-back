import express  from "express";
import cors from "cors";
import dbconnect from "./db-utils/mongoosconnect.js";
import userRouter from "./rooures/user.js";
import urlRouter from "./rooures/urlRoute.js";

const app=express();

const PORT =process.env.PORT || 2222;

await dbconnect();
app.use(cors());
app.use(express.json());

app.use('/api',userRouter);
app.use('/api',urlRouter);

app.get('/',  (req, res)=> {
  res.send('hi welcome ');
})

app.listen(PORT,()=>{console.log("run api app")});