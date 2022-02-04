class InterestRates {
    ROUND = 2; // 2 decimals
    constructor(principalAmount, annualRate) {
        this.annualRate = annualRate / 100;
        this.principalAmount = principalAmount;
    }

    roundOff(value) {
        let round_to = 10 ** this.ROUND;
        return Math.round(value * round_to) / round_to;
    }

    calculateCompoundedDailyInterest(days) {
        let n = days;
        let p = this.principalAmount;
        let r = this.annualRate;
        let interest = p * (1 + r / 365) ** (n) - p;
        return this.roundOff(interest);
    }

    calculateEffectiveInterestRate(compoundingInterval) {
        let r = this.annualRate;
        let m = compoundingInterval;
        let effectiveInterestRate = ((1 + r / m) ** m) - 1
        return this.roundOff(effectiveInterestRate * 100);
    }

    calculateMonthlyMortageRate(noOfPayments, principal = this.principalAmount, interestRate = this.annualRate) {
        let p = principal;
        let r = interestRate / 12;
        let n = noOfPayments;
        let monthlyMortagePayment = p * r * [((1 + r) ** n) / (((1 + r) ** n) - 1)];
        return this.roundOff(monthlyMortagePayment);
    }
}

let i1 = new InterestRates(6184, 5)
console.log(i1.annualRate);
console.log(i1.calculateCompoundedDailyInterest(24))
console.log(i1.calculateEffectiveInterestRate(365))
console.log(i1.calculateMonthlyMortageRate(12));
console.log(i1.roundOff(2.336));