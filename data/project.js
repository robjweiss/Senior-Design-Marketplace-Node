const uuidv4 = require("uuid/v4");
const mongoCollections = require("../config/mongoCollections");
const projects = mongoCollections.projects;

module.exports = {
    async createProject(title, description, sponsors, majors, size, visibility, lockout, locked, creator) {
        if (title === null) throw "Project must have a title";
        if (description === null) throw "Project must have a description";
        // Add a check for members

        const projectsCollection = await projects();

        const uuid = uuidv4();

        const newProject = {
            "_id": uuid,
            "title": title,
            "description": description,
            "sponsors": sponsors,
            "majors": majors,
            "size": size,
            "visibility": visibility,
            "lockout": lockout,
            "locked": locked,
            "members": [creator]
        }

        const insertInfo = await projectsCollection.insertOne(newProject);
        if (insertInfo.insertedCount === 0) throw "Could not create project";
    }
}