const express = require("express");

require("dotenv").config();


const { PORT } = process.env;
const app = express();

const {breadcrumb}=require('./funcs')


app.listen(PORT, () => {
  console.log("server listening on", PORT);
//   breadcrumb()
});
