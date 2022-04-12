// jshint esversion:6

// let items = [];
// let workItems = [];



const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");


let day = date.getDate();

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
app.set("view engine", "ejs");


mongoose.connect("mongodb+srv://admin-angela:Test123@cluster0.nbxhk.mongodb.net/todolistDB", {
  useNewUrlParser: true
});

const itemsSchema = {
  name: {
    type: String,
    required: [true, "Error! Enter data correctly"]
  }
};


const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todo list!"
});
const item2 = new Item({
  name: "Hit the + button to add a new item"
});
const item3 = new Item({
  name: "<-- Hit this to delete an item"
});

const defaultItems = [item1,item2,item3];


const listSchema = {
  name : String,
  items: [itemsSchema]
};

const List = mongoose.model("List",listSchema);



app.get("/", function(req, res) {


  Item.find({}, function(err, results) {

    if (results.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("success");
        }
      });
      res.redirect("/");
    } else {

      if (err) {
        console.log(err);
      } else {
        //console.log(results);
        res.render("list", {
          listTitle: day,
          newListItems: results
        });
      }
    }
  });

  let day = date.getDate();
  // var currentDay = today.getDay();
  // var day = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Sat"];
  //if(currentDay===6 || currentDay===0)
  //{day = "weekend";
  // res.write("<h1>Yay! its the weekend!</h1>");
  //}
  //else{
  //day = "weekday";
  // res.write("<p>Its not the weekend!</p>");
  // res.write("<h1>bhakk teri!</h1>");
  //res.sendFile(__dirname+"/index.html");
  //}
  // if(currentDay<0 || currentDay >6)
  // console.log("Error! Current Day is"+ currentDay);
  //res.send();
  //res.send("Hello");
});


app.post("/", function(req, res) {
  //   console.log(req.body);
  // console.log("hello");
  let itemName = req.body.newItem;
  let listName = req.body.listName;
  // console.log(listName);
  // console.log(itemName);

if(listName === day){
const item = new Item({
  name : itemName
});
item.save();

res.redirect("/");
}
else{
  const item = new Item({
    name : itemName
  });
  console.log(item);
  List.findOneAndUpdate({name: listName},{$push: {"items": {name: itemName}}},function(err, foundList){
    if(!err){
      res.redirect("/"+listName);
    }
  });
}

  // if (req.body.list === "Work") {
  //   workItems.push(item);
    // console.log(workItems);
    //res.redirect("/work");
  //   let day = date.getDay();
  //   res.render("list", {
  //     listTitle: "Work List",
  //     newListItems: workItems,
  //     dayOfWeek: day
  //   });
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
  //console.log(req.body.newItem);
});


app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  console.log(listName);
  console.log(day);

if(listName === day){

  Item.findByIdAndRemove(checkedItemId,function(err){
    if(!err){
      //console.log("success");

      res.redirect("/");
    }
  });
}
else{
  console.log("hehe");
  List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkedItemId}}},function(err, foundList){
    if(!err){
      res.redirect("/"+listName);
    }
  });
}
});


app.get("/:customListName", function(req, res) {
   const customListName = _.capitalize(req.params.customListName);

List.findOne({name: customListName},function(err,results){
  if(!err){
    if(results){
      res.render("list", {
        listTitle: results.name,
        newListItems: results.items
      });
    }
    else {
      const list = new List({
        name : customListName,
        items : defaultItems
      });
      list.save();
      res.redirect("/"+customListName);
    }
  }
});
  // console.log("world");
  // let day = date.getDay();
  // res.render("list", {
  //   listTitle: "Work List",
  //   newListItems: workItems,
  //   dayOfWeek: day
  // });
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running at 3000 speed!");
});
