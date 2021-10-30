const express = require('express');
const app = express();
const mainRoute = require('./routes/mainRoute')

app.use(express.json())

app.use("/account", mainRoute)


app.listen(3333)