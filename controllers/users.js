// Import the User model for interacting with the database
const User = require('../models/user');

// Render the registration form page
module.exports.renderRegister = (req, res) => {
    res.render('users/register'); // Renders the 'register' view to show the registration form
}

// Handle the registration process
module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body; // Extract email, username, and password from the form data
        const user = new User({ email, username }); // Create a new User instance with the provided email and username
        const registeredUser = await User.register(user, password); // Register the new user and hash the password
        req.login(registeredUser, err => { // Log in the newly registered user
            if (err) return next(err); // Handle any errors during login
            req.flash('success', 'Welcome to Yelp Camp!'); // Flash a success message
            res.redirect('/campgrounds'); // Redirect to the campgrounds page after successful registration
        });
    } catch (e) { // Handle any errors during the registration process
        req.flash('error', e.message); // Flash an error message if something goes wrong
        res.redirect('register'); // Redirect back to the registration form
    }
}

// Render the login form page
module.exports.renderLogin = (req, res) => {
    res.render('users/login'); // Renders the 'login' view to show the login form
}

// Handle the login process
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!'); // Flash a success message after successful login
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // Determine the URL to redirect to after login (either where the user came from or the campgrounds page)
    delete req.session.returnTo; // Delete the returnTo session variable after use
    res.redirect(redirectUrl); // Redirect to the determined URL
}

// Handle the logout process
module.exports.logout = (req, res, next) => {
    req.logout(function (err) { // Log the user out of the session
        if (err) {
            return next(err); // Handle any errors during logout
        }
    });
    req.flash('success', 'Successfully logged out!'); // Flash a success message after logging out
    res.redirect('/campgrounds'); // Redirect to the campgrounds page after logging out
}
