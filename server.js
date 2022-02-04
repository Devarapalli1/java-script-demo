const express = require('express');
const path = require("path");

const app = express();
const PORT = 8000;

// Seting static folder

app.use(express.static(path.join(__dirname, 'public')))



app.listen(PORT, () => console.log(`server started on ${PORT}`));