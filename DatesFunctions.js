class DatesFunctions {

    isLeapYear(year) {
        return new Date(year, 1, 29).getDate() === 29;
    }

    isLeapPresent(date1, date2) {
        date1 = new Date(date1)
        date2 = new Date(date2)
        date1.setDate(date1.getDate() + 1)
        for (let year = date1.getFullYear(); year <= date2.getFullYear(); year++) {
            if (this.isLeapYear(year)) {
                return true;
            }
        }
        return false;
        // if (this.isLeapYear(date1.getFullYear()) || this.isLeapYear(date2.getFullYear())) {
        //     return true
        // } else {
        //     return false
        // }
        // return (this.isLeapYear(date1.getFullYear()) || this.isLeapYear(date2.getFullYear()))
    }

    calculateDaysBetweenDates(startDate, endDate) {
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

    compareDates(disDate, startDate) {
        disDate = new Date(disDate)
        startDate = new Date(startDate)
        return disDate.getTime() <= startDate.getTime();
    }

    addMonth(date, term = 1) {
        date = new Date(date);
        date.setMonth(date.getMonth() + term);
        return date
    }

    getDateInFormat(date, format) {
        date = new Date(date);
        let dateString = "";
        for (const f of format) {
            if (f == "m" ||
                f == "M") {
                dateString += (date.getMonth() + 1) + "/"
            } else if (f == "d" || f == "D") {
                dateString += date.getDate() + "/";
            } else if (f == "Y" || f == "y") {
                dateString += date.getFullYear() + "/";
            }
        }
        return dateString.substring(0, dateString.length - 1);
    }

}

// const date = new DatesFunctions()
// console.log(date.addMonth("02/25/2021", 2).getFullYear())
// console.log(date.getDateInFormat("02/25/2021", "MDY"))

module.exports = {
    DatesFunctions
}