const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const users = require("../data/users");
const xss = require("xss");

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (
      !xss(username) ||
      typeof xss(username) !== "string" ||
      xss(username).trim().length === 0
    ) {
      throw "Username or Password is Invalid";
    }
    if (
      !xss(password) ||
      typeof xss(password) !== "string" ||
      xss(password).trim().length === 0
    ) {
      throw "Username or Password is Invalid";
    }
    let account = users.filter((user) => {
      return user.username === xss(username);
    })[0];
    if (account) {
      let match = await bcrypt.compare(xss(password), account.hashedPassword);
      if (match) {
        req.session.user = {
          id: account._id,
          username: account.username,
          hashedPassword: account.hashedPassword,
          role: account.role,
        };
        res.redirect("/private");
      } else {
        res.status(401).render("users/login", {
          title: "Login",
          e: "Username or Password is Invalid",
        });
      }
    } else {
      res.status(401).render("users/login", {
        title: "Login",
        e: "Username or Password is Invalid",
      });
    }
  } catch (e) {
    res.status(401).render("users/login", { title: "Login", e: e });
  }
});

module.exports = router;
