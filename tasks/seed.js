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
    const proj2 = await projects.createProject("Harold AI", "Another cool senior design project", "Europe", "Software Engineering, Engineering Management", "8", "Public", "2019-03-29", "locked", "Gregg Vessonder");
    const proj3 = await projects.createProject("Magic Ticket", "Another cool senior design project", "Ticketmaster", "Software Engineering, Engineering Management", "8", "Public", "2019-03-29", "locked", "Gregg Vessonder");

    const prop = await proposals.createProposal("Mining Bitcoin", "Help me get rich", "Myself", "Software Engineering", "Laura Oliveto");
    const prop2 = await proposals.createProposal("No Senior D", "Concept: there is no project", "Myself", "Software Engineering", "Caroline Squilante");
    const prop3 = await proposals.createProposal("Mining Bitcoin", "Help me get rich", "Myself", "Software Engineering", "Laura Oliveto");

    /*
    const use = await users.addUser();
    */

    console.log("Done seeding database.");
    await db.serverConfig.close();
};

main().catch(console.log);
