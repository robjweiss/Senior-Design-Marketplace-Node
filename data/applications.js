const mongoCollections = require("../config/mongoCollections");
const applications = mongoCollections.applications;
const uuid = require("node-uuid");

async function addApplication(user, project) {

  return applications().then(usersCollection => {
    let newA = {
      _id: uuid.v4(),
      applicant: user,
      project: project,
	  approval: null
    };

    return usersCollection
      .insertOne(newA)
      .then(newInsertInformation => {
        return newInsertInformation.insertedId;
      })
      .then(newId => {
        return newId;
        //return this.checkForExistingUser(newId);
      });
  });
  console.log("Added app");
}


let exportedMethods = { addApplication }
module.exports = exportedMethods;