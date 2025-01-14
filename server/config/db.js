import mongoose from "mongoose";

export default async function connectDB() {
    try {
        const connect = await mongoose.connect(process.env.url);
        console.log('DB is connected at ' + connect.connection.name);
    } catch (error) {
        console.log('Error in db connection', error);
        process.exit(1);
    }
}