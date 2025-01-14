// Import necessary models
const Campground = require('../models/campground'); // Campground model for DB operations
const Review = require('../models/review'); // Review model for DB operations

// Handle the creation of a new review for a campground
module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id); // Find the campground by ID from request params
    const review = new Review(req.body.review); // Create a new review instance from the request body
    review.author = req.user._id; // Assign the current user as the authpr of the review
    campground.reviews.push(review); // Add the review to the campground's reviews array
    await review.save(); // Save the review to the database
    await campground.save(); // Save the updated campground with the new review
    req.flash('success', 'Successfully created new review!'); // Flash success message
    res.redirect(`/campgrounds/${campground._id}`); // Redirect to the campground's page to see the new review
}

// Handle the deletion of a review for a campground
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params; // Extract campground ID and review ID from request params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove the review from the campground's reviews array
    await Review.findByIdAndDelete(reviewId); // Delete the review from the database
    req.flash('success', 'Successfully deleted review!'); // Flash success message
    res.redirect(`/campgrounds/${id}`); // Redirect to the campground's page after deleting the review
}