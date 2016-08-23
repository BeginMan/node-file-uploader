/**
 * Created by fangpeng on 16/8/23.
 */

$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function(){
    var files = $(this).get(0).files;
    if (files.length > 0) {
        var formData = new FormData();

        // 遍历所有选定的文件,并将它们添加到formData对象
        // <input type="file">能上传多个文件，只需添加multiple或multiple="multiple"属性
        for(var i=0; i < files.length; i++) {
            var file = files[i];
            formData.append('uploads[]', file, file.name);
        }

        // 关于FormData可参考:http://www.jianshu.com/p/46e6e03a0d53
        // ajax

        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            processData: false,     // processData设置为false。因为data值是FormData对象，不需要对数据做处理
            contentType: false,     // contentType设置为false。因为是由<form>表单构造的FormData对象，且已经声明了属性enctype="multipart/form-data"，所以这里设置为false。
            success: function (data) {
                console.log('upload successful!\n' + data);
            },
            error: function (xmlReq, msg, except) {
                if (xmlReq.status == 413) {
                    $('.progress-bar').html(xmlReq.responseText);
                }
            },
            xhr: function () {
                // create an XMLHttpRequest
                var xhr = new XMLHttpRequest();
                // listen to the 'progress' event
                xhr.upload.addEventListener('progress', function (evt) {
                    if (evt.lengthComputable) {
                        // calculate the percentage of upload completed
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);

                        // update the Bootstrap progress bar with the new percentage
                        $('.progress-bar').text(percentComplete + '%');
                        $('.progress-bar').width(percentComplete + '%');

                        // once the upload reaches 100%, set the progress bar text to done
                        if (percentComplete === 100) {
                            $('.progress-bar').html('Done');
                        }
                    }
                }, false);
                return xhr;
            }
        });
    }
});