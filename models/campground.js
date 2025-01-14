// Import necessary modules
const mongoose = require('mongoose'); // MongoDB object modeling tool
const Review = require('./review'); // Import Review model to handle related reviews
const Schema = mongoose.Schema; // Schema constructor to define the structure of data

// Define the Image schema for storing image details (url and filename)
const ImageSchema = new Schema({
    url: String, // URL of the image stored in Cloudinary
    filename: String // The filename of the image in Cloudinary
});

// Virtual for generating a thumbnail image URL
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200'); // Generate a smaller image URL with width of 200px
});

// Options to include virtuals when converting documents to JSON
const opts = { toJSON: { virtuals: true } };

// Define the Campground schema (blueprint for campground data)
const CampgroundSchema = new Schema({
    title: String, // Title of the campground
    images: [ImageSchema], // Array of images for the campground
    geometry: { // Geospatial data for campground location
        type: {
            type: String,
            enum: ['Point'], // The geometry type (only Point supported for now)
            required: true // Geometry is required
        },
        coordinates: {
            type: [Number], // Array of numbers [longitude, latitude]
            required: true // Coordinates are required
        }
    },
    price: Number, // Price per night at the campground
    description: String, // Description of the campground
    location: String, // Location address of the campground
    author: { // Reference to the author (User model)
        type: Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    },
    reviews: [ // Array of references to related reviews
        {
            type: Schema.Types.ObjectId,
            ref: 'Review' // Reference to the Review model
        }
    ]
}, opts); // Apply options for virtuals in toJSON method

// Virtual for generating the markup of the campground to be used in popups on the map
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>` // Create a clickable popup with title and brief description
});

// Middleware to handle the deletion of related reviews when a campground is deleted
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        // If the campground document is found and deleted, remove all associated reviews
        await Review.deleteMany({
            _id: {
                $in: doc.reviews // Find reviews whose IDs are in the campground's reviews array
            }
        })
    }
});

// Export the Campground model based on the CampgroundSchema
module.exports = mongoose.model('Campground', CampgroundSchema);
