import mongoose from "mongoose";

const connection: any = {};


// async function connect() {
//     if (connection.isConnected) {
//         return;
//     }
//     if (mongoose.connections.length > 0) {
//         connection.isConnected = mongoose.connections[0].readyState;
//         if (connection.isConnected === 1) {
//             return;
//         }
//         await mongoose.disconnect();
//     }

//     let s: string = process.env.MONGODB_URI as string
//     const db = await mongoose.connect(s);
//     connection.isConnected = db.connections[0].readyState;
// }

// async function disconnect() {
//     if (connection.isConnected) {
//         if (process.env.NODE_ENV === 'production') {
//             await mongoose.disconnect();
//             connection.isConnected = false;
//         }
//     }
// }


const connect = async () => {
    if (connection.isConnected) {
        // use cached connection when available
        return;
    }
    try {

        const DB_URI = process.env.MONGODB_URI as string
        const dbConnection = await mongoose.connect(DB_URI);
        connection.isConnected = dbConnection.connections[0].readyState;
    } catch (err) {

    }
};

export const db = { connect };