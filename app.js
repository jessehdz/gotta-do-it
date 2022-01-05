const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//configure ejs
app.set('view engine', 'ejs');

//establish body-parser to use in app
app.use(bodyParser.urlencoded({extended: true}));

//ask ejs to serve the public folder with static files
app.use(express.static("public"));

var items = ["Buy butter", "Gym", "Code"];

app.get("/", (req, res) => {
    var today = new Date();
    
    var options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };

    var day = today.toLocaleDateString('en-US', options);


    res.render("list", {
        kindOfDay: day,
        newListItems: items
    });

    console.log(day);
    
    // res.send("Hello");
});

app.post('/', (req, res) =>{
    
    var item = req.body.newItem;
    items.push(item);
    res.redirect("/");
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log("todo-list running on server 3000");
});