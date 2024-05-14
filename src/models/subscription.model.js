import mongoose, { Schema, mongo } from "mongoose";
const subscriptionSchema = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,//one who subscribe
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId,//one to whom
        ref:"User"
    }
},{timestamps:true});

export const Subsciption = mongoose.model("subscriptio", subscriptionSchema);
