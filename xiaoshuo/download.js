var fs = require('fs')
var http = require('http')
var cheerio = require('cheerio')
var urls = require('./url.json')
var url_size = urls.length;
var file;
var start = 0;
var options = "http://www.biqudao.com/bqge3580/2464554.html";
var callback = function(response){
   // 不断更新数据
   var body = '';
   response.on('data', function(data) {
      body += data;
   });
   
   response.on('end', function() {
      // 数据接收完成
      var $ = cheerio.load(body)
      var txt = $('#content').text().trim();
      var title = $('.bookname>h1').text().trim();
      
      txt = '\t\t' + txt.replace(/(?:\s|\t|\n){4}/g, '\n\t\t')
      txt = txt.replace('chaptererror();', '')
      var data = '\n\t\t\t\t\t\t\t' + title + '\n\n' + txt;
      fs.writeSync(file, data, 'utf8')
      console.log('start:' + start + 'writeSuccess!!!');
      start ++;
      if (start == url_size) {
        console.log('downLoad success!!!!')
        fs.closeSync(file);
        return;
      } 
      downLoad(urls[start])
   });
}


function downLoad(url) {
  // 向服务端发送请求
  var req = http.request(url, callback);
  req.end();
} 
file = fs.openSync('a.txt', 'a+');
downLoad(urls[0])