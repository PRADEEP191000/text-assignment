const express = require('express');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose')
const multer = require('multer');;
const app = express();
mongoose.set('strictQuery', false);
var AWS  = require("aws-sdk");

const upload = multer();
app.use(upload.any());
app.use(express.json());


mongoose.connect("mongodb+srv://Project-1:6H3EsS0qOKLtWR0B@cluster0.hln3nud.mongodb.net/jobAssignment", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});