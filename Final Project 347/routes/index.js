const mainRoute = require("./main");
const loginRoutes = require("./login");
const logoutRoutes = require("./logout");
const privateRoutes = require("./private");

const constructorMethod = (app) => {
  app.use("/", mainRoute);
  app.use("/login", loginRoutes);
  app.use("/logout", logoutRoutes);
  app.use("/private", privateRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
