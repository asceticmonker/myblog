var fs = require('fs')
var http = require('http')
var cheerio = require('cheerio')


var url = 'http://www.biqudao.com/bqge94814/';
var callback = function(response){
   var body = '';
   response.on('data', function(data) {
      body += data;
   });
   
   response.on('end', function() {
      var $ = cheerio.load(body)
      var a = [];
      var dom = $('#list dt:contains("正文")').eq(0).nextAll('dd:contains("章")');
      console.log(dom.length)
      for (var i=0; i<dom.length; i++) {
        var href = 'http://www.biqudao.com' + dom.eq(i).find('a').attr('href');
        console.log(href)
        a.push(href);
      }
      fs.writeFileSync('url.json', JSON.stringify(a, null, '\t'), 'utf8')
   });
}

// 向服务端发送请求
var req = http.request(url, callback);
req.end();