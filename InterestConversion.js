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

const a = new InterestConversion(5);
// console.log(a.nominalAnnualInterest(365, 12));
module.exports = {
    InterestConversion
}