const fs = require("fs");
const { parse } = require("csv-parse");

module.exports = async function (csvFile) {
    const result = [];
    const stream = fs.createReadStream(csvFile).pipe(parse({ delimiter: ",", from_line: 2 }));

    return new Promise((resolve, reject) => {
        stream.on("data", function (row) {
            result.push(row);
        }).on("end", function () {
            console.log("finished");
            return resolve(result);
        }).on("error", function (error) {
            console.log(error.message);
            reject(error.message);
        });
    });
};
