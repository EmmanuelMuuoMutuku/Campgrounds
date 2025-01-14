// Import necessary models and libraries
const Campground = require('../models/campground'); // Campground model for DB operations
const maptilerClient = require("@maptiler/client"); // MapTiler client for geolocation services
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY; // Set the API key for MapTiler
const { cloudinary } = require('../cloudinary'); // Cloudinary setup for image handling

//Display all campgrounds
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({}); // Retrieve all campgrounds from DB
    res.render('campgrounds/index', { campgrounds }) // Render the view with campgrounds data
}

// Render the form to create a new campground
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new'); // Render the form view
}

// Handle the creation of a new campground
module.exports.createCampground = async (req, res, next) => {
    // Geocode the campgrounds's location using MapTiler API
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const campground = new Campground(req.body.campground); // Create a new campground instance
    campground.geometry = geoData.features[0].geometry; // Add geolocation data to the campground
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename })); // Map uploaded images
    campground.author = req.user._id; // Set the current user's ID as the author
    await campground.save(); // Save the campground to the DB
    console.log(campground); // Log the new campground for debugging
    req.flash('success', 'Successfully made a new campground!') // Flash message for success
    res.redirect(`/campgrounds/${campground._id}`) // Redirect to the new campgrounds's page
}

// Show detailed information for a single campground
module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id) // Find campground by ID
        .populate({
            path: 'reviews', // Populate related reviews
            populate: {
                path: 'author' // Populate author info for each review
            }
        }).populate('author'); // Populate the campground's author info
    if (!campground) {
        req.flash('error', 'Campground not found!'); // Handle case where campground isn't found
        return res.redirect('/campgrounds'); // Redirect back to all campgrounds
    }
    res.render('campgrounds/show', { campground }); // Render the campground details page
}

// Render the form to edit an existing campground
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params; // Extract campground ID from request params
    const campground = await Campground.findById(id) // Find campground by ID
    if (!campground) {
        req.flash('error', 'Campground not found!'); // Handle case where campground isn't found
        return res.redirect('/campgrounds'); // Redirect to the list of campgrounds
    }
    res.render('campgrounds/edit', { campground }); // Render the edit form with campground data
}

// Handle updating an existing campground
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params; // Extract campground ID from request params
    console.log(req.body); // Log the request body for debugging
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); // Update the campground
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 }); // Get the updated geolocation
    campground.geometry = geoData.features[0].geometry; // Update the campground's geometry
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename })); // Map the uploaded images
    campground.images.push(...imgs); // Add new images to the campground
    await campground.save(); // Save the changes to the DB

    // If there are images to delete, remove them from Cloudinary and the DB
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename); // Delete image from Cloudinary
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } }) // Remove images from DB
    }
    req.flash('success', 'Successfully updated campground!'); // Flash success message
    res.redirect(`/campgrounds/${campground._id}`); // Redirect to the updated campground's page
}

// Handle deleting a campground
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params; // Extract campground ID from request params
    await Campground.findByIdAndDelete(id); // Delete the campground from DB
    req.flash('success', 'Successfully deleted campground!'); // Flash success message
    res.redirect('/campgrounds'); // Redirect back to the list of campgrounds
}