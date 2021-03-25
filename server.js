//NOTE: to work with ES6 modules, you need to add "type": "module" in your package.json

//1. Import modules and files that I need
import express from "express";
import logger from "morgan";
import userRouter from "./routes/userRoutes.js";
//End of 1st Step

//2. Create express application, use middlewares and configure the app
const app = express();

//Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//End of 2nd step

//3. Define the behavior of the app, create the routes
app.use("/users", userRouter);
//End of 3rd step

//4. Start listening to the port
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Application listening to port ${PORT}`);
  }
});
