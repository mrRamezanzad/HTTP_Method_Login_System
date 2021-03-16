var loginButton = $("#login-button")


// send authentication request button handler
loginButton.on("click", function (e) {

    // check if inputs are empty
    if ($("#username").val() === "") $(".empty-username").css("opacity", "1")
    else $(".empty-username").css("opacity", "0")
    if ($("#password").val() === "") $(".empty-password").css("opacity", "1")
    else $(".empty-password").css("opacity", "0")

    let formData = {
        username: $("#username").val(),
        password: String($("#password").val())
    }
    e.preventDefault()

    //    login request
    $.ajax({
        type: "POST",
        url: "http://localhost/login",
        data: JSON.stringify(formData),
        // dataType: "text/html",
        success: function (response) {

            if (response === "authorized") {
                console.log("response: ", response);
                $(".login-status").text("خوش آمدید").addClass("success-text")

                setInterval(() => {
                    window.location.replace("http://localhost/panel")

                }, 750)


            }
        },
        error: function (err) {
            console.log(err);
            $("input").css({
                "border": "1px solid red",
                "box-shadow": "0 0 10px 0px red"
            })
            $(".login-status").text("کاربری با این مشخصات وجود ندارد").addClass("error-text")


        }
    });

})

$("input").on("click", (e) => {
    $("input").css({
        "border": "1px solid transparent",
        "box-shadow": "0 0 10px 0px transparent"
    })
    // $(".login-status").css("opacity", "0")
    // check if inputs are empty
    $(".empty-text").css("opacity", "0")
})