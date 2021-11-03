const mongoose = require("mongoose");
var db_id = "chiamaster";

module.exports = ()=>{

    mongoose.connect("mongodb+srv://chroot:-aYhcN5Vqi28sjV@cluster0.dpf44.mongodb.net/chiaMaster?retryWrites=true&w=majority&socketTimeoutMS=3600&connectTimeoutMS=3600" + db_id, { useNewUrlParser: true, useUnifiedTopology: true });
    var db = mongoose.connection;
    if(!db)
        console.log("Error connecting db")
    else
        console.log("Db connected successfully")

}  