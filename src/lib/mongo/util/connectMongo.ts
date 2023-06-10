import mongoose from "mongoose"
const URI = process.env.MONGODB_URI
if (!URI) {
    throw new Error("No connection URI provided")
}
const connectMongo = async () => mongoose.connect(URI)

export default connectMongo