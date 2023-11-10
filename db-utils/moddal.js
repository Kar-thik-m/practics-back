import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    id: {
        type: 'string',
        require: true,
    },
    Name: {
        type: 'string',
        require: true,
    },
   
   email:{
        type:'string',
        require: true,
    },
    password:{
        
        type:'string',
        require: true,
    },
    role:{
    type:"string",
    require:true,//admin/normal
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    resetKey:{
        type:String,
        require:true,
    }
   
});




// model for the url
const urlSchema=new mongoose.Schema({
    fullUrl:{
        type:String,
        require:true
    },
    shortUrl:{
        type:String
    },
    urlId:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now()
    },
    clicks:{
        type:Number,
        default:0
    }
})

export const urlSchemaModel=mongoose.model('url',urlSchema)
 export const AppUserModel  = mongoose.model('userpass', userSchema);