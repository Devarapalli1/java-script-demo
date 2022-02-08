const leap = require("../Leap");
const Leap = leap.Leap;
const monthlyMortage = require("../monthlyMortage");
const MonthlyMortage = monthlyMortage.MonthlyMortage;
const interestConversion = require("../InterestConversion");
const InterestConversion = interestConversion.InterestConversion;
const ROUND = 2;

function schedule(loan, disDate, sDate, term, rate) {
    let endDate = new Date(sDate);
    endDate.setMonth(endDate.getMonth() + term);
    let leap = new Leap(sDate, endDate);
    let isLeap = leap.isLeapPresent();
    if (isLeap) {
        dayCount = 366;
    } else {
        dayCount = 355;
    }
    let interestConversion = new InterestConversion(rate);
    nominalInterest = interestConversion.nominalAnnualInterest(dayCount, 12);
    let mortage = new MonthlyMortage(loan, nominalInterest, term, isLeap);
    monthlyPayment = mortage.calculateMonthlyMortageRate();
    return mortage.schedule(disDate, sDate, term, rate);
}


function add(element, value) {
    return `<${value}>` + element + `</${value}>`;
}

function htmlContent(principalAmount, disDate, startDate, numberOfPayments, rate) {
    arr = schedule(principalAmount, disDate, startDate, numberOfPayments, rate);
    html = "<table><tr>";
    html = html + arr[0].map(function (x) {
        return add(x, "th")
    }).join("");
    html = html + "</tr>";
    for (let x of arr.slice(1)) {
        html = html + "<tr>";
        html = html + x.map(function (ele) {
            return add(ele, "td")
        }).join("");
        html = html + "</tr>";
    }
    html = html + "</table>";
    return html;
}

function compareDates(disDate, startDate) {
    disDate = new Date(disDate)
    startDate = new Date(startDate)
    return disDate.getTime() <= startDate.getTime();
}
// schedule(6184, "07/12/2021", "08/05/2021", 12, 5)
// console.log(compareDates("07/12/2021", "08/05/2021"))

module.exports = {
    schedule,
    add,
    htmlContent,
    compareDates
}