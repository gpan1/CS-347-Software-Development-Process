const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", async (req, res) => {
  try {
    res.sendFile(path.resolve("static/index.html"));
  } catch (e) {
    res.render("errors/error", {
      title: "Error",
      e: "Error 503: Service Unavailable.",
    });
  }
});

module.exports = router;
