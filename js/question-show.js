$(function(){
    // $('#questions').hide();
  var custom = new Custom();
  var params = custom.getQueryParams(window.location.href);

  $.get('https://api.seeonce.cn/chicken/public/subjects', {}, function(data){
    var qs  = data.data;
    $('#subject').append('<ul class="subjects">');
    $('#subject').append("<li><button  type='button' class='btn btn-primary btn-lg disabled'>科目导航</li></button>");
    qs.forEach(function(value, index, array){
      $('#subject').append("<li><button onclick='update(this)'  type='button' class='btn btn-info btn-lg sub' id='"+ value.id + "'>"
      + value.name + "</button></li>");
      // console.log(value.id);
      $('#subject').append("</ul>");
    });
      $('#question').append("<button type='button' id='lastPage' onclick='_lastPage()' name='button'>上一页"
      +"</button><button type='button' id='nextPage' onclick='_nextPage()' name='button'>下一页</button>");
  });
});
