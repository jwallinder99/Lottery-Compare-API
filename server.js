const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3001;
const routes = require("./api/lottery-compare.route.js");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use("/", routes);

app.get("/", (req, res) => res.send("Lottery-Compare API"));

app.listen(port, () => console.log(`Server ready on port ${port}`));

module.exports = app;
