class MonthlyMortage {
    ROUND = 2; // round to 2 decimal places.

    constructor(principalAmount, annualRateCompoundedMonthly, noOfPayments) {
        this.principalAmount = principalAmount;
        this.annualRate = annualRateCompoundedMonthly / 100;
        this.noOfPayments = noOfPayments;
        // this.isLeap = isLeap;
        // this.countDays();
    }

    // countDays() {
    //     if (this.isLeap) {
    //         this.days = 366;
    //         // this.days = 365;
    //     } else {
    //         this.days = 365;
    //     }
    // }

    isLeapYear(year) {
        return new Date(year, 1, 29).getDate() === 29;
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

    calculateMonthlyInterestForCompoundedDaily(startBalance, annualRate, noOFdays, year) {
        if (this.isLeapYear(year)) {
            this.days = 366
        } else {
            this.days = 365
        }
        annualRate = annualRate / 100;
        let interest = startBalance * annualRate * noOFdays / this.days;
        // let interest = (startBalance * (1 + annualRate / 12) ** (12 * noOFdays / this.days)) - startBalance;
        return this.roundOff(interest);
    }

    calculateDays(startDate, endDate) {
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        let timeDifference = endDate.getTime() - startDate.getTime();
        let daysDifference = timeDifference / (1000 * 3600 * 24);
        return Math.round(daysDifference)
    }

    daysInThisMonth(date) {
        var now = new Date(date);
        return Math.round(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
    }

    extraAddedPrincipal(differnceBtWdays, monthlyPayment, extraAmount) {
        if (differnceBtWdays < 0) {
            differnceBtWdays = 0 - differnceBtWdays;
            monthlyPayment += extraAmount
        } else if (differnceBtWdays > 0) {
            monthlyPayment -= extraAmount;
        }
        return this.roundOff(monthlyPayment)
    }

    lastTermBalanceHandling(sDate, monthlyPayment, term, startBalance, rate, noOfDays) {
        let endBalance = 0;
        let centsDifference = 0;
        sDate = new Date(sDate);
        let paymentDate = new Date(sDate)
        let initialDays = noOfDays;
        let monthlyInterest = 0;
        let monthlyPrincipal = 0;
        for (let period = 0; period < term; period++) {
            monthlyInterest = this.calculateMonthlyInterestForCompoundedDaily(startBalance, rate, noOfDays, sDate.getFullYear());
            monthlyPrincipal = this.roundOff(monthlyPayment - monthlyInterest);
            endBalance = this.roundOff(startBalance - monthlyPrincipal);
            noOfDays = this.daysInThisMonth(sDate);
            sDate.setMonth(sDate.getMonth() + 1);
            startBalance = endBalance;
        }
        if (endBalance != 0) {
            centsDifference = endBalance * 100 // convert it to  cents
            console.log("centsDiffernce in cents", centsDifference + " cents")
            if ((Math.abs(centsDifference)) >= term) {
                centsDifference = centsDifference / 100 // convert back to dollars
                console.log("before recursion", monthlyPayment, "handled", this.roundOff(centsDifference / term))
                monthlyPayment = this.roundOff(monthlyPayment + this.roundOff(centsDifference / term));
                return this.lastTermBalanceHandling(paymentDate, monthlyPayment,
                    term, this.principalAmount, rate, initialDays)
            } else {
                console.log("base", monthlyPayment)
                return monthlyPayment;
            }
        } else {
            return monthlyPayment;
        }

    }

    schedule(disDate, sDate, term, rate) {
        let result = []
        disDate = new Date(disDate);
        sDate = new Date(sDate);
        if (disDate > sDate) {
            return "Wrong input dates";
        }
        term = term;
        rate = rate;
        let endDate = new Date(sDate);
        endDate.setMonth(endDate.getMonth() + term);
        let principal = this.principalAmount;
        let totalInterest = 0;
        let totalPrincipal = 0;
        let monthlyPayment = this.calculateMonthlyMortageRate();
        let noOfDays = this.calculateDays(disDate, sDate);
        let noOfDaysInThisMonth = this.daysInThisMonth(disDate);
        let differnceBtWdays = noOfDaysInThisMonth - noOfDays;
        let startBalance = principal;
        let endBalance = principal;
        let extraAmount = this.roundOff(this.calculateMonthlyInterestForCompoundedDaily(principal, rate, differnceBtWdays) / term, sDate.getFullYear())
        result.push(["payment date", "noOfdays", "start-balance", "Principal", "Interest", "monthP", "end-balance"]);
        monthlyPayment = this.extraAddedPrincipal(differnceBtWdays, monthlyPayment, extraAmount);
        // console.log("from last term handling", this.lastTermBalanceHandling(sDate, monthlyPayment, term, startBalance, rate, noOfDays))
        monthlyPayment = this.lastTermBalanceHandling(sDate, monthlyPayment, term, startBalance, rate, noOfDays);
        for (let period = 0; period < term; period++) {
            let paymentDate = (sDate.getMonth() + 1) + "/" + sDate.getDate() + "/" + (sDate.getFullYear());
            let monthlyInterest = this.calculateMonthlyInterestForCompoundedDaily(startBalance, rate, noOfDays, sDate.getFullYear());
            totalInterest += monthlyInterest;
            if (period == term - 1) {
                monthlyPayment = this.roundOff(monthlyInterest + endBalance);
            }
            let monthlyPrincipal = this.roundOff(monthlyPayment - monthlyInterest);
            totalPrincipal += monthlyPrincipal;
            endBalance = this.roundOff(startBalance - monthlyPrincipal);
            console.log(paymentDate, noOfDays, startBalance, monthlyPrincipal, monthlyInterest, monthlyPayment, endBalance)
            result.push([paymentDate, noOfDays, startBalance, monthlyPrincipal, monthlyInterest, monthlyPayment, endBalance])
            noOfDays = this.daysInThisMonth(sDate);
            sDate.setMonth(sDate.getMonth() + 1);
            startBalance = endBalance;
        }
        result.push(["", "", "Total", this.roundOff(totalPrincipal), this.roundOff(totalInterest), this.roundOff(totalPrincipal + totalInterest), ""])
        console.log("totalPrincipal:-", this.roundOff(totalPrincipal), this.roundOff(totalInterest), this.roundOff(totalPrincipal + totalInterest));
        return result;
    }
}

module.exports = {
    MonthlyMortage
}