import mongoose from "mongoose";

// Connect to MongoDB
const contentBD = async () => {
  mongoose.connection.on("connected", () => console.log("Database Connected"));
  await mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`);
};

export default contentBD;
