
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
          $("#main").append(custom.generatePaper(data, {
            tag: false,
            answer: false,
            forbidden: false
          }
          ));
          $('#header').after($('<p align="center" id="timeview">'));
          $('#main').append($("#submit"));
          timeout.start('#timeview');
        },
        401: function () {
          alert("未登录");
        },
        403: function () {
          password = prompt("试卷需要验证,请输入密码:", null);
          if (password !== null)
            requestPaper(id, password);
        },
        404: function () {

        }
      }
    });
  }



  (function () {

    var getData = function () {
      var questions = $('.single-question');
      var $pid = custom.getId($('#paper').attr('class'));
      var $obj = [];
      for (var i = 0, len = questions.length; i < len; ++i) {
        var $qid = custom.getId($(questions[i]).attr('id'));
        var $reply = [];
        var $description = '';
        var options = $(questions[i]).find('input:checked');
        if (options.length != 0) {
          for (var j = 0; j < options.length; j++) {
            $reply.push(custom.getId($(options[j]).attr('id')));
          }
        } else {
          $description = $(questions[i]).find('textarea').val();
        }

        $obj.push({
          id: $qid,
          replys: $reply,
          description: $description
        });
      }

      return {
        paper_id: $pid,
        answers: $obj
      };
    };

    $button = $('<button id="submit" class="btn btn-primary btn-block">').on('click', function (event) {
      //判断是否时间过期
      if(timeout.count <= 0) {
        alert("已经过了试卷的提交时间");
        return ;
      }

      $.ajax({
        url: 'https://api.seeonce.cn/paper/public/v2/paper/validity',
        method: 'POST',
        data: JSON.stringify(getData()),
        contentType: "application/json;charset=utf8",
        headers: {
          token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjRmMWcyM2ExMmFhIn0.eyJpc3MiOiJodHRwczpcL1wvd3d3LnNlZW9uY2UuY24iLCJhdWQiOiJodHRwczpcL1wvd3d3LnNlZW9uY2UuY24iLCJqdGkiOiI0ZjFnMjNhMTJhYSIsImlhdCI6MTQ5OTE2NTgxNCwibmJmIjoxNDk5MTY1ODE0LCJleHAiOjE0OTkxNjk0MTQsInVzZXJuYW1lIjoiZGF3bmRldmlsIiwiaXNfdGVhY2hlciI6MH0.rIOT87F1tnXOVXKZcwshDCVkFGuJFRE2MePAx4MVHjM"
        },
        statusCode: {
          201: function (data) {
            alert("试卷提交成功");
            $('#submit').attr('disabled', 'true');
          },
          401: function () {
            alert("无权限");
          },
          403: function () {
            alert("禁止访问");
          },
          422: function () {
            alert("检测到参数错误");
          },
          500: function () {
            alert("试卷已经提交过了");
          }
        }
      });
    }).text("提交");
    $('#main').append($button);
  })();
  requestPaper(params.id, params.password);
});
