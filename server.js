const express = require('express');
const path = require("path");
const fs = require('fs')
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var interestFormGenerator = require("./public/interestFormGenerator")
const calculateDays = interestFormGenerator.calculateDays;
const daysInThisMonth = interestFormGenerator.daysInThisMonth;
const schedule = interestFormGenerator.schedule;
const add = interestFormGenerator.add;
const htmlContent = interestFormGenerator.htmlContent;
const leap = require("./Leap");
const Leap = leap.Leap;
const monthlyMortage = require("./monthlyMortage");
const MonthlyMortage = monthlyMortage.MonthlyMortage;
const interestConversion = require("./InterestConversion");
const InterestConversion = interestConversion.InterestConversion;
const ROUND = 2;

const app = express();
const PORT = 8000;

// Seting static folder
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(upload.array());

app.use(express.static(path.join(__dirname, 'public')))

app.post('/data', function (req, res) {
    let loanAmount = req.body["loanAmount"];
    let period = req.body["termPeriod"];
    let annualRate = req.body["annualRate"];
    let disDate = req.body["disDate"];
    let month = req.body["month"];
    let day = req.body["day"];
    let year = req.body["year"];
    let disbursementDate = disDate;
    let startDate = month + "/" + day + "/" + year;
    let numberOfPayments = Number(period);
    let principalAmount = Number(loanAmount);
    let interestRate = Number(annualRate);
    console.log(req.body);
    let jsonData = {
        'data': htmlContent(principalAmount, disbursementDate, startDate, numberOfPayments, interestRate)
    }
    // console.log(JSON.stringify(jsonData));
    res.json(jsonData);
})

app.listen(PORT, () => console.log(`server started on ${PORT}`));