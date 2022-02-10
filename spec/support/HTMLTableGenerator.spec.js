var HTMLTableGeneratorFile = require("../../HTMLTableGenerator")
const HTMLTableGenerator = HTMLTableGeneratorFile.HTMLTableGenerator

describe("Testing HTMLTableGenerator class", () => {

    beforeEach(() => {
        tableObj = new HTMLTableGenerator(1000, "06/26/2018", "08/15/2018", 12, 12.5);
    });

    describe("When Testing add Method", () => {

        it("Should add a tag (h1) to the element(hi)", () => {
            expect(tableObj.add("hi", "h1")).toEqual("<h1>hi</h1>");
        });

        it("Should add a tag (th) to the element(hi)", () => {
            expect(tableObj.add("hi", "th")).toEqual("<th>hi</th>");
        });

    });

    describe("When Testing htmlContent()", () => {

        it("should return a html table content for a given array", () => {
            spyOn(tableObj, "schedule").and.returnValue([
                ["a", "b"],
                ["c", "d"]
            ])
            expect(tableObj.htmlContent()).toEqual(
                "<table><tr><th>a</th><th>b</th></tr><tr><td>c</td><td>d</td></tr></table>")

        })
    });

    describe("When Testing Schedule() method", () => {

        it("Should return enter valid when given invalid disDate and sDate ", () => {
            htmlObj = new HTMLTableGenerator(1000, "02/02/2021", "02/01/2021", 12, 6)
            expect(htmlObj.schedule()).toEqual("<h1> Please enter the valid date disbursement Date and Start Date</h1>")
        });

    });

});