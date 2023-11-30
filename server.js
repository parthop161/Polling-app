const express = require("express");
const app = express();
const {connectMongoose, User} = require("./database.js");
const ejs = require("ejs");
const passport = require("passport");
const { initializingPassport, isAuthenicated } = require("./passportConfig.js");
const expressSession = require("express-session");

connectMongoose();

initializingPassport(passport);

 app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(expressSession({secret: "secret" , resave: false , saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


app.set("view engine", "ejs")


app.get("/",(req,res)=>{
    res.render("index")
})

app.get("/register",(req,res)=>{
    res.render("register")
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.post("/register",async (req,res)=>{
    const user = await User.findOne({username : req.body.username})
    if(user) return res.status(400).send("user exists");

    const newUser = await User.create(req.body);
    res.status(201).send(newUser);
})


app.post("/login",passport.authenticate("local",{successRedirect:"/register",failureRedirect:"/home",}))


app.get("/home",(req,res)=>{
    res.render("home")
})
// app.get("/profile",isAuthenicated,(req,res)=>{
//     res.send(req.user);
// })

app.listen(4000,()=>{
    console.log("listening on https://localhost/4000");
})