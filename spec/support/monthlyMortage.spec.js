const monthlyMortage = require("../../monthlyMortage");
const MonthlyMortage = monthlyMortage.MonthlyMortage;
const dateFunction = require("../../DatesFunctions");
const DatesFunctions = dateFunction.DatesFunctions;

describe("Testing monthlyMortage Class ", () => {

    beforeEach(() => {
        date = new DatesFunctions()
        mortage = new MonthlyMortage(1000, 5, 12, date);
    });

    describe("When testing roundOff method()", () => {

        it("Should return the value round of 2 decimals for a given round", () => {
            expect(mortage.roundOff(23.657)).toEqual(23.66);
        });

        it("Should return the value of 23.44 when given 23.444", () => {
            expect(mortage.roundOff(23.4444)).toEqual(23.44);
        });

    });

    describe("When testing dayCount method ", () => {

        it("should return 365 for non leap year period '2/2/2019' to '4/2/2019' ", () => {
            spyOn(date, 'isLeapPresent').and.returnValue(false);
            expect(mortage.dayCount('2/2/2019', 20)).toEqual(365);
        });

        it("should return 366 when isLeapPresent is true", () => {
            spyOn(date, 'isLeapPresent').and.returnValue(true);
            expect(mortage.dayCount('2/2/2020', 20)).toEqual(366);
        });

    });

    describe("When testing calculateBaseMonthlyMortageRate method ", () => {

        it("Should return 85.61 for p=1000,r=5,noofpayments=12", () => {
            expect(mortage.calculateBaseMonthlyMortageRate()).toEqual(85.61);
        });

        it("Should return 1010 for p=1000, r=12, noofpayments=1", () => {
            expect(mortage.calculateBaseMonthlyMortageRate(1, 1000, 12)).toEqual(1010);
        });

    });

    describe("When testing calculateMonthlyInterestForCompoundedDaily ", () => {

        it("Should return 120 for non-leap p=1000,r=12, t=365", () => {
            spyOn(mortage, "dayCount").and.returnValue(365)
            expect(mortage.calculateMonthlyInterestForCompoundedDaily(1000, 12, 365)).toEqual(120);
        });

        it("Should return 119.67 if the year is leap", () => {
            spyOn(mortage, "dayCount").and.returnValue(366)
            expect(mortage.calculateMonthlyInterestForCompoundedDaily(1000, 12, 365)).toEqual(119.67);
        });

    });

    describe("When testing extraAddedPrincipal ", () => {

        it("Should return 290 for -2,200,90 (add value to principal)", () => {
            expect(mortage.extraAddedPrincipal(-2, 200, 90)).toEqual(290);
        });

        it("Should return 110 for 2,200,90 (subtract from principal)", () => {
            expect(mortage.extraAddedPrincipal(2, 200, 90)).toEqual(110);
        })

        it('Should return same monthly payment if diffB/W days is 0', () => {
            expect(mortage.extraAddedPrincipal(0, 200, 10)).toEqual(200);
        });

    });

    describe("When testing schedule method ", () => {

        it("Should return 'wrong input dates' message for disDate>startDate", () => {
            expect(mortage.schedule('2/2/2020', '1/2/2020')).toEqual("Wrong input dates");
        });

        it("The resultant array length should be 14 ", () => {
            // spyOn(mortage, "noOfPayments").and.returnValue(11);
            expect(mortage.schedule('2/2/2020', '3/3/2020').length).toEqual(14);
        });

        it("it should contain 7 sub fileds", () => {
            expect(mortage.schedule('2/2/2020', '3/3/2020')[0].length).toEqual(7);
        });

    });

    describe("When testing adjustingPrincipalAmount ", () => {

        it("should return 106.54 for 11/25/2019,12/15/2019, rate=6,term=12", () => {
            mortage = new MonthlyMortage(1240, 6, 12, date);
            expect(mortage.adjustingPrincipalAmount('12/15/2019', 600, 1240, 20)).toEqual(106.54)
        });

        it("should return 95.45 for 01/05/2020, rate=11,term=12", () => {
            mortage = new MonthlyMortage(1080, 11, 12, date);
            expect(mortage.adjustingPrincipalAmount('01/05/2020', 95.45, 1080, 31)).toEqual(95.45)
        });

    });

});