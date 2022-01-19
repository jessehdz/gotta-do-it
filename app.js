const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

//configure ejs
app.set('view engine', 'ejs');

//establish body-parser to use in app
app.use(bodyParser.urlencoded({extended: true}));

//ask ejs to serve the public folder with static files
app.use(express.static("public"));

//mongoose server connection
mongoose.connect("mongodb://localhost:27017/todolistDB");

//todo list item schema
const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'No item added'}
});

//mongoose model initializer: creates collection
const Item = mongoose.model("Item", itemsSchema);

//create document to add to collection
const item1 = new Item ({
        name: 'Welcome to your todolist'
});

//delete documents in collection
// Item.deleteMany({_id: ""}, function(err){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("Succesfully removed items from the todo list");
//     }
// })


// item.save();


// var items = ["Buy butter", "Gym", "Code"];
var workItems = [];

//home page
app.get("/", (req, res) => {
    
    let day = date.getDate();

    res.render("list", {
        listTitle: day,
        newListItems: items
    });

    console.log(day);
    
    // res.send("Hello");
});

app.post('/', (req, res) =>{
    
    let item = req.body.newItem;
    let listName = req.body.list;

    if (listName === "Work List") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }

})

//work list page
app.get("/work", (req, res) => {
    res.render("list", {
        listTitle: "Work List", 
        newListItems: workItems });
});

app.post("/work", (req, res) => {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
})


//PORT setup for Heroku app setup
const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log("todo-list running on server 3000");
});