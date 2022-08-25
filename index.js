require("dotenv").config();
const express = require("express");
const cors = require('cors')

// Express App Setup
const app = express();
app.use(cors());


const routes = require("./routes/routes");
app.use("/api", routes);
app.use(express.json());
app.listen(3000, () => {
    console.log(`Server Started at ${3000}`);
});
