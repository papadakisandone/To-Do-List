//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js"); // import to module poy ftiaksame, date.js
const _ = require("lodash");
const mongoose = require("mongoose") // DB

const app = express();

app.set('view engine', 'ejs'); // we tell to app to use the ejs as view engine
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public")); // gia na mporesei na dei oti arxeia exoume to public , opos css, images...

//mongoDB Atlas online
mongoose.connect("mongodb+srv://admin-antonis:miller31@cluster0.3czg5.mongodb.net/todolistDB");
// new itemsSchema
const itemsSchema = {
  name: String,
};
// mongoose model
const Item = mongoose.model("Item", itemsSchema);

// documets
const item1 = new Item({
  name: "Welcome to your todoList"
});
const item2 = new Item({
  name: "Hit the + button to add a new item."
});
const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

// list schema
const listSchema = {
  name: String,
  items: [itemsSchema]
};
// list model
const List = mongoose.model("List", listSchema);




//Home route
app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) { // only the first time will add the default values
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully insert the defaultItems into DB.");
        }
      });
      res.redirect("/");
    } else {
      let day = date.getDate(); // kaloyme tin function mas app to date.js
      res.render("list", {listTitle: "Today", listItems: foundItems});
    }
  })
});

app.post("/", function(req, res) {
  const itemName = req.body.listItem;
  const listName = req.body.list;
  const day = date.getDate(); // kaloyme tin function mas app to date.js

  const item = new Item({
    name: itemName
  });
  if (listName==="Today"){
    item.save();
    res.redirect("/");
  }else{ // vres tin yparxousa list kai prosthese tis to neo item
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    });
  }
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.del_checkbox;
  const listName = req.body.listName;
  let day = date.getDate();
  if (listName==="Today"){
      Item.findByIdAndRemove(checkedItemId, function(err) {
      if(!err){
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  }else{ // custome list
      List.findOneAndUpdate({name: listName},{$pull:{items: {_id: checkedItemId}}}, function(err, foundList){
        if(!err){
          res.redirect("/"+listName);
        }
      });
  }
});


//Dynamic route
app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName}, function(err, foundList) {
    if (!err) {
      if (!foundList){
        //list documents
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+customListName);
        //console.log("List added");
      }else {

        res.render("list", {listTitle: foundList.name, listItems: foundList.items});
        }
    }
  })
})
// About route
app.get("/about", function(req, res) {
  res.render("about");
})

//heroku set up listen
let port =process.env.PORT;
if (port==null || port==""){
  port =3000; // local
}

app.listen(port, function() {
  console.log("Server is running successfully.")
})
