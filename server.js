const express = require('express');
const path = require("path");

const app = express();
const PORT = 8000;

// Seting static folder

app.use(express.static(path.join(__dirname, 'public')))

// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "index.html"))
// })


app.listen(PORT, () => console.log(`server started on ${PORT}`));