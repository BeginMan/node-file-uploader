/**
 * Created by fangpeng on 16/8/23.
 */

var express = require('express'),
    app = express(),
    path = require('path'),
    formidable = require('formidable'),
    fs = require('fs');

var uploadLimitBytes = 10 * 1024 *1024;     // 上传大小上限 10Mb

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'))
});

app.post('/upload', function (req, res) {
    // 上传大小限制
    var len = req.headers['content-length']
        ? parseInt(req.headers['content-length'], 10) : null;
    if (len && len > uploadLimitBytes) {
        res.writeHeader(413);
        res.end('上传失败: 上传文件过大');
        return;
    }

    var form = new formidable.IncomingForm();
    // 允许用户在一个的请求上传多个文件
    form.multiples = true;
    // 存储在uploads目录下
    form.uploadDir = path.join(__dirname, './uploads');

    // 当文件成功上传时命名
    form.on('file', function (filed, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // 异常处理
    form.on('error', function (err) {
        console.log('Error: ' + err);
    });

    form.on('end', function () {
        res.end('success');
    });

    // 解析请求
    form.parse(req);
});

var server = app.listen(3000, function () {
    console.log('Server listening on port 3000');
});


