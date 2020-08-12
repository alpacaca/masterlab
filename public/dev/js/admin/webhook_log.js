
var WebhookLog = (function() {

    var _options = {};

    // constructor
    function WebhookLog( options ) {
        _options = options;

    };

    WebhookLog.prototype.getOptions = function() {
        return _options;
    };

    WebhookLog.prototype.setOptions = function( options ) {
        for( i in  options )  {
           // if( typeof( _options[options[i]] )=='undefined' ){
                _options[i] = options[i];
           // }
        }
    };

    WebhookLog.prototype.fetchLogs = function() {
        loading.show('#'+_options.list_render_id);
        var params = {format: 'json'};
        $.ajax({
            type: "GET",
            dataType: "json",
            async: true,
            url: _options.filter_url,
            data: $('#filter_form').serialize(),
            success: function (resp) {
                loading.closeAll();
                auth_check(resp);
                if(resp.data.logs_arr.length){
                    var activitys = [];
                    for(var i=0; i<resp.data.logs_arr.length;  i++) {
                        var user_id = resp.data.logs_arr[i].user_id;
                        //resp.data.logs_arr[i].user = getValueByKey(_issueConfig.users,user_id);
                    }

                    var source = $('#'+_options.list_tpl_id).html();
                    var template = Handlebars.compile(source);
                    var result = template(resp.data);
                    $('#'+_options.list_render_id).html(result);

                    var pages = parseInt(resp.data.pages);
                    var options = {
                        currentPage: resp.data.page,
                        totalPages: resp.data.pages,
                        onPageClicked: function (e, originalEvent, type, page) {
                            console.log("Page item clicked, type: " + type + " page: " + page);
                            $("#filter_page").val(page);
                            WebhookLog.prototype.fetchWebhookLogs();
                        }
                    };
                    $('#ampagination-bootstrap').bootstrapPaginator(options);
                }else{
                    var emptyHtml = defineStatusHtml({
                        message: '获取数据为空',
                        type: 'id',
                        handleHtml: ''
                    });
                    $('#'+_options.list_render_id).html($('<div   id="empty_wrap"></div>'))
                    $('#empty_wrap').append(emptyHtml.html)
                }

            },
            error: function (res) {
                notify_error("请求数据错误" + res);
            }
        });
    };


    WebhookLog.prototype.resetFormData = function( ) {
        $('#filter_form')[0].reset();
        $('.selectpicker').selectpicker('refresh');
        WebhookLog.prototype.fetchWebhookLogs();
    };

    return WebhookLog;
})();

