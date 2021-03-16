// ====================== initialization 
var main = $("main"),
    modal = $(".modal"),
    modalBody = $(".modal-body"),
    modalFooter = $(".modal-footer"),
    updateButton = $("#update-user"),
    deleteButton = $("#delete-user"),
    pagination = $("#pagination"),
    search = $("#search-input"),
    scrolltrigered = false


let currentPage,
    sortBy = "id",
    // users,
    users = [{
        id: 1,
        "first_name": "ali",
        "last_name": "ahmadi",
        "email": "aliahmadi@gmail.com",
        "avatar": "assets/user1.jpg"
    }, {
        id: 2,
        "first_name": "saeed",
        "last_name": "tehran",
        "email": "saeedstone@gmail.com",
        "avatar": "assets/user2.jpg"
    }, {
        id: 3,
        "first_name": "saman",
        "last_name": "ashari",
        "email": "sameasghari@gmail.com",
        "avatar": "assets/user6.jpg"
    }, {
        id: 4,
        "first_name": "yusef",
        "last_name": "najat",
        "email": "imyusef@gmail.com",
        "avatar": "assets/user3.jpg"
    }, {
        id: 5,
        "first_name": "sami",
        "last_name": "beigi",
        "email": "avamusicsamibeigi@gmail.com",
        "avatar": "assets/user4.jpg"
    }, {
        id: 6,
        "first_name": "sami",
        "last_name": "beigi",
        "email": "avamusicsamibeigi@gmail.com",
        "avatar": "assets/user6.jpg"
    }, {
        id: 7,
        "first_name": "sami",
        "last_name": "beigi",
        "email": "avamusicsamibeigi@gmail.com",
        "avatar": "assets/user7.png"
    }, ],
    targetUser,
    userId


// merge users
function mergeUsers(page1, page2) {
    users = [...page1, ...page2]
}

// get users, call merge and save it to local users if not exists
if (!users) {
    $.ajax({
        type: "get",
        url: "https://reqres.in/api/users?page=1",
        data: "data",
        dataType: "json",
        success: function (page1) {
            $.ajax({
                type: "get",
                url: "https://reqres.in/api/users?page=2",
                data: "data",
                dataType: "json",
                success: function (page2) {
                    mergeUsers(page1.data, page2.data)
                    showUsers(users)
                    showPagination(users)
                    // console.log(users);
                }
            });
        }
    });

} else {
    showUsers(users)
    showPagination(users)
}

// construct user cards 
function showUsers(users, currentPage = 1, sort = sortBy) {
    let cards = 0


    users.sort(function (a, b) {
        if (sort == "id") return a.id - b.id
        let aInstance = a[sort].toLowerCase(),
            bInstance = b[sort].toLowerCase()
        return aInstance > bInstance ? 1 : -1
    })

    // console.log(users);
    main.html(` `)
    let showLimitMin = (currentPage - 1) * 6
    let showLimitMax = currentPage * 6
    for (var i = showLimitMin; i < showLimitMax; i++) {

        if (users[i]) {
            let user = users[i]
            main.append(`
            <div class="col-md-4 mb-3 ">
            <div class="card shadow">
            <img src="/public/${user.avatar}" class="card-img-top rounded-circle" alt="...">
            <div class="card-body">
            <p class="card-text fw-bold">id: <span id="id">${user.id}</span></p>
            <p class="card-text">email: <span id="email">${user.email}</span></p>
            <a user-id="${user.id}" data-bs-toggle="modal" data-bs-target="#more-info-modal" class="btn btn-dark main--cards--card--card-body--more-info">more info</a>
            </div>
            </div>
            </div>
            `)
            cards++

        }
    }
    showPagination(users, currentPage)
    // if page is empty go to previous page 
    if (cards === 0) {
        console.log("no card detected");
        if (currentPage >= 2) {
            --currentPage
            showUsers(users, currentPage)
            console.log(currentPage)
            showPagination(users, currentPage)
        }
    }
}
// construct pagination based on number of users
function showPagination(users, currentPage = 1) {
    // find the numbers of pages needed 
    let pages = (users.length % 6) !== 0 ? (users.length / 6) + 1 : users.length / 6

    // get pagination ready
    pagination.html('')
    // console.log(currentPage);

    for (var i = 1; i <= pages; i++) {
        pagination.append(`
        <li class="page-item ${i === currentPage  ? "active" : ""}" >
        <a id=${i} class="page-link href="?page=${i}">${i}</a>
        </li>
        `)
    }
}

// Add new click handler 
$(".new-user").on("click", "#add-user-button", function (e) {
    e.preventDefault()
    showSignUpForm()
})

// sign up handler 
$("#signup").on("click", function (e) {
    e.preventDefault()
    $.ajax({
        type: "GET",
        url: "http://localhost/logout",
        success: function (response) {
            window.location.replace("http://localhost/login")
        }
    });
})
// show modal form for sign up
function showSignUpForm() {
    console.log("new user is invoked")
    modalBody.html('')
    modalBody.append(`
    <form class=" bg-dark"> 
    <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">user id: </label>
    <input type="text" class="form-control " name="id" >
    </div>
    <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">first name: </label>
    <input type="text" class="form-control" name="first_name">
    </div>
    <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">last name: </label>
    <input type="text" class="form-control" name="last_name">
    </div>
    <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">email address: </label>
    <input type="text" class="form-control" name="email">
    </div>
    <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">picture URL: </label>
    <input type="text" class="form-control" name="avatar">
    </div>
    </form>
    `)
    modalFooter.html(`
    <button id="save-new" class=" btn btn-outline-success offset-left my-3" data-bs-dismiss="modal"> Save </button>
    `)
    console.log(users)
}

// new user functionality
$(".modal").on("click", "#save-new", function (e) {
    let inputs = $("input").not("#search-input"),
        tempUser = {}
    // console.log(inputs)

    for (const input of inputs) {

        tempUser[$(input).attr('name')] = $(input).val()
        // console.log(input)
    }
    // convert id to number format
    tempUser.id = tempUser.id - ""

    // check if user exists
    if (users.find(el => el.id === tempUser.id)) {

        alert("invalid id")
    } else {

        users.push(tempUser)
        showUsers(users, currentPage)
        showPagination(users, currentPage)
    }

    console.log(tempUser);

})

//Read click handler
main.on("click", "a.btn", function (e) {
    e.preventDefault()

    //find the target user 
    userId = $(this).attr("user-id") - ""
    targetUser = users.find(el => el.id === userId)
    console.log(targetUser);
    modalBody.html('')
    modalBody.append(`
    <div class="col-12 ">
        <div class="card bg-dark">
            <img src="/public/${targetUser.avatar}" class="card-img-top" alt="...">
            <div class="card-body fw-bold bg-dark">
                <p class="card-text ">id: <span id="id">${targetUser.id}</span></p>
                <p class="card-text">first name: <span id="first-name">${targetUser.first_name}</span></p>
                <p class="card-text">last name: <span id="last-name">${targetUser.last_name}</span></p>
                <p class="card-text">email: <span id="email">${targetUser.email}</span></p>
            </div>
        </div>
    </div>
    `)
    modalFooter.html(`
        <button id="update-user" type="button" class="btn btn-warning">Update</button>
        <button id="delete-user" type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete</button>
        `)
})

// update save click handler
modal.on("click", "#update-user", function (e) {
    e.preventDefault()
    console.log("Update is invoked")
    modalBody.html('')
    modalBody.append(`
        <form class=" bg-dark"> 
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">user id: </label>
                <input type="text" class="form-control " id="id" value="${targetUser.id}" aria-describedby="emailHelp" disabled>
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">first name: </label>
                <input type="text" class="form-control" id="first_name" value="${targetUser.first_name}">
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">last name: </label>
                <input type="text" class="form-control" id="last_name" value="${targetUser.last_name}">
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">email address: </label>
                <input type="text" class="form-control" id="email" value="${targetUser.email}">
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">picture URL: </label>
                <input type="text" class="form-control" id="avatar" value="${targetUser.avatar}">
            </div>
        </form>
                `)
    modalFooter.html(`
                <button id="save-update" class=" btn btn-outline-success offset-left my-3" data-bs-dismiss="modal"> Save </button>
                `)
})

// when save edited data is clicked
modal.on("click", "#save-update", function (e) {
    e.preventDefault()
    console.log("save update clicked");
    let inputs = $("input").not("#search-input"),
        userIndex = users.findIndex(el => el.id === targetUser.id),
        updateTemp = {}

    updateTemp["id"] = userId
    for (var i = 1; i < inputs.length; i++) {

        updateTemp[$(inputs[i]).attr('id')] = $(inputs[i]).val()
    }
    console.log(updateTemp);
    console.log(targetUser.id);
    users[userIndex] = updateTemp
    console.log(users[userIndex]);

    showUsers(users, currentPage)
    showPagination(users, currentPage)

})

// remove click handler 
modal.on("click", "#delete-user", function (e) {
    e.preventDefault()
    users = users.filter(el => el.id !== userId)
    showUsers(users, currentPage)
})

// pagination click handler 
pagination.on("click", "a.page-link", function (e) {
    e.preventDefault()

    // activate the current page an deactivate others 
    pagination.children("li").removeClass("active")
    $(this).parent("li").addClass("active")

    // show selected page 
    let page = parseInt($(this).attr("id"))
    currentPage = page
    showUsers(users, page)
})

// search input
search.on("keyup", function (e) {
    searchUsers()

})
// search button 
$("#search-button").on("click", function (e) {
    e.preventDefault()
    searchUsers()
})

//search funcitonality
function searchUsers() {
    let searchQuery = $("#search-input").val().toLowerCase(),
        foundUsers

    if (searchQuery.toLowerCase().trim() !== "") {

        // solution 1
        // foundUsers = users.filter((el) => el.id == searchQuery ||
        //     el.first_name === searchQuery || el.last_name === searchQuery ||
        //     el.email === searchQuery || el.avatar === searchQuery
        // )

        // solution 2
        foundUsers = users.filter((el) => String(el.id).includes(searchQuery) || String(el.first_name).includes(searchQuery) ||
            String(el.last_name).toLowerCase().includes(searchQuery) || String(el.email).includes(searchQuery) || String(el.avatar).includes(searchQuery))

        //solution 3 is regex but i'm tired (00)

        // show the damn users
        showUsers(foundUsers)
    } else {

        // show normal page
        showUsers(users)
    }
}

// sort functionality
$("[name=select]").on("change", function (e) {
    // console.log($(this).val());
    sortBy = $(this).val()
    showUsers(users, currentPage, sortBy)
})

// event listener for go in and out of search Hotkeys
$(window).on("keyup", function (e) {

    // focus on search
    if (e.key === "/") $("#search-input").focus()

    //blur the search box
    if (e.key === "Escape") $("#search-input").blur()

})

// navbar scroll change 
$(window).on("scroll", function (e) {
    let triggerPoint = $("select").offset().top - 55
    let scrollPosition = $(this).scrollTop()

    if (scrollPosition > triggerPoint && scrolltrigered === false) {
        console.log("trigger alert");
        scrolltrigered = true
        $(".navbar").toggleClass('scroll navbar-dark bg-dark')
        $(".navbar").toggleClass('navbar-light bg-light')
    }
    if (scrollPosition < triggerPoint && scrolltrigered === true) {
        $(".navbar").toggleClass('scroll navbar-dark bg-dark')
        $(".navbar").toggleClass('navbar-light bg-light')

        console.log("trigger alert");
        scrolltrigered = false
        console.log($(".navbar").text())
    }
})