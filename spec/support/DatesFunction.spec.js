var dateFunction = require("../../DatesFunctions");
const DatesFunctions = dateFunction.DatesFunctions;
const dateObj = new DatesFunctions();

describe("Test DateFunctions Class\n\t", () => {

    describe("Test addMonth Functionality\n\t", () => {
        it("Should add a month to the given date(2/03/2021)", () => {
            result = new Date("03/03/2021");
            expect(dateObj.addMonth("2/03/2021")).toEqual(result);
        });
        it("Should add a 2 months when given 2 input with date(12/03/2021)", () => {
            result = new Date("2/03/2022");
            expect(dateObj.addMonth("12/03/2021", 2)).toEqual(result);
        });
        it("Should change the date if the year is leap and Given jan 29", () => {
            result = new Date("03/01/2022");
            expect(dateObj.addMonth("01/29/2022")).toEqual(result);
        });
    });

    describe("Testing isLeapYear function \n\t", () => {
        it("Should return true if the year is leap", () => {
            expect(dateObj.isLeapYear(2016)).toEqual(true);
        });
        it("Should return false if the year is not Leap(2019)", () => {
            expect(dateObj.isLeapYear(2019)).toEqual(false);
        });
    });

    describe("Testing daysInThisMonth Function\n\t", () => {
        it("Should return number of days(31) in the given date month for '01/20/2021'", () => {
            expect(dateObj.daysInThisMonth("01/20/2021")).toEqual(31);
        });
        it("Should return 29 days for a leap month '02/20/2020'", () => {
            expect(dateObj.daysInThisMonth("02/20/2020")).toEqual(29);
        });
        it("Should return 28 days for non leap month '02/20/2019'", () => {
            expect(dateObj.daysInThisMonth("02/20/2019")).toEqual(28);
        });
    });

    describe("Testing calculateDaysBetweenDates Function \n\t", () => {
        it("Should return 365 between 01/01/2021 and 01/01/2022", () => {
            expect(dateObj.calculateDaysBetweenDates("01/01/2021", "01/01/2022")).toEqual(365)
        });

        it("Should return 366 between 01/02/2020 and 01/02/2021", () => {
            expect(dateObj.calculateDaysBetweenDates("01/02/2020", "01/02/2021")).toEqual(366)
        });
    });

    describe("Testing getDateInFormat Function \n\t", () => {

        it("Should return date in MDY format for MDY input", () => {
            expect(dateObj.getDateInFormat("02/03/2021", "MDY")).toEqual("2/3/2021")
        });

        it("Should return date in DMY format", () => {
            expect(dateObj.getDateInFormat("02/03/2021", "DMY")).toEqual("3/2/2021")
        });

        it("Should return date in YMD format", () => {
            expect(dateObj.getDateInFormat("02/03/2021", "YMD")).toEqual("2021/2/3")
        });

    });

    describe("Testing isLeapPresent Fuction \n\t", () => {

        it("Should return true for '2/2/2019' and '2/2/2020", () => {
            expect(dateObj.isLeapPresent('2/2/2019', '2/2/2020')).toEqual(true);
        });

        // Should not include the start date of when comparing

        it("Should return false for '12/31/2020' and '2/2/2021", () => {
            expect(dateObj.isLeapPresent('12/31/2020', '2/2/2021')).toEqual(false);
        });

        it("Should return true (last date inclusive) for '12/3/2019' and '01/01/2020", () => {
            expect(dateObj.isLeapPresent('12/3/2019', '01/01/2020')).toEqual(true);
        });

        it("Should return true for '12/3/2010' and '01/01/2019 range", () => {
            expect(dateObj.isLeapPresent('12/3/2010', '01/01/2019')).toEqual(true);
        });

    });

    describe("When Tesing Compare Dates\n\t", () => {

        it("Should return true for '02/03/2021' and '02/04/2021'", () => {
            expect(dateObj.compareDates('02/03/2021', '02/04/2021')).toEqual(true)
        });

        it("Should return true for same dates", () => {
            expect(dateObj.compareDates('02/04/2021', '02/04/2021')).toEqual(true)
        });

        it("Should return false for '02/04/2021' '02/03/2021'", () => {
            expect(dateObj.compareDates('02/05/2021', '02/04/2021')).toEqual(false)
        });
    });

});