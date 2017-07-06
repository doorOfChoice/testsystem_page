$(function () {
    var params = custom.getQueryParams(window.location.href);

    function requestPaper(id, password) {
        $.ajax({
            method: 'GET',
            url: "https://api.seeonce.cn/paper/public/v2/paper/" + id + "?password=" + password,
            headers: {
                token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjRmMWcyM2ExMmFhIn0.eyJpc3MiOiJodHRwczpcL1wvd3d3LnNlZW9uY2UuY24iLCJhdWQiOiJodHRwczpcL1wvd3d3LnNlZW9uY2UuY24iLCJqdGkiOiI0ZjFnMjNhMTJhYSIsImlhdCI6MTQ5OTE2NTgxNCwibmJmIjoxNDk5MTY1ODE0LCJleHAiOjE0OTkxNjk0MTQsInVzZXJuYW1lIjoiZGF3bmRldmlsIiwiaXNfdGVhY2hlciI6MH0.rIOT87F1tnXOVXKZcwshDCVkFGuJFRE2MePAx4MVHjM"
            },
            statusCode: {
                200: function (data) {
                   $("#main").append(custom.generatePaper(data, {tag:false, answer:false}));
                },
                401: function () {
                    alert("未登录");
                },
                403: function () {
                    password = prompt("试卷需要验证,请输入密码:", null);
                    if(password !== null)
                        requestPaper(id, password);
                },
                404: function () {

                }
            }
        });
    }

    requestPaper(params.id, params.password);

});