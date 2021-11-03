const mongoose = require("mongoose");
var db_id = "chiamaster";
module.exports = ()=>{

  mongoose.connect("mongodb+srv://chroot:-aYhcN5Vqi28sjV@cluster0.dpf44.mongodb.net/chiaMaster?retryWrites=true&w=majority&socketTimeoutMS=3600&connectTimeoutMS=3600" + db_id, { useNewUrlParser: true, useUnifiedTopology: true });

  mongoose.connection.on('open', () => {
    console.log('MongoDB: Connected');
  });
  
  mongoose.connection.on('error', (err) => {
    console.log('MongoDB: Error', err);
  });

  mongoose.Promise = global.Promise;

  return mongoose;

}