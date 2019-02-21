const uuidv4 = require("uuid/v4");
const mongoCollections = require("../config/mongoCollections");
const projects = mongoCollections.projects;

module.exports = {
    async createProject(title, description, sponsors, majors, size, visibility, lockout, locked, creator) {
        if (title === null) throw "Project must have a title";
        if (description === null) throw "Project must have a description";
        // Add a check for members
		date = "" //find current date
        const projectsCollection = await projects();

        const uuid = uuidv4();

        const newProject = {
            "_id": uuid,
            "title": title,
            "description": description,
			"author": creator,
			"date": date,
			"views": 0,
			"visibility": visibility,
            "sponsors": sponsors,
            "locked": locked,			
            "majors": majors,
            "size": size,
            "lockout": lockout,
            "members": [creator]
        }

        const insertInfo = await projectsCollection.insertOne(newProject);
        if (insertInfo.insertedCount === 0) throw "Could not create project";
    },

    // Retrieves all projects
    async getProjects() {
        const projectsCollection = await projects();

        const projectsArray = await projectsCollection.find().toArray();

        return projectsArray;
    },

    // Deletes a project given a project ID
    async deleteProject(projectId) {
        if (!projectId) throw "Project ID must be provided";

        const projectsCollection = await projects();

        const deletionInfo = await projectsCollection.removeOne( {_id: projectId} );
        if (deletionInfo.deletedCount === 0) throw "could not delete project";

    }
}