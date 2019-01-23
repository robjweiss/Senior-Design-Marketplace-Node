
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require("node-uuid");

async function addUser(firstName, lastName, userName, password) {

//   const hash = await bcrypt.hash(password, saltRounds);

  return users().then(usersCollection => {
    let newUser = {
      _id: uuid.v4(),
      username: userName.toLowerCase(),
      sessionId: "",
      hashedPassword: hash,
      Account: {
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        userName: userName.toLowerCase()
      }
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

async function checkForExistingUser(username) {
  if (!username) return false;
  return users().then(usersCollection => {
    return usersCollection.findOne({ username: username.toLowerCase() }).then(account => {
      if (!account) return false;
      return account;
    });
  });
}

async function checkForExistingUserById(userId) {
  if (!userId) return false;
  return users().then(usersCollection => {
    return usersCollection.findOne({ _id: userId}).then(account => {
      if (!account) return false;
      return account;
    });
  });
}

async function validatePassword(username, password) {
  const userInfo = await checkForExistingUser(username);
  let compareToMatch = false
  try {
    // compareToMatch = await bcrypt.compare(password, String(userInfo.hashedPassword))
  } catch (e) {
    throw (e)
  }
  return compareToMatch;
}


async function validateSessionId(sessionId) {
  if (!sessionId) return false;
  return users().then(usersCollection => {
    return usersCollection.findOne({ sessionId: sessionId }).then(account => {
      if (!account) return false;
      return account;
    });
  });
}

async function getUserInfoById(sessionId) {
  return validateSessionId(sessionId);
}

async function addSessionId(newsessionId, username) {
  const usersCollection = await users();


  const updatedInfo = await usersCollection.updateOne({ username: username }, { $set: {sessionId: newsessionId}});

  if (updatedInfo.modifiedCount === 0) {
    throw "could not update session id successfully";
  }

  return await this.checkForExistingUser(username);
}

async function removeSessionId(sessionId) {

  const userCollection = await users();

  const updatedInfo = await userCollection.updateOne({ sessionId: sessionId }, { $set: {sessionId: null }});

  if (updatedInfo.modifiedCount === 0) {
    throw "could not update user successfully";
  }

  return await this.getUserInfoById(sessionId);
}

let exportedMethods = { addUser, checkForExistingUser, checkForExistingUserById, validatePassword, validateSessionId, getUserInfoById, addSessionId, removeSessionId }
module.exports = exportedMethods;