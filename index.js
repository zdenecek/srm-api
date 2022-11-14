require("dotenv").config();
const express = require("express");
const cors = require("cors");	

const port = 3000;

const app = express();
const routes = require("./routes/routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use("/api", routes);

app.listen(port, () => {
    console.log(`Server Started at ${port}`);
});
