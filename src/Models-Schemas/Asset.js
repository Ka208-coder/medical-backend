import mongoose from "mongoose";

const AssetsSchema =new mongoose.Schema({
 
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    condition:{
        type:String,
        enum:["New","Used"],
        default:"used",
    },
    purchaseDate:{
        type:String,
        required:true
    },
    purchasePrice:{
        type:String,
        required:true
    },
   category:{
    type:String,
    enum:["Electronics","Furniture","Vehicles","Other"],
    default:"Other"
   },
   unit:
   {
    type:String,
    required:true
   }
})

export default mongoose.model("Assets",AssetsSchema)