function Custom() {
  //生成非简答题的选项
  this.generateNoReplyOption = function (data, args = {}) {
    //配置选项
    var config = $.extend({
      type: 'radio',
      forbidden: true,
      answer: true
    }, args);

    var assembly = {
      judge: 'radio',
      radio: 'radio',
      multi: 'checkbox'
    };

    options = data.options;
    parentId = data.id;
    var optionPane = $('<div>');
    for (var i = 0; i < options.length; ++i) {
      var singleOptionPane = $('<div class="box">');
      var index = $('<p class="box-index">').text(String.fromCharCode(i + 65));
      var content = $('<p class="box-content">').text(options[i].content);
      var option = $('<input class="box-input">').attr({
        type: assembly[config.type],
        name: 'option-' + parentId,
        id: 'option-' + options[i].id
      });

      //是否允许操作选项
      if (config.forbidden) {
        option.attr('disabled', 'true');
      }

      //是否显示答案
      if (options[i].correct == 1) {
        if (config.answer) {
          option.attr('checked', 'true');
        }
        if (config.type == 'judge') {
          content = content.text('√');
        }
      } else {
        if (config.type == 'judge') {
          content = content.text('×');
        }
      }


      singleOptionPane.append(index, option, content);
      optionPane.append(singleOptionPane);
    }

    return optionPane;
  };

  //生成问答题的选项
  this.generateReplyOption = function (data, args = {}) {
    var config = $.extend({
      forbidden: true,
      answer: true
    }, args);

    var options = data.options;
    var optionPane = $('<div>');
    var singleOptionPane = $('<div>');

    var textarea = $('<textarea>').addClass('form-control');

    if (config.forbidden) {
      textarea.attr('disabled', true);
    }

    if (config.answer) {
      textarea.val(options[0].content);
    }

    return singleOptionPane.append(textarea);
  }
  this.analyseDescription = function(data) {
      var $description = data.description;
      var $typename = data.type_name;
      if($typename == '简答题') {
        $('#question-' + data.id).find('textarea').val(data.description);
      }else {
        $arr = (data.description).split(',');
        $arr.forEach(function(element) {
          $('#option-' + element).attr('checked', true);
        });
      }
  }
  //生成问题
  this.generateQuestion = function (data, args) {
    var config = $.extend({
      forbidden: true,
      answer: true,
      tag: true
    }, args);

    var grade = '';
    if(data.max_grade == null) {
      grade = data.grade != null ? '(分数:' + data.grade + ')' : '';
    }else {
      if(data.has_correct)
        grade = '[得分:' + data.current_grade + '](试题分值:' + data.max_grade + ')';
      else
        grade = '<b style="color:red">[未批改]</b>(试题分值:' + data.max_grade + ')';
    }

    var qPanel = $('<div>')
      .addClass('single-question')
      .attr('id', 'question-' + data.id);

    var qPanelContent = $('<pre>').text(data.content).append(
      $('<span>').html(grade)
    );

    var qPanelSubject = $('<span class="label label-warning">').text("科目:" + data.subject_name);

    var qPanelHot = $('<span class="label label-danger">').text("访问量:" + data.hot);

    var qPanelType = $('<span class="label label-success">').text(data.type_name);

    if (config.tag) {
      var qPanelTagsPane = $('<div class="tag-panel">')
        .html('<span class="label label-default">知识点</span><br/>');
      (data.tags).forEach(function (element) {
        var tag = $('<span class="label label-info">').text(element.name);
        qPanelTagsPane.append(tag);
      });
    }

    var qPanelOptionPane = $('<div>');


    var result;
    switch (data.type_name) {
      case "单选题":
        config.type = 'radio';
        result = this.generateNoReplyOption(data, config);
        break;
      case "多选题":
        config.type = 'multi';
        result = this.generateNoReplyOption(data, config);
        break;
      case "判断题":
        config.type = 'judge';
        result = this.generateNoReplyOption(data, config);
        break;
      case "简答题":
        result = this.generateReplyOption(data, config);
        break;
    }
    qPanelOptionPane.append(result)
    qPanel.append(qPanelContent, qPanelSubject, qPanelHot, qPanelType);
    if (config.tag) {
      qPanel.append(qPanelTagsPane);
    }
    qPanel.append(qPanelOptionPane);
    return qPanel;
  };

  //生成试卷
  this.generatePaper = function (data, args = {}) {
    var config = $.extend({
      forbidden: true,
      answer: true,
      tag: true
    }, args);
    var $data = data.datas;
    var $submit = $data.paper == null;
    var $main = $('<div>')
      .attr('id', 'paper')
      .addClass('paper-' + ($submit ? $data.id : $data.paper.id));
    var $baseMessage = $('<div>').addClass('box');
    var $pCreator = $('<p>')
      .addClass('box-equal')
      .text("创建人:" + ($submit ? $data.teacher_id : $data.paper.teacher_id));
    var $pSubject = $('<p>')
      .addClass('box-equal')
      .text("科目:" + ($submit ? $data.subject_name : $data.paper.subject_name));
    var $pCreateDate = $('<p>')
      .addClass('box-equal')
      .text("创建时间:" + ($submit ? $data.create_date : $data.paper.create_date));
    $baseMessage.append($pCreator, $pSubject, $pCreateDate);
    var $head = $('<h1 align="center" id="header">').append($submit ? $data.title : $data.paper.title);
    $main.append($head).append($baseMessage);

    $that = this;

    (data.datas.questions).forEach(function (element, index) {
      $main.append($('<p>').html('<span class="label label-default">[问题' + index + ']</span>'));
      $main.append($that.generateQuestion(element, config));
    });

    return $main;
  };

  //获取查询字符串参数
  this.getQueryParams = function (_url) {
    var url = _url;
    var start = url.indexOf('?');
    var obj = {};

    if (start === -1)
      return obj;

    var preg = /((\w+)=(\w+))/ig;
    var queryString = url.substring(start + 1);
    while (r = preg.exec(queryString)) {
      obj[r[2]] = r[3];
    }
    return obj;
  };

  this.getId = function (str) {
    var id = str.slice(str.indexOf('-') + 1);
    return id;
  }

  this.getFunc = function(args) {
    return function(args) {
      return args;
    };
  }

}

//倒计时函数
function TimeCount() {
  this.count = 3600;
  this.machine = null;

  this.countDown = function (flag) {
    var hour = parseInt(this.count / 3600);
    var minute = parseInt((this.count - hour * 3600) / 60);
    var second = parseInt((this.count - hour * 3600 - minute * 60));
    $(flag).text("剩下时间 " + hour + ":" + minute + ":" + second);
    if (this.count-- <= 0)
      this.stop();
  };

  this.stop = function () {
    clearInterval(this.machine);
  };

  this.start = function (flag) {
    var that = this;
    this.machine = setInterval(function () {
      return that.countDown(flag);
    }, 1000);
  }
}





var custom  = new Custom();
var timeout = new TimeCount();