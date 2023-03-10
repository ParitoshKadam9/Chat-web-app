const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("mongo connected");
    }
    catch (err) {
        console.log(err)
        process.exit()
    }
}
module.exports = connectDB;