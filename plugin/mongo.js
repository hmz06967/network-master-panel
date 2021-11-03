var mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectID;
var db_id = "chiamaster";

module.exports = () => {
  mongoose.connect("mongodb://127.0.0.1:27017/" + db_id, { useMongoClient: true });

  mongoose.connection.on('open', () => {
    console.log('MongoDB: Connected');
  });

  mongoose.connection.on('error', (err) => {
    console.log('MongoDB: Error', err);
  });

  mongoose.Promise = global.Promise;
}

var Schema = mongoose.Schema;
var model = {};

var schme = {
  user: {
    name: String,
    date: String,
    email: String,
    passw: String,
    completed: Boolean,
    access: String,
    phone: String
  },
  wallet:{
    uid:ObjectId,
    name:String,
    fpk:String,
    pfk:String,
    addres:String
  },
  access: {
    ip: String,
    date: Date,
    type: String,
    agent: String
  },
  campute: {
    uid: ObjectId,
    date: String,
    name: String,
    uname: String,
    ip: String,
    passw: String,
    info:String
  },
  cloud: {
    uid: ObjectId,
    sid: String,
    date: Date,
    key: String,
    plot: {
      name: String,
      size: Number,
      date: Date,
      status: Boolean
    }
  },
  supsystem: {
    stat: Boolean,
    name: String,
    link: String,
    icon: String,
    detailts: String,
    type: String
  }
}

for (var i in schme) {
  module.exports = mongoose.model(i, new Schema(schme[i]));
}
