
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require("node-uuid");

async function addUser(userName, type, deparment) {

  return users().then(usersCollection => {
    let newUser = {
      _id: uuid.v4(),
      userName: userName,
      type: type,
      deparment: deparment
    };

    return usersCollection
      .insertOne(newUser)
      .then(newInsertInformation => {
        return newInsertInformation.insertedId;
      })
      .then(newId => {
        return newId;
        //return this.checkForExistingUser(newId);
      });
  });
}

async function checkForExistingUser(userName) {
  if (!username) return false;
  return users().then(usersCollection => {
    return usersCollection.findOne({ userName: userName.toLowerCase() }).then(account => {
      if (!account) return false;
      return account;
    });
  });
}

let exportedMethods = { addUser, checkForExistingUser }
module.exports = exportedMethods;