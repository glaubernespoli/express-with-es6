//using the promises module within fs. Unlike the regular fs module, the fs/promises module encapsulates the return of the fs functions in a promise already.
import { promises as fs } from "fs";
import path from "path";
import User from "../model/User.js";

/**
 * since we're using ES6 modules, commonJS variables like __dirname don't exist.
 * Instead, we use the path.resolve() to get the **root** folder's path, so we don't need to join the '..' to go a folder up.
 */
const userPath = path.join(path.resolve(), "data", "users.json");

/**
 * Get the list of users on the database.
 * @returns {Promise<User>} a promise containing an *User*.
 */
export const getUsers = async () => {
  //the function is async, meaning it returns a promise
  const ignoredFields = ["password"]; //fields to be ignored when parsing the json
  return fs
    .readFile(userPath, {
      encoding: "utf8",
    }) //the readFile from fs.promises module returns a Buffer, so we need to define the encoding
    .then((data) =>
      //we assign the return value of the JSON.parse() into an instance of the User class
      Object.assign(
        new User(),
        //we use the reviver parameter from the JSON.parse() and ignore the fields we don't want to be returned
        JSON.parse(data, (key, value) => {
          if (ignoredFields.includes(key)) {
            return;
          } else {
            return value;
          }
        })
      )
    )
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

/**
 * Saves the user on the DB (our user.json file).
 * @param {Object} body an uncasted User object
 */
export const saveUser = async (body) => {
  return fs
    .readFile(userPath)
    .then(async (data) => {
      //our function is async because of the await within it
      const dataFile = JSON.parse(data); //parses the data file
      /**
       * Creates a variable of type *User* with the new data to be added.
       * @type {User} user
       */
      const newUser = Object.assign(new User(), {
        id: dataFile.users.length + 1,
        ...body,
      });
      dataFile.users.push(newUser);

      try {
        //this is not executed in parallel. We await for the file to be written to continue, as at this point,
        // since the saveUser() function itself is already async, we want the file to be written and that's it
        await fs.writeFile(userPath, JSON.stringify(dataFile, null, 2));
        return {
          //once written, we return a successful message and the added user
          message: "User sucessfully added.",
          user: newUser,
        };
      } catch (err) {
        //if we catch an error while WRITING the file (can ben personalized for this specific error)
        console.log(err);
        throw err;
      }
    })
    .catch((err) => {
      //if we catch an error while READING the file (can ben personalized for this specific error)
      console.log(err);
      throw err;
    });
};
