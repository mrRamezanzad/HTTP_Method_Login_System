const fs = require("fs"),
    path = require("path")

module.exports = function (req, res, isLoggedIn) {

    // login page
    if (req.method === "GET" && req.url === "/login") {

        if (isLoggedIn[0] === true) {
            res.writeHead(302, {
                "Location": "http://localhost/profile"
            })
            res.end()
        } else {

            fs.readFile(path.join(__dirname, "..", "/views/login.html"), "utf8", (err, page) => {
                if (err) console.log(err)
                res.writeHead(200)
                res.write(page)
                res.end()
            })
        }
    }

    // authenticate post request handler
    if (req.method === "POST" && req.url === "/login") {

        formData = ""
        req.on("data", chunk => {
            formData += chunk
        })
        req.on("end", () => {

            isLoggedIn[0] = authenticateUser(JSON.parse(formData))
            console.log("authenticate post :", isLoggedIn);
            if (isLoggedIn[0]) {
                res.writeHead(200, {
                    "Location": "/panel",
                    "Content-Type": "text/html"
                })
                res.end("authorized")
            } else {
                res.writeHead(401, {
                    "Content-Type": "simple/text"
                })
                res.end("unauthorized")
            }
        })


    }

    // logout
    if (req.method === "GET" && req.url === "/logout") {
        isLoggedIn[0] = false
        console.log("logout");
        res.writeHead(200)
        res.end("logged out")
    }

    // panel and profile page 
    if (req.method === "GET" && req.url === "/panel" || req.url === "/profile") {

        console.log("panel get: ", isLoggedIn);
        if (isLoggedIn[0]) {
            fs.readFile(path.join(__dirname, "..", "/views/1-reqres-users.html"), "utf8", (err, page) => {
                if (err) console.log(err);
                res.writeHead(200, {
                    "Content-Type": "text/html"
                })
                res.end(page)
            })

        } else {
            res.writeHead(302, {
                "Location": "http://localhost/login"

            })
            res.end(String(isLoggedIn[0]))
        }
    }
}

// authentication
function authenticateUser(formData) {
    let response = {}

    let users = fs.readFileSync(path.join(__dirname, "..", "DB/users.json"), "utf8")
    users = JSON.parse(users)
    return users.data.find(el => el.userName === formData.username && el.password === formData.password) ?
        response.success = true : response.success = false



}