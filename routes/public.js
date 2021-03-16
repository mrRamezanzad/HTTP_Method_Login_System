module.exports = function (req, res, routes) {
    const fs = require("fs"),
        path = require("path")

    if (req.method === "GET" && req.url.includes("public")) {

        if (routes.some(el => el === req.url)) {

            fs.readFile(path.join(__dirname, "..", req.url), (err, file) => {

                console.log();
                req.url.includes(".css") ? res.writeHead(200, {
                    "Content-Type": "text/css"
                }) : res.writeHead(200, {}) 
                res.end(file)
            })
        }
    }
}