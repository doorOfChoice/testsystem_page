pageSize = 15;
curPage  = 1;
type     = '';
id       = 0;
function showData(type, id){
    //showPart("myQuestion");
    $.get('https://api.seeonce.cn/chicken/public/questions/' + type + '/' + id + '?page=' + curPage, {}, function(data){
    pageSize = data.data.pages.perPage;
    curPage = data.data.pages.curPage;
    var lastPage = data.data.pages.lastPage;
    var qs  = data.data.questions;
    var len = qs.length;
if (curPage == 1) {
        $("#lastPage").attr("disabled",true);
    } else {
$("#lastPage").attr("disabled",false);
        beginIndex = (pageSize * (curPage - 1));
    }

    if (curPage < lastPage) {
        $("#nextPage").attr("disabled",false);
        if (curPage != 1)
            $("#lastPage").attr("disabled",false);
    }
    if (curPage == lastPage) {
        $("#nextPage").attr("disabled",true);
    }
$("#tableBody").empty();
        for(var i = 0; i < len; i++){
      $("#tableBody").append(
      	 "<tr>" +
            //"<td><input type='checkbox' name='selectQuestion' value='"+qs[i].id+"'></td>" +
            "<td>" + qs[i].id + "</td>" +
            "<td>" + qs[i].username + "</td>" +
            "<td>" + qs[i].subject + "</td>" +
            "<td>" + qs[i].type + "</td>" +
            "<td>" + qs[i].content + "</td>" +
            "<td>" + loadOperator(qs[i].id) + "</td>" +
            "</tr>");
          }
          $("#nowPageAndTotalPages").html(" 当前页" + (curPage) +" 共有" + (lastPage) + "页");
})
}

// 获取查询或修改命令
function loadOperator(id) {
    var operatorHtml = "<span onclick=checkQuestionInfo(" + id + ")>查看</span>";
    return operatorHtml;
}

function checkQuestionInfo(id){
window.open('single-question.html?id=' + id);
}

function _nextPage() {
    curPage++;
    showData(type, id);
}

function _lastPage() {
    curPage--;
    showData(type, id);
}

function update(self){
  $('#myCarousel').hide();
  $('#questions').show();
  id   = $(self).attr('id');
  type = 'subject';
  curPage = 1;
  showData(type, id);
}
