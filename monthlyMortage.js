const dateFunction = require("./DatesFunctions")
const DatesFunctions = dateFunction.DatesFunctions

class MonthlyMortage {
    ROUND = 2; // round to 2 decimal places.
    FORMAT = "MDY"; // Month - Day- Year.
    PERCENT = 100;
    MONTHS = 12; // Per year

    constructor(principalAmount, annualRate, noOfPayments, dateFunctionObj = new DatesFunctions()) {
        this.principalAmount = principalAmount;
        this.annualRate = annualRate;
        this.noOfPayments = noOfPayments;
        this.dateFunctionObj = dateFunctionObj;
    }

    roundOff(value) {
        let round_to = 10 ** this.ROUND;
        return Math.round(value * round_to) / round_to;
    }

    calculateBaseMonthlyMortageRate(noOfPayments = this.noOfPayments, principal = this.principalAmount, interestRate = this.annualRate) {
        let p = principal;
        let r = interestRate / (this.MONTHS * this.PERCENT);
        let n = noOfPayments;
        let monthlyMortagePayment = p * r * [((1 + r) ** n) / (((1 + r) ** n) - 1)];
        return this.roundOff(monthlyMortagePayment);
    }

    // dayCount(year) { // Based on Actual/365L
    //     if (this.dateFunctionObj.isLeapYear(year)) {
    //         this.days = 366
    //     } else {
    //         this.days = 365
    //     }
    // }

    dayCount(sDate, noOFdays) {
        let paymentDate = new Date(sDate);
        let interestPeriodDate = new Date(sDate)
        let days = 0;
        interestPeriodDate.setDate(interestPeriodDate.getDate() - noOFdays)
        if (this.dateFunctionObj.isLeapPresent(interestPeriodDate, paymentDate)) { // Checking for Leap
            days = 366;
        } else {
            days = 365;
        }
        return days;
    }

    calculateMonthlyInterestForCompoundedDaily(startBalance, annualRate, noOFdays, sDate) {
        let days = this.dayCount(sDate, noOFdays);
        annualRate = annualRate / this.PERCENT;
        let interest = startBalance * annualRate * noOFdays / days;
        return this.roundOff(interest);
    }

    // For Initial Period changes add the remaining sum to base payment;

    extraAddedPrincipal(differnceBtWdays, monthlyPayment, extraAmount) {
        if (differnceBtWdays < 0) {
            differnceBtWdays = 0 - differnceBtWdays;
            monthlyPayment += extraAmount
        } else if (differnceBtWdays > 0) {
            monthlyPayment -= extraAmount;
        }
        return this.roundOff(monthlyPayment)
    }

    //  Adjusting the principal amount based on the output (goal Seeker)

    adjustingPrincipalAmount(sDate, monthlyPayment, startBalance, noOfDays) {
        // console.log(sDate, monthlyPayment, startBalance, noOfDays)
        let endBalance = 0;
        let centsDifference = 0;
        sDate = new Date(sDate);
        let paymentDate = new Date(sDate)
        let initialDays = noOfDays;
        let monthlyInterest = 0;
        let monthlyPrincipal = 0;

        //  Calculating End Balances For the given terms

        for (let period = 0; period < this.noOfPayments; period++) {
            monthlyInterest = this.calculateMonthlyInterestForCompoundedDaily(startBalance, this.annualRate, noOfDays, sDate);
            monthlyPrincipal = this.roundOff(monthlyPayment - monthlyInterest);
            endBalance = this.roundOff(startBalance - monthlyPrincipal);
            noOfDays = this.dateFunctionObj.daysInThisMonth(sDate);
            // sDate.setMonth(sDate.getMonth() + 1);
            sDate = this.dateFunctionObj.addMonth(sDate);
            startBalance = endBalance;
        }
        if (endBalance != 0) {
            centsDifference = endBalance * 100 // convert it to  cents
            centsDifference = this.roundOff(centsDifference);
            // console.log("centsDiffernce in cents", centsDifference + " cents");

            // Check Weather the absolute value of endBalance in cents is greater than are equal to term 
            // if greater than do recursion with updating the principal value

            if ((Math.abs(centsDifference)) >= this.noOfPayments) {
                centsDifference = centsDifference / 100 // convert back to dollars
                // console.log("before recursion", monthlyPayment, "handled", this.roundOff(centsDifference / term))
                monthlyPayment = this.roundOff(monthlyPayment + this.roundOff(centsDifference / this.noOfPayments));
                return this.adjustingPrincipalAmount(paymentDate, monthlyPayment, this.principalAmount, initialDays)
            } else {
                // console.log("base", monthlyPayment)
                return monthlyPayment;
            }
        } else {
            //  Base Condition 
            return monthlyPayment;
        }

    }

    schedule(disDate, sDate) {
        let result = [] // output arr
        disDate = new Date(disDate);
        sDate = new Date(sDate);
        if (!this.dateFunctionObj.compareDates(disDate, sDate)) {
            return "Wrong input dates";
        }
        let endDate = this.dateFunctionObj.addMonth(sDate, this.noOfPayments)
        let principal = this.principalAmount;
        let totalInterest = 0;
        let totalPrincipal = 0;
        let monthlyPayment = this.calculateBaseMonthlyMortageRate();
        let noOfDays = this.dateFunctionObj.calculateDaysBetweenDates(disDate, sDate);
        let noOfDaysInThisMonth = this.dateFunctionObj.daysInThisMonth(disDate);
        let differnceBtWdays = noOfDaysInThisMonth - noOfDays;
        let startBalance = principal;
        let endBalance = principal;
        let extraAmount = this.roundOff(this.calculateMonthlyInterestForCompoundedDaily(principal, this.annualRate, differnceBtWdays, sDate))
        result.push(["payment date", "noOfdays", "start-balance", "Principal", "Interest", "monthP", "end-balance"]);
        monthlyPayment = this.extraAddedPrincipal(differnceBtWdays, monthlyPayment, extraAmount);
        monthlyPayment = this.adjustingPrincipalAmount(sDate, monthlyPayment, startBalance, noOfDays);
        for (let period = 0; period < this.noOfPayments; period++) {
            let paymentDate = this.dateFunctionObj.getDateInFormat(sDate, this.FORMAT);
            let monthlyInterest = this.calculateMonthlyInterestForCompoundedDaily(startBalance, this.annualRate, noOfDays, sDate);
            totalInterest += monthlyInterest;
            if (period == this.noOfPayments - 1) {
                monthlyPayment = this.roundOff(monthlyInterest + endBalance);
            }
            let monthlyPrincipal = this.roundOff(monthlyPayment - monthlyInterest);
            totalPrincipal += monthlyPrincipal;
            endBalance = this.roundOff(startBalance - monthlyPrincipal);
            // console.log(paymentDate, noOfDays, startBalance, monthlyPrincipal, monthlyInterest, monthlyPayment, endBalance)
            result.push([paymentDate, noOfDays, startBalance, monthlyPrincipal, monthlyInterest, monthlyPayment, endBalance])
            noOfDays = this.dateFunctionObj.daysInThisMonth(sDate);
            sDate = this.dateFunctionObj.addMonth(sDate);
            startBalance = endBalance;
        }
        result.push(["", "", "Total", this.roundOff(totalPrincipal), this.roundOff(totalInterest), this.roundOff(totalPrincipal + totalInterest), ""])
        // console.log("totalPrincipal:-", this.roundOff(totalPrincipal), this.roundOff(totalInterest), this.roundOff(totalPrincipal + totalInterest));
        return result;
    }

}

module.exports = {
    MonthlyMortage
}