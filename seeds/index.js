const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

// Connect to MongoDB with updated options
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    // useNewUrlParser: true, // Parses MongoDB connection stings
    // useCreateIndex: true,
    // useUnifiedTopology: true // Handles MongoDB driver's new connection management engine
});

// Monitor the connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:")); // Log connection errors
db.once("open", () => {
    console.log("Database connected"); // Log successful connection
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //YOUR USE ID
            author: '67706650a735ae82b210cc7b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque sequi accusantium, tenetur blanditiis dolor debitiseaque! Consequuntur magnam voluptas, asperiores atque, et deserunt enim eligendi unde impedit dolorem, sit dolorum.Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eligendi quam fugiat, mollitia accusamus cupiditate corporis, ex placeat dignissimos maiores voluptatum, corrupti tempore laborum odit ipsum explicabo odio dolores recusandae.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ],

        })
        await camp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})