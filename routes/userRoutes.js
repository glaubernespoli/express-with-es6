import express from "express";
import { getUsers, saveUser } from "../controllers/userController.js";

const router = express.Router(); //defining the router variable
//all routes in this file are defined at /users, as defined in the server.js file
router.get("/", (req, res) => {
  getUsers()
    .then((data) => res.json(data))
    .catch((err) => {
      console.log(err);
      res.send("Error in getting the users list.");
    });
});

router.post("/add", (req, res) => {
  saveUser(req.body)
    //defining here the status code as 201 (Created). Ideally, every error should also arrive at the catch() with its status code to be returned.
    .then((val) => res.status(201).json(val))
    .catch((err) => {
      console.log(err);
      res.send("Error in saving the new user: " + err.message);
    });
});

export default router;
