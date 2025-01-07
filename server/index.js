const express = require('express');
const dotenv = require("dotenv");
const mongoose= require("mongoose");
const Post=require('./models/Post');
const app =new express();
const cors =require('cors');
const multer = require('multer');
dotenv.config();
const { MONGO_CONNECTION,PORT}= process.env;
mongoose.connect(MONGO_CONNECTION)

  .then((result)=>{
    console.log('mongodb connected successfull');
  })
  .catch((error)=>{
    console.log('Error connecting Mongodb');
  })
app.use(cors());
app.use (express.json());

const Upload =multer.memoryStorage;

app.post('/post/create', async(req,res)=>{
    console.log(req.body);
    const doc = req.body;
    try{
        if(doc!=null){
            const result= await Post.create(doc)
            res.status(201).json({result});
        }
        else{
            throw new Error ('data recived is null');
        }

    }catch(e)
    {
        res.status(500).json({message:e.message});
    }
}
)

app.get('/post/getAll', async(req,res)=>{
    const{}=req.params;
    try{
        result=await Post.find({}).exec();
        res.status(200).json({message:'Post Found',result});
    }catch(e){
        res.status(500).json({message: e.message})
    }
}
)
app.put('/post/update',async(req,res)=>{
    const { id } = req.body;
    const { dataToUpdate } = req.body;  
    try{
       const result=await Post.findByIdAndUpdate( id , dataToUpdate,{new:true});
       
            res.status(200).json({message:'Post Found',result});
        }
    catch(e){
        res.status(500).json({message: e.message});
    }
}
)
app.delete('/post/delete/:id', async(req,res)=>{
    const {id}=req.params;
    try{
        result=await Post.findByIdAndDelete(id).exec();
        res.status(200).json({message:'Post deleted successfully',result});
    }catch(e){
        res.status(500).json({message: e.message})
    }
}
)


app.get('/post/get/getlikesCount/:count', async(req,res)=>{
    const{count}=req.params;
    try{
        result=await Post.find({likescount:{$gte :count}}).exec();
        res.status(200).json({message:'Post Found',result});
    }catch(e){
        res.status(500).json({message: e.message})
    }
}
)

app.get('/post/get/FindLoc/:location', async(req,res)=>{
    const{location}=req.params;
    try{
        result=await Post.find({ location}, '_id description title').exec();
        res.status(200).json({message:'Post Found',result});
    }catch(e){
        res.status(500).json({message: e.message})
    }
}
)

app.listen(PORT,()=>{
    console.log('server Listening on port-',PORT);
})

