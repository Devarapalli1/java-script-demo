const leap = require("./Leap");
const Leap = leap.Leap;
const monthlyMortage = require("./monthlyMortage");
const MonthlyMortage = monthlyMortage.MonthlyMortage;
const interestConversion = require("./InterestConversion");
const InterestConversion = interestConversion.InterestConversion;
const ROUND = 2;


class HTMLTableGenerator {

    constructor(loan, disDate, sDate, term, rate) {
        this.loan = loan;
        this.disDate = disDate;
        this.sDate = sDate;
        this.term = term;
        this.rate = rate;
    }

    schedule() {
        if (this.compareDates(this.disDate, this.sDate) != true) {
            return "<h1> Please enter the valid date disbursement Date and Start Date</h1>"
        }
        let endDate = new Date(this.sDate);
        endDate.setMonth(endDate.getMonth() + this.term);
        let leap = new Leap(this.sDate, endDate);
        let isLeap = leap.isLeapPresent();
        let dayCount;
        if (isLeap) {
            dayCount = 366;
        } else {
            dayCount = 365;
        }
        let interestConversion = new InterestConversion(this.rate);
        let nominalInterest = interestConversion.nominalAnnualInterest(dayCount, 12);
        let mortage = new MonthlyMortage(this.loan, nominalInterest, this.term, isLeap);
        let monthlyPayment = mortage.calculateMonthlyMortageRate();
        return mortage.schedule(this.disDate, this.sDate, this.term, this.rate);
    }

    add(element, value) {
        return `<${value}>` + element + `</${value}>`;
    }

    htmlContent() {
        let arr = this.schedule();
        if (typeof (arr) == "string") {
            return arr;
        }
        let html = "<table><tr>";
        let add = this.add;
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

    compareDates(disDate, startDate) {
        disDate = new Date(disDate)
        startDate = new Date(startDate)
        return disDate.getTime() <= startDate.getTime();
    }
}

// console.log("For 1000 and 06/26/2018 dis")
// const a = new HTMLTableGenerator(1000, "06/26/2018", "08/15/2018", 12, 12.5)
// a.schedule()
// console.log("for 1080 and 12/05/2019 dis")
// const b = (new HTMLTableGenerator(1080, "12/05/2019", "01/05/2020", 12, 12.5))
// b.schedule()
// console.log("for 1240 and 11/25/2019 dis")
// const c = (new HTMLTableGenerator(1240, "11/25/2019", "12/15/2019", 12, 6))
// c.schedule()
// console.log("for 6184 and 07/12/2021 dis")
// const d = (new HTMLTableGenerator(6184, "07/12/2021", "08/05/2021", 12, 5))
// d.schedule()
module.exports = {
    HTMLTableGenerator
}