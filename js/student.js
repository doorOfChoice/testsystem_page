$(function () {
  var $token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjRmMWcyM2ExMmFhIn0.eyJpc3MiOiJodHRwczpcL1wvd3d3LnNlZW9uY2UuY24iLCJhdWQiOiJodHRwczpcL1wvd3d3LnNlZW9uY2UuY24iLCJqdGkiOiI0ZjFnMjNhMTJhYSIsImlhdCI6MTQ5OTE2NTgxNCwibmJmIjoxNDk5MTY1ODE0LCJleHAiOjE0OTkxNjk0MTQsInVzZXJuYW1lIjoiZGF3bmRldmlsIiwiaXNfdGVhY2hlciI6MH0.rIOT87F1tnXOVXKZcwshDCVkFGuJFRE2MePAx4MVHjM";

  //生成老师表格数据
  function dealData(data, eventObj) {
    $('#main').empty();
    var $data = data.datas.data;
    var $page = data.datas;
    var $main = $('#main');
    var $table = $('<table>').addClass('table table-bordered');
    var $th = $('<tr>');
    $th.append($('<th>id</th>'));
    $th.append($('<th>username</th>'));

    eventObj.forEach(function (element) {
      $th.append($('<th>' + element.keyHead + '</th>'));
    });

    $table.append($th);

    $data.forEach(function (element) {
      $content = $('<tr>');
      $content.append('<td>' + element.id + "</td>");
      $content.append('<td>' + element.name + "</td>");
      for (let i = 0; i < eventObj.length; i++) {
        let eventTemp = eventObj[i];
        $link = $('<a>' + eventTemp.keyName + '</a>').on('click', function (event) {
          eventTemp.event(element, this);
        });
        $content.append($('<td>').append($link));
      }
      $table.append($content);
    });

    $adjust = function (event) {
      $func = dealData;
      if ($(this).attr('href') != null) {
        $.get($(this).attr('href'), {}, 'json')
          .done(function (data) {
            $("#main").empty();
            $func(data, eventObj);
          });
      }
    };
   
    $main.append(buttonGenerator(data, $adjust));
    $main.append($table);

    return $table;
  }

  /**
   * 按钮生成器
   * @param {*} data    原始数据
   * @param {*} $adjust 触发按钮完成的事件  
   */
  function buttonGenerator(data, $adjust) {
    $panel = $('<div>');

    var $prev = $('<button>上一页</button>')
      .attr("href", data.datas.prev_page_url)
      .on('click', $adjust);
    var $next = $('<button>下一页</button>')
      .attr("href", data.datas.next_page_url)
      .on('click', $adjust);
    
    return $panel.append($prev, $next);
  }

  //普通试卷生成器
  function commomPaperGenerator($data) {
    $panel_array = [];
    $data.forEach(function (element) {
      $panel = $('<div>').addClass('paper-view');
      $link = $('<a>').attr('href', 'paper-test.html?id=' + element.id).text(element.title);
      $title = $('<h1>').append($link);
      $creator = $('<p>')
        .addClass('child')
        .text('创建人:' + element.teacher_id);
      $box = $('<div>')
        .addClass('box')
        .append($creator);
      $panel.append($title, $box);
      $panel_array.push($panel);
    });

    return $panel_array;
  }
  //修改未修改试卷生成器
  function correctedPaperGenerator($data, corrected = false) {
    $panel_array = [];
    $data.forEach(function (element) {
      $panel = $('<div>').addClass('paper-view');
      $link = $('<a>')
            .text(element.title)
            .attr('href', 
            'corrected-paper.html?pid=' 
            + element.paper_id + '&sid='
            + element.student_id + '&tid='
            + element.teacher_id);
      $title = $('<h1>').append($link);
      $creator = $('<p>')
        .addClass('child')
        .text('创建人:' + element.teacher_id);
      $box = $('<div>')
        .addClass('box')
        .append($creator);
      $panel.append($title, $box);
      $panel_array.push($panel);
    });

    return $panel_array;
  }

  //处理普通试卷数据
  function dealPaperData(data, callback, $args = null) {
    $('#main').empty();
    var $data =($args === null ? data.datas.papers : data.datas.data);
    var $main = $("#main");
    var $buttonPanel = $('<div>');

    $main.empty();

    $adjust = function (event) {
      $func = dealPaperData;
      if ($(this).attr('href') != null) {
        $.get($(this).attr('href'), {}, 'json')
          .done(function (data) {
            $("#main").empty();
            $func(data, callback, $args);
          });
      }
    };

    $main.append(buttonGenerator(data, $adjust));
    
    $result_panel = $args == null ? callback($data) : callback($data, $args);
    $result_panel.forEach(function(element) {
        $main.append(element); 
    });
  }



  //展示所有的老师
  function showAllTeachers() {
    var eventObj = [{
      keyName: "关注",
      keyHead: "事件",
      event: function (element, assembly) {
        $.ajax({
          method: "POST",
          url: "https://api.seeonce.cn/paper/public/v2/student/teacher",
          data: {
            teacher_id: element.id
          },
          statusCode: {
            201: function () {
              alert("恭喜你关注了:" + element.id);
            },
            401: function () {
              alert("兄弟你没权限啊");
            },
            403: function () {
              alert("已经关注该老师");
            },
            404: function () {
              alert("老师你不存在啊");
            },
            422: function () {
              alert("大哥参数不对啊");
            }
          },
          headers: {
            token: $token
          },
          dataType: "json"
        });
      }
    }];
    $.get('https://api.seeonce.cn/paper/public/v2/teacher', {}, 'json')
      .done(function (data) {
        dealData(data, eventObj);

      });
  }

  //展示已经关注的老师
  function showFollowedTeachers() {
    $('#main').empty();
    var eventObj = [{
      keyName: "取消关注",
      keyHead: "事件",
      event: function (element, assembly) {
        $.ajax({
          method: "DELETE",
          url: "https://api.seeonce.cn/paper/public/v2/student/teacher/" + element.id,
          statusCode: {
            204: function () {
              alert("恭喜你删除了:" + element.id);
              $(assembly).parent().parent().remove();
            },
            401: function () {
              alert("兄弟你没权限啊");
            },
            403: function () {
              alert("已经关注该老师");
            },
            404: function () {
              alert("老师你不存在啊");
            },
            422: function () {
              alert("大哥参数不对啊");
            }
          },
          headers: {
            token: $token
          },
          dataType: "json"
        });
      }
    }, {
      keyName: "查看",
      keyHead: "试卷",
      event: function (element, assembly) {
        $.ajax({
          method: "GET",
          url: "https://api.seeonce.cn/paper/public/v2/paper/teacher/" + element.id,
          statusCode: {
            200: function (data) {
              dealPaperData(data, commomPaperGenerator);
            },
            401: function () {
              alert("兄弟你没权限啊");
            },
            404: function () {
              alert("老师你不存在啊");
            }
          },
          headers: {
            token: $token
          },
          dataType: "json"
        });
      }
    }];
    $.ajax({
      method: "GET",
      dataType: "json",
      url: "https://api.seeonce.cn/paper/public/v2/student/teacher",
      headers: {
        token: $token
      },
      statusCode: {
        200: function (data) {
          $("#main").append(dealData(data, eventObj));
        }
      }
    });
  }

  
  //展示未批改的试卷
  function showUnCorrectedPaper() {
    $.ajax({
      method : 'GET',
      url : 'https://api.seeonce.cn/paper/public/v2/paper/uncorrected/student',
      dataType : 'json',
      headers : {
        token : $token
      },
      statusCode : {
        200 : function (data) {
          
          dealPaperData(data, correctedPaperGenerator, false);
        }
      }
    });
  }


  //展示批改了的试卷
  function showCorrectedPaper() {
    $.ajax({
      method : 'GET',
      url : 'https://api.seeonce.cn/paper/public/v2/paper/corrected/student',
      dataType : 'json',
      headers : {
        token : $token
      },
      statusCode : {
        200 : function (data) {
          dealPaperData(data, correctedPaperGenerator, true);
        }
      }
    });
  }

  (function () {
    $("#myfollow").click('on', function () {
      showFollowedTeachers();
    });
    $("#follow").click('on', function () {
      showAllTeachers();
    });
    $('#uncorrected').click('on', function(){
      showUnCorrectedPaper();
    });
    $('#corrected').click('on', function(){
      showCorrectedPaper();
    });
  })();
});

