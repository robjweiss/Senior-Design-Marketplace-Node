const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const projects = data.projects;
const proposals = data.proposals;

const main = async () => {
    console.log("Starting seed.")
    const db = await dbConnection();
    await db.dropDatabase();
    const proj = await projects.createProject("Senior Design Marketplace", "A cool senior design project", "Google", "Software Engineering, Engineering Management", "8", "Public", "2019-03-29", "locked", "Gregg Vessonder");

    const prop = await proposals.createProposal("Mining Bitcoin", "Help me get rich", "Myself", "Software Engineering", "Laura Oliveto");

    console.log("Done seeding database.");
    await db.serverConfig.close();
};

main().catch(console.log);
