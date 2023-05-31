const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const username = 'tuxakhil';
        const password = encodeURIComponent('@dHANED100'); // Encodes the password

        const conn = await mongoose.connect(`mongodb+srv://${username}:${password}@sploot.jrpbngm.mongodb.net/`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });


        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;

