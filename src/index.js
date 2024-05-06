//require("dotenv").config();
import dotenv from "dotenv";
import connectDb from "./db/index.js";
import express from "express";
const app = express();
dotenv.config({
  path: "./env",
});

connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log("error express not connecting to database", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server running at the port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("monogdb connection failed", error);
    process.exit(1);
  });

// import express from "expresss";
// app=express()
// ;(async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}` )
//         app.on("error",(error)=>{
//             console.log("error express not connecting to database",error);
//             throw error
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`app is listening on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.log("ERROr: ", error);
//         throw error
//     }
// })()
