const express = require("express");
const app = express();
const session = require("express-session");
const configRoutes = require("./routes");
const static = express.static(__dirname + "/public");

const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.json());

app.use(
  session({
    name: "AuthCookie",
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 60000 },
  })
);

app.use("/private", (req, res, next) => {
  if (!req.session.user) {
    return res
      .status(403)
      .render("errors/error", { title: "Error", e: "User Not Logged In." });
  } else {
    next();
  }
});

app.use("/login", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/private");
  } else {
    //here I',m just manually setting the req.method to post since it's usually coming from a form
    req.method = "POST";
    next();
  }
});

app.use((req, res, next) => {
  let timestamp = new Date().toUTCString();
  let method = req.method;
  let route = req.originalUrl;
  let auth;
  if (req.session.user) {
    auth = "Authenticated User";
  } else {
    auth = "Non-Authenticated User";
  }
  console.log(`[${timestamp}]: ${method} ${route} (${auth})`);
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
