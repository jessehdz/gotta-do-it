const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
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

//todo list item schema -------------------------------------------
const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'No item added'}
});

//creates collection of "items"
const Item = mongoose.model("Item", itemsSchema);

//creates default documents to each collection(list) if null list
const item1 = new Item ({
    name: 'Welcome to your todolist'
});

const item2 = new Item ({
    name: 'Hit the + button to add a new item'
});

const item3 = new Item ({
    name: '<-- Hit this to delete an item'
});

//array of default documents ^^
const defaultItems = [item1, item2, item3];



//todo list LIST schema (with connecting items to new lists) -------
const listSchema = {
    name: String,
    items: [itemsSchema]
}

//creates collection of "lists"
const List = mongoose.model("List", listSchema);

//read/render items already added to list
// Item.find({}, function(err, results){
//     if (err){
//         console.log(err)
//     } else {
//         console.log(results)
//     }
// })

// item.save();

//home page --------------------------------------------------------
let day = date.getDate();

app.get("/", (req, res) => {
    //read/render items already added to list
    Item.find({}, function(err, results){
    if (results.length === 0){
        // insert default items in collection
        Item.insertMany(defaultItems, function(err, item) {
            if (err) {
                console.log(err);
            } else {
                console.log("Succesfully added default items to DB.");
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

    // console.log(day);
});

app.post('/', (req, res) =>{
    
    let itemName = req.body.newItem;
    let listName = req.body.list;

    //retrieves new item input from form and creates new document in DB collection
    const newItem = new Item ({
        name: itemName
    })

    if (listName === day) {
        newItem.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundList){
            if (err) {
                console.log(err);
            } else {
                foundList.items.push(newItem);
                foundList.save();

                res.redirect("/" + listName);
            }
        })
    }

    
    console.log(newItem)
})

//dynamic route parameters -------------------------------------------
app.get("/:listName", (req, res) => {
    const newListName = _.startCase(req.params.listName);

    List.findOne({name: newListName}, function(err, foundList){
            if(!foundList){ 
                // console.log(newListName);
                
                //create new list
                const list = new List({
                    name: newListName,
                    items: defaultItems
                });
            
                list.save();
                res.redirect("/" + newListName);
                
                console.log("List doesn't exist. " + newListName + " list created.");
            } else {
                //show existing list
                res.render("list", {
                    listTitle: newListName,
                    newListItems: foundList.items
                });
                console.log("List '" + newListName + "' exists");

                
            }
    });  
});

//deleted items page -----------------------------------------------
app.post("/delete", function(req, res) {
    const deletedID = req.body.checkBox;
    const listName = req.body.listName;

    if (listName === day) {

        //delete documents in collection for 'home' list
        Item.findByIdAndRemove({_id: deletedID }, function(err){
            if(err){
                console.log(err);
            } else {
                console.log("Succesfully removed item " + deletedID + " from the " + day + " list");
                res.redirect("/");
            }
        })

    } else {
        //delete documents in collection for 'custom' list
        //find matching list
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: deletedID}}}, function(err, foundList){

            if(!err){
                console.log("Succesfully removed item " + deletedID + " from the " + listName + " list");
                res.redirect("/" + listName);
            } 
        });

    console.log(deletedID);
}});

//PORT setup for Heroku app setup
const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log("todo-list running on server 3000");
});