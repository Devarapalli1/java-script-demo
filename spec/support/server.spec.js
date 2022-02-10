var Request = require("request");
var fs = require("fs");
const path = require("path");
p = path.join(__dirname, '../../public/index.html')
fs.readFile(p, "utf8", function (err, content) {
    if (err) {
        fileContent = "err"
    } else {
        fileContent = content
        // console.log(fileContent)
    }
})
describe("Server", () => {
    var server;
    beforeAll(() => {
        server = require("../../server");
    });
    afterAll(() => {
        server.close();
    });

    describe('GET /', () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:8000/", (err, res, body) => {
                data.status = res.statusCode;
                data.body = body;
                done();
            });
        });

        it("Status 200", () => {
            expect(data.status).toBe(200);
        });

        it("Body should be index.html file", () => {
            expect(data.body).toEqual(fileContent)
        });

    });

});