const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();


//configure ejs
app.set('view engine', 'ejs');

//establish body-parser to use in app
app.use(bodyParser.urlencoded({extended: true}));

//ask ejs to serve the public folder with static files
app.use(express.static("public"));

var items = ["Buy butter", "Gym", "Code"];
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