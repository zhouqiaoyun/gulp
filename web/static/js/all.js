/**
 * Created by leiys on 2017/1/8.
 */

//登录信息
$('.spotlight-username').text(localStorage.getItem('username') || 'Default Manager');

//全局基础方法封装
/**
 * ajax封装
 * @param url
 * @param data
 * @param successfn
 * @param errorfn
 * @param req
 */
jQuery.braggAjax = function (config) {
    var url = config.url, data = config.data, successfn = config.successfn, errorfn = config.errorfn, req = config.req, dataType = config.dataType,isLoad = config.isLoad || 1;
    data = (data == null || data == "" || typeof(data) == "undefined") ? {"date": new Date().getTime()} : data;
    $.ajax({
        type: req || "post",
        traditional:true,
        data: dataType || JSON.stringify(data),
        url: url,
        dataType: "json",
        timeout:30000,
        headers: {
        //     'Accept':'application/json',
            'Content-Type':'application/json'
        },
        beforeSend:function(){
            if(isLoad == 1){
                $.braggLoadTg();
            }
        },
        success: function (d) {
            if (typeof d != "object") {
                d = JSON.parse(d);
            }
            if(isLoad == 1){
                $.braggLoadTg();
            }
            successfn(d);
        },
        error: function (e) {
            if(isLoad == 1){
                $.braggLoadTg();
            }
            if(errorfn){
                errorfn(e);
            }else{
                new PNotify({
                      title: 'Oh No!',
                      text: 'Something terrible happened.',
                      type: 'error',
                      styling: 'bootstrap3'
                  });
            }
        }
    });

};

/***
 * loading script
 */
$('body').append('<div id="bragg-fixed-load-box" class="hide"><div></div></div>');
jQuery.braggLoadTg = function(){
    var spinEle = $('#bragg-fixed-load-box');
    if(spinEle.hasClass('hide')){
        spinEle.removeClass('hide');
    }else{
        spinEle.addClass('hide');
    }
}

/***
 * load dropdown
 * @param backFunc
 */
jQuery.braggDropdowBind = function(backFunc){
    $("body").delegate(".dropdown-top-value .dropdown-menu li a","click",function(){
        var v = $(this).text();
        var i = $(this).attr("value");
        var ele = $(this).parent().parent().siblings("button");
        ele.html(v+' <span class="caret"></span>');
        ele.attr("value",i);
        ele.attr("text",v);
        var parentId = $(this).parent().parent().parent().attr("id");
        backFunc(parentId,i,$(this));
    });
};


/**
 * bootstrap 模态框
 * @param info      提示内容
 * @param type      类型 0大模态框 1小模态框
 * @param prompt    标题
 * @param btnfunc   确认事件回调函数(指针,输入框内容)
 * @param thisObj   指针返回
 * @param eleType   提示内容 input 为输入框 dropdown 下拉框
 * @param eleData   数据 {key,val,data}
 * @constructor
 */
jQuery.braggModal = function (config) {
    var info = config.info, type = config.type, prompt = config.prompt ,btnfunc = config.btnfunc,thisObj = config.thisObj,eleType = config.eleType || 'info',eleData = config.eleData;

    var typeStr = Number(type) == 0 ? "lg" : "sm";
    prompt = prompt || "提示";
    var idStr = 'bragg-default-modal-' + typeStr;
    var datestr = new Date().getTime();
    var btnstr = '<div class="modal-footer"><button type="button" class="btn btn-success bragg-modal-ok">ok</button></div>';
    if(eleType == 'input'){
        info = '<input type="text" class="form-control" id="bragg-modal-input-text" placeholder="'+info+'">';
    }
    if(eleType == 'dropdown'){
        info = '<div class="dropdown dropdown-top-value bragg-modal-dropdown-list"> <button type="button" class="btn btn-default dropdown-toggle" style="margin:5px 0;width:100%;" data-toggle="dropdown"><span class="caret"></span></button> <ul class="dropdown-menu" role="menu" style="width:100%;">  </ul> </div>';
    }
    var thisModalEle = '.bragg-modal-message-'+eleType;
    if ($(thisModalEle).length > 0) {
        $(thisModalEle+' .modal-title').text(prompt);
        $(thisModalEle+' .modal-body').html(info);
    } else {
        var ele = '<div class="modal fade bragg-modal-message-'+eleType+' bs-example-modal-' + typeStr + ' bragg-modal-'+datestr+'" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true" style="z-index:9999;display: none;">'
            + '<div class="modal-dialog modal-' + typeStr + '">'
            + '<div class="modal-content">'
            + '<div class="modal-header">'
            + '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>'
            + '<h4 class="modal-title" id="' + idStr + '">' + prompt + '</h4>'
            + '</div>'
            + '<div class="modal-body">'
            + info
            + '</div>' +
            btnstr
            + '</div>'
            + '</div>'
            + '</div>';
        $("body").append(ele);
    }
    if(btnfunc){
        $(thisModalEle+' .modal-footer').show();
    }else{
        $(thisModalEle+' .modal-footer').hide();
    }
    $(thisModalEle).modal('show');
    if(eleType == 'dropdown'){//下拉数据加载
        var thisStr = '';
        var key = eleData.key;
        var val = eleData.val;
        var data = eleData.data;
        for(var k in data){
            thisStr += '<li><a href="javascript:;" value="'+data[k][key]+'">'+data[k][val]+'</a></li>';
        }
        $('.bragg-modal-dropdown-list ul').html(thisStr);
        $.braggDropdowBind(function(){});
    }
    if(btnfunc){//确认事件绑定
        $(thisModalEle).undelegate('.bragg-modal-ok','click');
        $(thisModalEle).delegate('.bragg-modal-ok','click',function(){
            $(thisModalEle).modal('hide');
            if(eleType == 'input'){
                btnfunc({this:thisObj,data:$('#bragg-modal-input-text').val()});
            }else if(eleType == 'dropdown'){
                var dropBtn = $('.bragg-modal-dropdown-list button');
                btnfunc({this:thisObj,data:{key:dropBtn.attr('value'),val:dropBtn.attr('text')}});
            }else{
                btnfunc({this:thisObj});
            }
        });
    }
}
