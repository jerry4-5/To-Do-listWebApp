// jshint esversion:6

let items = [];
let workItems = [];
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");


const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res) {

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
  res.render("list", {
    listTitle: day,
    newListItems: items
  });
  //res.send();
  //res.send("Hello");
});


app.post("/", function(req, res) {
  //   console.log(req.body);
  // console.log("hello");
  let item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    // console.log(workItems);
    //res.redirect("/work");
    let day = date.getDay();
    res.render("list", {
      listTitle: "Work List",
      newListItems: workItems,
      dayOfWeek: day
    });
  } else {
    items.push(item);
    res.redirect("/");
  }
  //console.log(req.body.newItem);
});


app.post("/work", function(req, res) {
  // console.log(req.body);
  // console.log("world");
  let day = date.getDay();
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems,
    dayOfWeek: day
  });
});

// app.post("/work",function(req,res){
//   let item = req.body.newItem;
//   workItems.push(item);
//   res.redirect("/work");
// });

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running at 3000 speed!");
});
