const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const isUp = require("is-up");
const smail = require("@sendgrid/mail");
require("./db/conn");
const http = require("http");


const Signup = require("./models/userRegistration");
var bodyParser = require("body-parser");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static(static_path))
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/dashboard", (req, res) => {
    res.render("dashboard");
})

app.get("/sign-up", (req, res) => {
    res.redirect("sign-in");
})

app.get("/sign-in", (req, res) => {
    res.render("dashboard");
})
app.get("/addMonitor", (req, res) => {
    res.render("dashboard");
})
app.post("/sign-up", urlencodedParser, async(req, res) => {
    try {
        console.log(req.body);
        const email = req.body.email;
        console.log(email);
        if (email != null && email != undefined) {
            const registerUser = new Signup({
                email: req.body.email,
                name: req.body.name,
                password: req.body.password
            })

            const registered = await registerUser.save();
            res.status(200).render("log-in");
        } else {
            res.send("Email can not be blank and must be unique.")
        }

    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }

})

app.post("/sign-in", async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const loginUser = await Signup.findOne({ email: email });

        if (loginUser.password === password) {
            res.status(201).render("dashboard");

        } else {
            res.send("Invalid Email or Password");
        }
    } catch (error) {
        res.status(400).send("Invalid email or Password");
    }
})

app.post("/addMonitor", async(req, res) => {
    var url = req.body.url;

    var statusResult = await isUp(url);
    if (statusResult) {
        res.json({
            url: url,
            domainstatus: "Site is Up",
        });
    } else {
        res.json({
            url: url,
            domainstatus: "Site is Down",


        });
    }
});



app.listen(port, () => {
    console.log(`Server running on port ${ port }`);
})