import express from 'express';
import { AppUserModel } from '../db-utils/moddal.js';
import { nanoid } from 'nanoid';
const  urlRouter=express.Router();
  

urlRouter.post('/urlcreate',async(req,res)=>{
    try{
        const payload=req.body.fullUrl;
       const checkUrl=await AppUserModel.findOne({fullUrl:payload});
        if(checkUrl){
            res.send(checkUrl)
        }else{
            const urlid=nanoid();
            const shorturl=`http://localhost:5173/shortUrl/${urlid}`
            const url=new AppUserModel({fullUrl:payload,urlId:urlid,shortUrl:shorturl});
            await url.save();
            try{
                const Url=await AppUserModel.findOne({fullUrl:payload},{urlId:1,shortUrl:1,clicks:1,date:1})
                res.send(Url);
            }catch(err){console.log(err.message)}
        }
        
    }
    catch(error)
    {
     console.log(error)
    }
})
 

urlRouter.get('/:urlId',async(req,res) => {
    try{
        const {urlId}=req.params;
        try{
            const id=await AppUserModel.findOne({urlId:urlId},{fullUrl:1,_id:0});
            if(id){
                await AppUserModel.updateOne({urlId:urlId},{$inc:{'clicks':1}})
            }
                res.send(id);
                console.log(id)
        }catch(err){res.status(err.statusCode)}
        
    }catch(err){
        console.log(err.message);
    }
})


urlRouter.get('/allurls',async (req, res)=>{
    try{
        await AppUserModel.find({},{_id:0}).toArray((err, data)=>{
            if(err) throw err;
            console.log(result)
        });
       
    }catch(err){console.log(err.message)}
})
export default urlRouter;