const db = require("./database/db")
    
db.new_user({
  name: "Hamza",
  date: "Özkan",
  email: "h28mz@hotmail.com",
  passw: "Haza,12459",
  completed: false,
  access: "vip",
  phone: "05070019569"
}).then((result)=>{
    console.log(db.res());
}).catch((err) => {
    console.log(db.err());
});
