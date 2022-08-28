require("dotenv").config();
const express = require("express");
const cors = require("cors");

const port = process.env.PORT || (process.env.PRODUCTION === "true" ? 80 : 3000);

// Express App Setup
const app = express();
app.use(cors());
const routes = require("./routes/routes");

app.use(express.static("public"));
app.use("/api", routes);

app.get("*", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.use('/api', express.json());
app.listen(port, () => {
    console.log(`Server Started at ${port}`);
});
