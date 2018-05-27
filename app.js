var express = require("express");
var app = express();
//模板引擎
var swig = require("swig");
var http = require("http").Server(app);

const request = require('request');
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.set('views','./views');//主页面都是放在views文件夹中
app.set('view engine','html');//主页面都是html格式
app.engine('html', swig.renderFile);

//配置静态文件
app.use('/public',express.static(__dirname+'/public'));


app.get('/ajax/test',function(req,res){
    let songId = req.query.id;
    console.log(songId);
    let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?callback=MusicJsonCallback_lrc&pcachetime=1494070301711&songmid='+songId+'&g_tk=5381&jsonpCallback=MusicJsonCallback_lrc&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8¬ice=0&platform=yqq&needNewCode=0';
    let options = {
        url: url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36",
            "Accept": "*/*",
            "Referer": "https://y.qq.com/portal/player.html",
            "Accept-Language": "zh-CN,zh;q=0.8",
            "Cookie": "pgv_pvid=8455821612; ts_uid=1596880404; pgv_pvi=9708980224; yq_index=0; pgv_si=s3191448576; pgv_info=ssid=s8059271672; ts_refer=ADTAGmyqq; yq_playdata=s; ts_last=y.qq.com/portal/player.html; yqq_stat=0; yq_playschange=0; player_exist=1; qqmusic_fromtag=66; yplayer_open=1",
            "Host": "c.y.qq.com",
        }
    };
    request(options,(error, response, data)=>{
        if(!error && response.statusCode == 200){
            //res.json(data);
            res.send(data);
            //console.log(body);
        }else{
            res.json({success:false});
        }
    });

})
//显示首页
app.get('/',function (req,res,next) {
    res.render('musicAudio');
});

// http.listen(7777,'127.0.0.1');


http.listen(6666);