const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction
const Schema = mongoose.Schema; // Create a new Schema constructor from Mongoose

// Define the review schema
const reviewSchema = new Schema({
    body: String, // The content or body of the review (text)
    rating: Number, // Rating given in the review (e.g., 1 to 5)
    author: { // Reference to the author of the review (User)
        type: Schema.Types.ObjectId, // Use ObjectId for MongoDB references
        ref: 'User' // The reference is to the User model
    }
});

// Export the Review model based on the schema
module.exports = mongoose.model("Review", reviewSchema);
