const express = require('express');
const path = require("path");
const fs = require('fs')


const app = express();
const PORT = 8000;

// Seting static folder

app.use(express.static(path.join(__dirname, 'public')))

// app.get('/interestRatesCalculator', (req, res) => {
//     fs.readFile('./public/interestRatesCalculator.js', "utf-8", (err, data) => {
//         if (err) {
//             res.send("Error")
//         } else {

//             res.send(data)
//         }
//     })
// })

app.listen(PORT, () => console.log(`server started on ${PORT}`));