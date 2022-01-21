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

const item2 = new Item ({
    name: 'Hit the + button to add a new item'
});

const item3 = new Item ({
    name: '<-- Hit this to delete an item'
});

//array of items
const defaultItems = [item1, item2, item3];



//delete documents in collection
// Item.deleteMany({_id: "61e792352f75f3953b4d3d91"}, function(err){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("Succesfully removed items from the todo list");
//     }
// })

//read/render items already added to list
// Item.find({}, function(err, results){
//     if (err){
//         console.log(err)
//     } else {
//         console.log(results)
//     }
// })

// item.save();


// var items = ["Buy butter", "Gym", "Code"];
var workItems = [];

//home page
app.get("/", (req, res) => {
    //read/render items already added to list
    Item.find({}, function(err, results){
    if (results.length === 0){
        // insert default items in collection
        Item.insertMany(defaultItems, function(err, item) {
            if (err) {
                console.log(err);
            } else {
                console.log("Succesfully saved default items to DB.");
            }
        });
        res.redirect("/");
    } else {
        res.render("list", {
            listTitle: day,
            newListItems: results
        });
        // console.log(results)
    }
    });

    let day = date.getDate();
    // console.log(day);
});

app.post('/', (req, res) =>{
    
    let itemName = req.body.newItem;
    let listName = req.body.list;

    //retrieves new item input from form and creates new document in DB collection
    const newItem = new Item ({
        name: itemName
    })

    newItem.save();
    res.redirect("/");
    console.log(newItem)
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