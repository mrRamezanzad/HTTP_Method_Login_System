const server   = require("http"),
      path     = require("path"),
      fs       = require("fs"),
      public   = require("./routes/public.js"),
      routes   = [
        "/",
        "/login",
        "/logout",
        "/profile",
        "/panel",
        "/public/css/login.css",
        "/public/assets/background.jpg",
        "/public/js/login.js",
        "/public/css/bootstrap.css",
        "/public/css/1-reqres-users.css",
        "/public/js/jquery.min.js",
        "/public/js/bootstrap.js",
        "/public/js/1-reqres-users.js",
        "/public/assets/user1.jpg",
        "/public/assets/user2.jpg",
        "/public/assets/user3.jpg",
        "/public/assets/user4.jpg",
        "/public/assets/user5.jpg",
        "/public/assets/user6.jpg",
        "/public/assets/user7.png",
    ]

let isLoggedIn = [false]

server.createServer(function (req, res) {

    // ============ root page ============
    if (req.method === "GET" && req.url === "/") {

        res.writeHead(302, {"Location": "http://localhost/login"})
        res.end()

    }

    // using public files
    public(req, res, routes)

    // routing modules
    require("./routes/profile")(req, res, isLoggedIn)

    // ============ not found page ============
    if (check404(req.url)) {
        res.writeHead(404)
        fs.readFile(path.join(__dirname, "views/404.html"), (err, page) => {
            if (err) console.log(err)
            res.write(page)
            res.end()
        })
    }

}).listen(80, () => {
    console.log(" ======================================== Server started at: http://localhost:80/ ======================================== ")
})

// ============= Get All Other Pages That Are Not Defined As 404 ==============
function check404(url) {
    // console.log(String("/"+routes[1]),"------",String(url));
    return routes.some((el) => el === String(url)) ? false : true
}