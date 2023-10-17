import mongoose from "mongoose";

mongoose.connection.on("error", (error) => {
  console.log(error);
});

mongoose.connection.on("disconnected", (info) => {
  console.log("Disconnected from database");
  if (info) {
    console.log(`Reason is ${info}`);
  }
});

export default async function startDB(databaseConnection) {
  try {
    await mongoose.connect(databaseConnection, { autoIndex: false });
    console.log("Connected to db");
  } catch (error) {
    console.log(`Error starting database: ${error}`);
  }
}
