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

    schedule(disDate, sDate, term, rate, calculateDays, daysInThisMonth) {
        let result = []
        disDate = new Date(disDate);
        sDate = new Date(sDate);
        term = term;
        rate = rate;
        let endDate = new Date(sDate);
        endDate.setMonth(endDate.getMonth() + term);
        let principal = this.principalAmount;
        let totalInterest = 0;
        let totalPrincipal = 0;
        let monthlyPayment = this.calculateMonthlyMortageRate();
        let noOfDays = calculateDays(disDate, sDate);
        let noOfDaysInThisMonth = daysInThisMonth(disDate);
        let differnceBtWdays = noOfDaysInThisMonth - noOfDays;
        let startBalance = principal;
        let endBalance = principal;
        result.push(["payment date", "noOfdays", "start-balance", "Principal", "Interest", "monthP", "end-balance"]);
        if (differnceBtWdays < 0) {
            differnceBtWdays = 0 - differnceBtWdays;
            monthlyPayment += this.roundOff(this.calculateMonthlyInterestForCompoundedDaily(principal, rate, differnceBtWdays) / term);
        } else if (differnceBtWdays > 0) {
            monthlyPayment -= this.roundOff(this.calculateMonthlyInterestForCompoundedDaily(principal, rate, differnceBtWdays) / term);
        }
        monthlyPayment = this.roundOff(monthlyPayment)
        console.log(monthlyPayment)
        for (let period = 0; period < term; period++) {
            let paymentDate = (sDate.getMonth() + 1) + "/" + sDate.getDate() + "/" + (sDate.getFullYear());
            let monthlyInterest = this.calculateMonthlyInterestForCompoundedDaily(startBalance, rate, noOfDays);
            totalInterest += monthlyInterest;
            if (period == term - 1) {
                monthlyPayment = this.roundOff(monthlyInterest + endBalance);
            }
            let monthlyPrincipal = this.roundOff(monthlyPayment - monthlyInterest);
            totalPrincipal += monthlyPrincipal;
            endBalance = this.roundOff(startBalance - monthlyPrincipal);
            console.log(paymentDate, noOfDays, startBalance, monthlyPrincipal, monthlyInterest, monthlyPayment, endBalance)
            result.push([paymentDate, noOfDays, startBalance, monthlyPrincipal, monthlyInterest, monthlyPayment, endBalance])
            noOfDays = daysInThisMonth(sDate);
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