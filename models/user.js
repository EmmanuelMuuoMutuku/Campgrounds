const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction
const Schema = mongoose.Schema; // Create a new Schema constructor from Mongoose
const passportLocalMongoose = require('passport-local-mongoose'); // Import passport-local-mongoose for simplifying user authentication

// Define the User schema
const UserSchema = new Schema({
    email: { // Email field for the user
        type: String, // Type is a string
        required: true, // Email is required
        unique: true // Email must be unique (no two users can have the same email)
    }
});

// Apply passportLocalMongoose plugin to the UserSchema
UserSchema.plugin(passportLocalMongoose); // This adds authentication-related fields and methods to the schema, such as username, password, and methods for handling authentication

// Export the User model based on the schema
module.exports = mongoose.model('User', UserSchema);
