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

// const obj = new Leap("07/12/2021", "08/05/2021")
// console.log(obj.isLeapPresent());

module.exports = {
    Leap
}