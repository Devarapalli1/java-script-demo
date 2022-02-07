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

    // report(disDate, sDate, rate) {
    //     let result = []
    //     disDate = new Date(disDate);
    //     sDate = new Date(sDate);
    //     let term = this.noOfPayments;
    //     let rate = rate;
    //     let principal = this.principalAmount;
    //     let totalInterest = 0;
    //     let totalPrincipal = 0;
    //     let leap = new Leap(disDate, sDate);
    //     let isLeap = leap.isLeapPresent();
    //     let interestConversion = new InterestConversion(rate);
    //     nominalInterest = interestConversion.nominalAnnualInterest(365, 12);
    //     mortage = new MonthlyMortage(principal, nominalInterest, term, isLeap);
    //     monthlyPayment = mortage.calculateMonthlyMortageRate();
    //     // console.log(monthlyPayment)
    //     noOfDays = calculateDays(disDate, sDate);
    //     noOfDaysInThisMonth = daysInThisMonth(disDate);
    //     differnceBtWdays = noOfDaysInThisMonth - noOfDays;
    //     startBalance = principal;
    //     endBalance = principal;
    //     result.push(["payment date", "noOfdays", "start-balance", "Principal", "Interest", "monthP", "end-balance"]);
    //     if (differnceBtWdays < 0) {
    //         monthlyPayment += roundOff(mortage.calculateMonthlyInterestForCompoundedDaily(principal, rate, differnceBtWdays) / term);
    //     } else if (differnceBtWdays > 0) {
    //         monthlyPayment -= roundOff(mortage.calculateMonthlyInterestForCompoundedDaily(principal, rate, differnceBtWdays) / term);
    //     }
    //     monthlyPayment = roundOff(monthlyPayment)
    //     console.log(monthlyPayment)
    //     for (let period = 0; period < term; period++) {
    //         paymentDate = (sDate.getMonth() + 1) + "/" + sDate.getDate() + "/" + (sDate.getFullYear());
    //         sDate.setMonth(sDate.getMonth() + 1);
    //         monthlyInterest = mortage.calculateMonthlyInterestForCompoundedDaily(startBalance, rate, noOfDays);
    //         totalInterest += monthlyInterest;
    //         if (endBalance + monthlyInterest <= monthlyPayment) {
    //             monthlyPayment = monthlyInterest + endBalance;
    //         }
    //         monthlyPrincipal = roundOff(monthlyPayment - monthlyInterest);
    //         totalPrincipal += monthlyPrincipal;
    //         endBalance = roundOff(startBalance - monthlyPrincipal);
    //         console.log(paymentDate, noOfDays, startBalance, monthlyPrincipal, monthlyInterest, monthlyPayment, endBalance)
    //         startBalance = endBalance;
    //         noOfDays = daysInThisMonth(sDate);
    //     }
    //     console.log("totalPrincipal:-", roundOff(totalPrincipal), "totalInterest:- ", roundOff(totalInterest));
    // }
    report(disDate, sDate) {

    }

}

module.exports = {
    MonthlyMortage
}