const mongoose = require("mongoose");

// // Set up default mongoose connection
// const dbHost = process.env.DB_HOST;
// const dbPort = process.env.DB_PORT;
// const dbName = process.env.DB_NAME;
// const dbUser = process.env.DB_USER;

const dbPass = encodeURIComponent(process.env.DB_PASS);

const connectDBurl = () => {
  const mongoDB = process.env.DB_URL;
  //  const mongoDB = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authMechanism=DEFAULT&authSource=admin`;
  connectDb(mongoDB);
};

const connectDb = (path) => {
  mongoose.set("strictQuery", true);
  mongoose.connect(path);

  mongoose.connection.on("connected", () => {
    console.log("DB CONNECTED");
  });

  mongoose.connection.on("error", (err) => {
    console.log(`DB CONNECTION ERROR  ${err}`);
    process.exit(0);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("DB DISCONNECTED");
  });

  process.on("SIGINT", () => {
    mongoose.connection.close();
    console.log("DB disconnected due to application termination");
    process.exit(0);
  });
};

module.exports = {
  connectDBurl,
};
