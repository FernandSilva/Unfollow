const { Client, Query } = require("node-appwrite");

module.exports = async function (req, res) {
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const database = new Database(client);
    const followerId = req.payload.followerId;
    const followingId = req.payload.followingId;

    // Find the relationship document
    let response = await database.listDocuments(process.env.COLLECTION_ID, [
        Query.equal('followerId', followerId),
        Query.equal('followingId', followingId)
    ]);

    if (response.documents.length > 0) {
        // Relationship exists, delete it
        await database.deleteDocument(process.env.COLLECTION_ID, response.documents[0].$id);
        res.send('Follow relationship removed successfully');
    } else {
        res.send('No such follow relationship exists');
    }
};

