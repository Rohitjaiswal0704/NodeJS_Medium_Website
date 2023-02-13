const mongoose = require("mongoose")
mongoose.set('strictQuery', false);

mongoose.connect("mongodb://127.0.0.1:27017/bhopal777777777777")
.then(()=> console.log("yes"))
.catch(()=> console.log(err))