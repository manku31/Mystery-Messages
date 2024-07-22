import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export default async function dbConnect(): Promise<void> {
  // Already conneected
  if (connection.isConnected) {
    console.log("Alrady connected to DB");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL || "", {});

    connection.isConnected = db.connections[0].readyState;
    // console.log("db : ", db);
    // console.log("db.connections : ", db.connections);

    console.log("DB connect Sucessfully");
  } catch (error) {
    console.log("DB connection fail, error : ", error);

    process.exit();
  }
}
