//require("dotenv").config();
import dotenv from "dotenv";
import connectDb from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "/.env",
});

connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log("error express not connecting to database", error);
      throw error;
    });
    app.listen(process.env.PORT || 3000, () => {
      console.log(`server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("monogdb connection failed", error);
    process.exit(1);
  });
export { app };
