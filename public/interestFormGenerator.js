const ROUND = 2;

class Leap {

    constructor(startDate, endDate) {
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
        this.startDate.setDate(this.startDate.getDate() + 1); // not including the start date
        this.startYear = this.startDate.getFullYear()
        this.endYear = this.endDate.getFullYear();
    }

    isLeapYear(year) {
        return new Date(year, 1, 29).getDate() === 29;
    }

    range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }

    isLeapPresent() {
        let arr = this.range(this.startYear, this.endYear);
        return arr.some(this.isLeapYear);
    }

}

class MonthlyMortage {
    ROUND = 2; // round to 2 decimal places.

    constructor(principalAmount, annualRateCompoundedMonthly, noOfPayments, isLeap) {
        this.principalAmount = principalAmount;
        this.annualRate = annualRateCompoundedMonthly / 100;
        this.noOfPayments = noOfPayments;
        this.isLeap = isLeap;
        this.countDays();
    }

    countDays() {
        if (this.isLeap) {
            this.days = 366;
        } else {
            this.days = 365;
        }
    }

    roundOff(value) {
        let round_to = 10 ** this.ROUND;
        return Math.round(value * round_to) / round_to;
    }

    calculateMonthlyMortageRate(noOfPayments = this.noOfPayments, principal = this.principalAmount, interestRate = this.annualRate) {
        let p = principal;
        let r = interestRate / 12;
        let n = noOfPayments;
        let monthlyMortagePayment = p * r * [((1 + r) ** n) / (((1 + r) ** n) - 1)];
        return this.roundOff(monthlyMortagePayment);
    }

    calculateMonthlyInterestOfMortage(endBalance, interest = this.annualRate) {
        let monthlyRate = interest / 12;
        return this.roundOff(endBalance * monthlyRate);
    }

    // calculateMonthlyInterestForCompoundedDaily(startBalance, annualRate, noOFdays) {
    //     annualRate = annualRate / 100;
    //     let interest = (startBalance * (1 + annualRate / this.days) ** (noOFdays)) - startBalance;
    //     return this.roundOff(interest);
    // }

    calculateMonthlyInterestForCompoundedDaily(startBalance, annualRate, noOFdays) {
        annualRate = annualRate / 100;
        let interest = (startBalance * (1 + annualRate / 12) ** (12 * noOFdays / this.days)) - startBalance;
        return this.roundOff(interest);
    }
}

class InterestConversion {
    ROUND = 2; // 2 decimals
    constructor(annualInterest) {
        this.annualInterest = annualInterest;
    }

    roundOff(value) {
        let round_to = 10 ** this.ROUND;
        return Math.round(value * round_to) / round_to;
    }

    effectiveAnnualInterest(compoundingPeriod) {
        let r = this.annualInterest / 100;
        let m = compoundingPeriod;
        let effectiveInterestRate = ((1 + r / m) ** m) - 1
        return this.roundOff(effectiveInterestRate * 100);
    }

    nominalAnnualInterest(fromCompoundingInterval, toCompoundingInterval) {
        // By keeping effective interest rate as constant.
        let eff = this.effectiveAnnualInterest(fromCompoundingInterval) / 100;
        let m = toCompoundingInterval;
        let nominal = m * [((1 + eff) ** (1 / m)) - 1];
        return this.roundOff(nominal * 100);
    }
}

function calculateDays(startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    let timeDifference = endDate.getTime() - startDate.getTime();
    let daysDifference = timeDifference / (1000 * 3600 * 24);
    return Math.round(daysDifference)
}

function daysInThisMonth(date) {
    var now = new Date(date);
    return Math.round(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
}

function roundOff(value) {
    let round_to = 10 ** ROUND;
    return Math.round(value * round_to) / round_to;
}

function schedule(loan, disDate, sDate, term, rate) {
    result = []
    disDate = new Date(disDate);
    sDate = new Date(sDate);
    term = term;
    rate = rate;
    principal = loan;
    let totalInterest = 0;
    let totalPrincipal = 0;
    let endDate = new Date(sDate);
    endDate.setMonth(endDate.getMonth() + term);
    let leap = new Leap(sDate, endDate);
    let isLeap = leap.isLeapPresent();
    // console.log(isLeap)
    let interestConversion = new InterestConversion(rate);
    nominalInterest = interestConversion.nominalAnnualInterest(365, 12);
    mortage = new MonthlyMortage(principal, nominalInterest, term, isLeap);
    monthlyPayment = mortage.calculateMonthlyMortageRate();
    // console.log(monthlyPayment)
    noOfDays = calculateDays(disDate, sDate);
    // console.log(noOfDays);
    noOfDaysInThisMonth = daysInThisMonth(disDate);
    differnceBtWdays = noOfDaysInThisMonth - noOfDays;
    console.log(differnceBtWdays);
    startBalance = principal;
    endBalance = principal;
    result.push(["payment date", "noOfdays", "start-balance", "Principal", "Interest", "monthP", "end-balance"]);
    if (differnceBtWdays < 0) {
        monthlyPayment += roundOff(mortage.calculateMonthlyInterestForCompoundedDaily(principal, rate, differnceBtWdays) / term);
    } else if (differnceBtWdays > 0) {
        monthlyPayment -= roundOff(mortage.calculateMonthlyInterestForCompoundedDaily(principal, rate, differnceBtWdays) / term);
    }
    monthlyPayment = roundOff(monthlyPayment)
    console.log(monthlyPayment)
    for (let period = 0; period < term; period++) {
        paymentDate = (sDate.getMonth() + 1) + "/" + sDate.getDate() + "/" + (sDate.getFullYear());
        monthlyInterest = mortage.calculateMonthlyInterestForCompoundedDaily(startBalance, rate, noOfDays);
        // noOfDays = daysInThisMonth(sDate);
        // sDate.setMonth(sDate.getMonth() + 1);
        totalInterest += monthlyInterest;
        if (period == term - 1) {
            monthlyPayment = roundOff(monthlyInterest + endBalance);
        }
        monthlyPrincipal = roundOff(monthlyPayment - monthlyInterest);
        totalPrincipal += monthlyPrincipal;
        endBalance = roundOff(startBalance - monthlyPrincipal);
        console.log(paymentDate, noOfDays, startBalance, monthlyPrincipal, monthlyInterest, monthlyPayment, endBalance)
        result.push([paymentDate, noOfDays, startBalance, monthlyPrincipal, monthlyInterest, monthlyPayment, endBalance])
        noOfDays = daysInThisMonth(sDate);
        sDate.setMonth(sDate.getMonth() + 1);
        startBalance = endBalance;
    }
    result.push(["", "", "Total", roundOff(totalPrincipal), roundOff(totalInterest), roundOff(totalPrincipal + totalInterest), ""])
    console.log("totalPrincipal:-", roundOff(totalPrincipal), roundOff(totalInterest), roundOff(totalPrincipal + totalInterest));
    return result;
}

function addtd(element) {
    return "<td>" + element + "</td>";
}

function addth(element) {
    return "<th>" + element + "</th>";
}

function htmlContent(principalAmount, disDate, startDate, numberOfPayments, rate) {
    arr = schedule(principalAmount, disDate, startDate, numberOfPayments, rate);
    html = "<table><tr>";
    html = html + arr[0].map(addth).join("");
    html = html + "</tr>";
    for (let x of arr.slice(1)) {
        html = html + "<tr>";
        html = html + x.map(addtd).join("");
        html = html + "</tr>";
    }
    html = html + "</table>";
    return html;
}

function displaySchedule() {
    let loanAmount = document.getElementById("loanAmount").value;
    let period = document.getElementById("termPeriod").value;
    let annualRate = document.getElementById("annualRate").value;
    let disDate = document.getElementById("disDate").value;
    let month = document.getElementById("month").value;
    let day = document.getElementById("day").value;
    let year = document.getElementById("year").value;
    let disbursementDate = disDate;
    let startDate = month + "/" + day + "/" + year;
    let numberOfPayments = Number(period);
    let principalAmount = Number(loanAmount);
    let interestRate = Number(annualRate);
    console.log(principalAmount, disbursementDate, startDate, numberOfPayments, interestRate)
    document.getElementById("end").innerHTML = htmlContent(principalAmount, disbursementDate, startDate, numberOfPayments, interestRate);
    return false
}

// schedule(6184, "07/12/2021", "08/05/2021", 12, 5)