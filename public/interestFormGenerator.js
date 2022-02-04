const MONTHS = 12;
var principalAmount = 6184;
var interestRate = 0.05;
var terms = 12;
distursementDate = "07/12/2021";
startDate = "08/05/2021";
numberOfPayments = 12;


function calculateDays(startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    let timeDifference = endDate.getTime() - startDate.getTime();
    let daysDifference = timeDifference / (1000 * 3600 * 24)
    return daysDifference
}

function interestFromDisbursementToStartDate(principalAmount, distursementDate, startDate, interestRate) {
    n = calculateDays(distursementDate, startDate);
    p = principalAmount;
    r = interestRate
    interest = p * (1 + r / 365) ** (n) - p
    return interest
}

function calculateMonthlyMortagePayment(principalAmount, interestRate, numberOfPayments) {
    let p = principalAmount;
    let r = interestRate;
    let n = numberOfPayments;
    let monthlyMortagePayment = p * r * [((1 + r) ** n) / (((1 + r) ** n) - 1)];
    return monthlyMortagePayment
}

function interestCalculator(principalAmount, interestRate) {
    return principalAmount * interestRate
}

function report(startDate, terms) {
    arr = []
    totalPrincipal = 0;
    totalInterest = 0;
    startDate = new Date(startDate)
    monthlyPayment = Math.round(calculateMonthlyMortagePayment(principalAmount, interestRate / MONTHS, numberOfPayments) * 100) / 100
    interestRate = interestRate / MONTHS;
    startBalance = principalAmount;
    endBalance = principalAmount;
    arr.push(["payment date", "start-balance", "Principal", "Interest", "monthP", "end-balance"])
    console.log("payment date", "start-balance", "Principal", "Interest", "monthP", "end-balance");
    for (let period = 0; period < terms - 1; period++) {
        startDate.setMonth(startDate.getMonth() + 1);
        paymentDate = (startDate.getMonth() + 1) + "/" + startDate.getDate() + "/" + (startDate.getFullYear());
        monthlyInterest = Math.round(interestCalculator(endBalance, interestRate) * 100) / 100
        monthlyPrincipal = Math.round((monthlyPayment - monthlyInterest) * 100) / 100
        // console.log(monthlyPayment, monthlyPrincipal, monthlyInterest, principalAmount)
        endBalance = Math.round((endBalance - monthlyPrincipal) * 100) / 100
        arr.push([paymentDate, startBalance, monthlyPrincipal, monthlyInterest, monthlyPayment, endBalance])
        console.log(paymentDate, startBalance, monthlyPrincipal, monthlyInterest, monthlyPayment, endBalance)
        totalPrincipal = totalPrincipal + monthlyPrincipal;
        totalInterest = totalInterest + monthlyInterest;
        startBalance = endBalance;
    }
    startDate.setMonth(startDate.getMonth() + 1);
    paymentDate = (startDate.getMonth() + 1) + "/" + (startDate.getDate() + "/" + (startDate.getFullYear()));
    monthlyInterest = Math.round(interestCalculator(endBalance, interestRate) * 100) / 100;
    monthlyPayment = monthlyInterest + endBalance;
    monthlyPrincipal = Math.round((monthlyPayment - monthlyInterest) * 100) / 100
    endBalance = Math.round((endBalance - monthlyPrincipal) * 100) / 100;
    arr.push([paymentDate, startBalance, monthlyPrincipal, monthlyInterest, monthlyPayment, endBalance])
    console.log(paymentDate, startBalance, monthlyPrincipal, monthlyInterest, monthlyPayment, endBalance);
    totalPrincipal = totalPrincipal + monthlyPrincipal;
    totalInterest = totalInterest + monthlyInterest;
    arr.push(["", "", totalPrincipal, totalInterest, "", ""])
    console.log("total Principal", totalPrincipal, "total Interest", totalInterest)
    return arr
}

function addtd(element) {
    return "<td>" + element + "</td>";
}

function addth(element) {
    return "<th>" + element + "</th>";
}

function htmlContent() {
    arr = report(startDate, terms);
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
htmlContent();

function displaySchedule() {
    loanAmount = document.getElementById("loanAmount").value;
    period = document.getElementById("termPeriod").value;
    annualRate = document.getElementById("annualRate").value;
    disDate = document.getElementById("disDate").value;
    month = document.getElementById("month").value;
    day = document.getElementById("day").value;
    year = document.getElementById("year").value;
    distursementDate = disDate;
    startDate = month + "/" + day + "/" + year;
    numberOfPayments = Number(period);
    principalAmount = Number(loanAmount);
    interestRate = Number(interestRate / 100);
    document.getElementById("end").innerHTML = htmlContent();
    return false
}

function isLeapYear(year) {
    return new Date(year, 1, 29).getDate() === 29;
}

function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

function isLeap(startYear, endYear) {
    arr = range(startYear, endYear);
    return arr.some(isLeapYear);
}