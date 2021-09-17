const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
  }
  req.session.destroy();
  res.render("users/logout", { title: "Logout" });
});

module.exports = router;
