import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportlocalMOngoose from "passport-local-mongoose";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import findOrCreate from 'mongoose-findorcreate'
const app = express();
const port = 80;
const hostname = "127.0.0.1";
app.use(express.static("public"));
app.use(express.urlencoded());

app.use(session({
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin-ujjwal:admin123@cluster0.qqjgs11.mongodb.net/taskvueDB?retryWrites=true&w=majority");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: String,
  duedate: String,
  category: String
});
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId:String,
  tasks: [taskSchema]
});
userSchema.plugin(passportlocalMOngoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});
passport.deserializeUser(function(user, cb) {
  process.nextTick(async function() {
    try {
      // Fetch the complete user object from the database
      const completeUser = await User.findById(user.id);
      if (!completeUser) {
        return cb(new Error('User not found'));
      }
      cb(null, completeUser);
    } catch (err) {
      cb(err);
    }
  });
});
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost/auth/google/taskvue",
  userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

// const user2 = new User({
//   username:"ujjwal",
//   password:"ujjwal.1234",
//   tasks:[{
//     title:"Title 1",
//     description:"This is title 1",
//     priority:"Low",
//     duedate:"02-10-2023",
//     category:"Work"
//   },
//   {
//     title:"Title 2",
//     description:"This is title 2",
//     priority:"Medium",
//     duedate:"20-09-2023",
//     category:"Personal"
//   }]
// });
// await user2.save()
// await User.insertMany([user1,user2]);
// var isAuthenticated = false;
// var userdata = null;
// var username = null;
// async function authenticated(req, res, next){
//   username = req.body.username;
//   const password = req.body.password;
//   userdata = await User.findOne({ username: req.body.username });
//   if (userdata != null) {
//     if (userdata.password === req.body.password) {
//       isAuthenticated = true;
//       res.redirect("/dash")
//     }
//     else {
//       console.log(userdata);
//       console.log("Invalid Password");
//     }
//   }
//   else {
//     console.log("Invalid username");
//   }
// }

app.get("/", (req, res) => {
  res.redirect("/login");
});
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/taskvue', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dash');
  });

app.get("/login", (req, res)=>{
  res.render("sign.ejs");
});

let inp = 1;
app.post("/login", function(req,res){
  const user = new User({
    username:req.body.username,
    password:req.body.password
  });
  req.login(user, function(err){
    if (err){
      console.log(err);
    }
    else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/dash");
      });
    }
  });
});

app.get("/dash", async (req, res)=>{
  if(req.isAuthenticated()){
    const userdata = req.user;
    res.render("index.ejs", {tasks:userdata.tasks, inp:inp, day:"Everything"});
  }
  else{
    res.redirect("/");
  }
});
app.post("/filldetails", async (req, res) => {
  if(req.isAuthenticated()){
    const userdata = req.user;
    console.log(userdata);
    userdata.tasks.push({title:req.body.title});
    inp = 0;
    await userdata.save();
    res.redirect("/dash");
  }
  else{
    res.redirect("/");
  }
});

app.post("/dash", async (req, res) => {
  if(req.isAuthenticated()){
  inp = 1;
  const userdata = req.user;
  let length = userdata.tasks.length;
  userdata.tasks[length-1].description = req.body.description;
  userdata.tasks[length-1].priority = req.body.priority;
  userdata.tasks[length-1].duedate = req.body.duedate;
  userdata.tasks[length-1].category = req.body.category;
  //  priority:req.body.priority, duedate:req.body.duedate, category:req.body.category};
  await userdata.save();
  res.redirect("/dash");}
  else{
    res.redirect("/");
  }
  });
app.get("/signout", (req, res)=>{
  req.logout(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/");
    }
  });
});
app.get("/signup", (req, res)=>{
  res.render("create.ejs");
});
app.post("/signup", async (req, res)=>{
  User.register({username:req.body.username}, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect("/signup");
    }
    else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/dash");
      });
    }
  });
//   const user = new User({
//       name:req.body.name,
//       username:req.body.username,
//       password:req.body.password,});
//       await user.save();
//       res.redirect("/");
});
app.post("/delete", async (req, res)=>{
  if(req.isAuthenticated()){
    const userdata = req.user;
    var count = 0;
    var index = 0;
    userdata.tasks.forEach(element => {
      if(element.title == req.body.hiddentitle){
        index = count;
      }
      count++;
    })
    userdata.tasks.splice(index,1);
    await userdata.save();
    res.redirect("/dash");
  }
});
app.get("/others", async(req, res)=>{
  if(req.isAuthenticated()){
  const userdata = req.user.tasks;
  var othersdata = [];
  userdata.forEach(element=>{
    if(element.category == "Others"){
      othersdata.push(element);
    }
  });
  res.render("index.ejs", {tasks:othersdata, inp:inp, day:"Others"});}
  else{
    res.redirect("/");
  }
});
app.get("/personal", async(req, res)=>{
  if(req.isAuthenticated()){
  const userdata = req.user.tasks;
  var personaldata = [];
  userdata.forEach(element=>{
    if(element.category == "Personal"){
      personaldata.push(element);
    }
  });
  res.render("index.ejs", {tasks:personaldata, inp:inp, day:"Personal"});}
});
app.get("/work", async(req, res)=>{
  if(req.isAuthenticated()){
  const userdata = req.user.tasks;
  var workdata = [];
  userdata.forEach(element=>{
    if(element.category == "Work"){
      workdata.push(element);
    }
  });
  res.render("index.ejs", {tasks:workdata, inp:inp, day:"Work"});}
});
app.get("/shopping", async(req, res)=>{
  if(req.isAuthenticated()){
  const userdata = req.user.tasks;
  var shoppingdata = [];
  userdata.forEach(element=>{
    if(element.category == "Shopping"){
      othersdata.push(element);
    }
  });
  res.render("index.ejs", {tasks:shoppingdata, inp:inp, day:"Shopping"});}
});
app.get("/finance", async(req, res)=>{
  if(req.isAuthenticated()){
  const userdata = req.user.tasks;
  var financedata = [];
  userdata.forEach(element=>{
    if(element.category == "finance"){
      financedata.push(element);
    }
  });
  res.render("index.ejs", {tasks:financedata, inp:inp, day:"Finance"});}
});
app.get("/events", async(req, res)=>{
  if(req.isAuthenticated()){
  const userdata = req.user.tasks;
  var eventsdata = [];
  userdata.forEach(element=>{
    if(element.category == "events"){
      eventsdata.push(element);
    }
  });
  res.render("index.ejs", {tasks:eventsdata, inp:inp, day:"Events"});}
});
app.get("/health", async(req, res)=>{
  if(req.isAuthenticated()){
  const userdata = req.user.tasks;
  var healthdata = [];
  userdata.forEach(element=>{
    if(element.category == "health"){
      healthdata.push(element);
    }
  });
  res.render("index.ejs", {tasks:healthdata, inp:inp, day:"Health"});}
});
app.get("/today", async(req, res)=>{
  if(req.isAuthenticated()){
  const userdata = req.user.tasks;
  const today = new Date();
  var todaydata = [];
  userdata.forEach(element=>{
    const dueDateStr = element.duedate;
    const dueDate = new Date(dueDateStr);
    if(dueDate.getDate() === today.getDate() && dueDate.getMonth() === today.getMonth() && dueDate.getFullYear() === today.getFullYear()){
      todaydata.push(element);
    }
  });
  res.render("index.ejs", {tasks:todaydata, inp:inp, day:"Today"});}
});
app.get("/week", async(req, res)=>{
  if(req.isAuthenticated()){
  const userdata = req.user.tasks;
  const currentDate = new Date();
  const currentWeekStart = new Date(currentDate);
  currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
  currentWeekStart.setHours(0, 0, 0, 0); 
  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
  currentWeekEnd.setHours(23, 59, 59, 999);

  var weekdata = [];
  userdata.forEach(element=>{
    const dueDateStr = element.duedate;
    const dueDate = new Date(dueDateStr);
    if(dueDate >= currentWeekStart && dueDate <= currentWeekEnd){
      weekdata.push(element);
    }
  });
  res.render("index.ejs", {tasks:weekdata, inp:inp, day:"This Week"});}
});
app.get("/month", async(req, res)=>{
  if(req.isAuthenticated()){
  const userdata = req.user.tasks;
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  var monthdata = [];
  userdata.forEach(element=>{
    const dueDateStr = element.duedate;
    const dueDate = new Date(dueDateStr);
    const taskMonth = dueDate.getMonth() + 1;
    if(currentMonth === taskMonth){
      monthdata.push(element);
    }
  });
  res.render("index.ejs", {tasks:monthdata, inp:inp, day:"This Month"});}
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
