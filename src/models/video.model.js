import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const VideoSchema = new Schema({
     videoFile:{
        type:String,//cloud ulr
        required:true,

     },
     thumbnail:{
        type:String,//cloud ulr
        required:true,
     },
     title:{
        type:String,
        required:true,
     },
     description:{
        type:String,
        required:true,
     },
     duration:{
        type:Number,//cloudinary url
        required:true,
     },
     views:{
        type:Number,
        default:0,
     },
     isPublished:{
        type:Boolean,
        default:true,
     },
     owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
       
     },
     
     

},{timestamps:true}
)
VideoSchema.puglin(mongooseAggregatePaginate)

export const Video=mongoose.model("Video",VideoSchema)