const uuidv4 = require("uuid/v4");
const mongoCollections = require("../config/mongoCollections");
const proposals = mongoCollections.proposals;
const projects = mongoCollections.projects;

module.exports = {
    async createProposal(title, description, sponsors, majors, creator) {
        if (title === null) throw "Proposal must have a title";
        if (description === null) throw "Proposal must have a description";
        
        var today = new Date();
        let dateString = (today.getMonth() + 1).toString() + "/" + today.getDate().toString() + "/" + today.getFullYear().toString();
        date = dateString;
        
        const proposalCollection = await proposals();

        const uuid = uuidv4();

        const newProposal = {
            "_id": uuid,
            "title": title,
            "description": description,
			"author": creator,
			"date": date,
            "sponsors": sponsors,		
            "majors": majors
        }

        const insertInfo = await proposalCollection.insertOne(newProposal);
        if (insertInfo.insertedCount === 0) throw "Could not create proposal";
    },

    // Retrieves all proposals
    async getProposal() {
        const proposalCollection = await proposals();

        const proposalArray = await proposalCollection.find().toArray();

        return proposalArray;
    },
    async getProposalById(id) {
        return proposals().then(proposalCollection => {
            return proposalCollection.findOne({ _id: id }).then(prop => {
                if (!prop) throw "Proposal not found";
                return prop;
            });
        });
    },

    // Deletes a proposal given a proposal ID
    async deleteProposal(proposalId) {
        if (!proposalId) throw "Project ID must be provided";

        const proposalCollection = await proposals();

        const deletionInfo = await proposalCollection.removeOne( {_id: proposalId} );
        if (deletionInfo.deletedCount === 0) throw "could not delete proposal";

    },

    async approveProposal(proposalId) {
        if (!proposalId) throw "Project ID must be provided";

        const proposalCollection = await proposals();
        const projectCollection = await projects();

        const newProject = await this.getProposalById(proposalId)
        console.log(newProject)
        const deletionInfo = await proposalCollection.removeOne( {_id: proposalId} );
        const newProj = await projectCollection.insertOne(newProject)

        if (deletionInfo.deletedCount === 0) throw "could not delete proposal";

    }
}