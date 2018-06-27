

var music = id("music");
var myMusic = id("myMusic");   // audio播放器
var cd = document.getElementsByClassName("cd")[0];  // 光碟旋转
var btn = id("play");  // 播放按钮
var con = document.getElementsByClassName("content")[0];  // 向上滚动歌词
var txt = id("txt");  // 文本输入框 装歌词
var searchicon = id("search-icon");
var curTime = id("curTime");   // 当前歌曲时间
var pro_bar = id("pro_bar");   // 进度长条
var processBar = id("processBar");  //  宽度不断增加的进度条
var processBtn = id("processBtn");  //  进度按钮
var allTime = id("allTime");  // 歌曲总时间

var search = id("search");  // 搜索歌曲
var oUl =id('ul1');  // 动态搜索的歌单列表
var songs = id("songs");  // 搜索歌曲，回车键把歌曲列表 显示出来
var title = id("title");  //  歌曲标题
var singer = id("singer");  // 歌手

var menu = id("menu");   //左上角歌单 静态歌单
var his = id("history");  //右上角历史 历史歌单
var m_list = id("m_list");  //左上角歌单 静态歌单列表
var h_list = id("h_list");  //右上角历史 历史歌单列表
var add_success = id("add_success");//歌曲收藏成功提示
var remove_success = id("remove_success");//历史歌单、歌单 歌曲删除成功提示
var songExist = id("songExist");//歌曲已存在提示

var next = id("next");	// 下一曲
var prev = id("prev");  //  上一曲
var rand = id("rand");
var rand0 = id("rand0"); //单曲循环显示
var rand1 = id("rand1");//顺序播放显示
var rand2 = id("rand2");//随机播放显示
var loading = id("loading");  //  正在加载 的自行车图片
var value = '海阔天空';   //  api请求的歌名
var mark = true;  //  播放暂停按钮
var first = 0;  // 第一次点播放迎按钮
var num = 0;//歌词上移变量
var inSearch = false;  //  true 代表按了回车键 搜索歌曲了
var id = 0;  //  根据ID 搜索歌曲
var m_mark = true;   // 左上角的歌单
var h_mark = true;  // 右上角的历史歌单



myMusic.volume = 0.1;

//点击界面空白地方  所有的歌单列表都要隐藏
music.addEventListener("click",function () {
    m_list.style.display = 'none';  // 隐藏 静态歌单
    h_list.style.display = 'none'; // 隐藏 历史歌单
    m_mark = true; //静态歌单是否隐藏
    h_mark = true;//历史歌单是否隐藏
    songs.style.display = "none"; //搜索的歌单隐藏
    // search.value = "";
},false);


//console.log(document.styleSheets[0].cssRules[21].cssRules[0].cssText);
//播放按钮点击事件
btn.addEventListener("click",function () {
    //如果是处于暂停状态
    if( mark ){
        first ++;
        if( first === 1 ){  // 第一次点击  播放音乐
            playMusic();   //  播放音乐
        }else{
            myMusic.play();  // 播放音乐
            cd.className = 'cd rotate';  //  旋转
            this.style.backgroundImage = 'url(public/images/play.png)';  // 显示播放图片
        }

    }else{
        myMusic.pause();  // 暂停
        var rot = myMusic.currentTime % 5 *72;
        //console.log(myMusic.currentTime,rot);
        cd.className = "cd";//  停止旋转

        this.style.backgroundImage = 'url(public/images/pause.png)'; // 显示暂停图片
    }
    mark = !mark;
},false);

function playMusic() {
    first ++; // 每次调用 first ++
    con.style.top = 0;
    num = 0;
    createScript(value);
    //loading.style.display = "block";
}

// 播放模式切换
var rands = 1;   // 默认随机播放
rand.onclick = function () {
    rands++;
    rands%=3;
    this.style.backgroundImage = 'url(public/images/rand'+rands+'.png)';

    //每次点击修改对于的显示
    if(rands === 0){
        rand1.style.opacity = 0;
        rand2.style.opacity = 0;
        rand0.style.opacity = 1;
    }else if(rands === 1){
        rand0.style.opacity = 0;
        rand2.style.opacity = 0;
        rand1.style.opacity = 1;
    }else{
        rand0.style.opacity = 0;
        rand1.style.opacity = 0;
        rand2.style.opacity = 1;
    }
    setTimeout(function () {
        rand0.style.opacity = 0;
        rand1.style.opacity = 0;
        rand2.style.opacity = 0;
    },800);
};

//播放模式
loop();
function loop() {
    myMusic.addEventListener('ended',function () {//音频/视频 播放完成之后触发
        switch (rands){

            case 0: // 单曲循环播放
                playMusic();
                break;
            case 1: // 全部歌曲循环播放
                nth++;
                var aSpan = document.getElementsByClassName('songname');
                nth%=aSpan.length;
                value = aSpan[nth].innerHTML;
                playMusic();
                break;
            case 2: // 随机播放
                var aSpan = document.getElementsByClassName('songname');
                nth = Math.floor(Math.random()*aSpan.length);
                value = aSpan[nth].innerHTML;
                playMusic();
                break;
        }
    });

    //移入播放模式时显示该播放模式
    rand.addEventListener("mouseenter",function () {
        if(rands === 0){
            rand0.style.opacity = 1;
        }else if(rands === 1){
            rand1.style.opacity = 1;
        }else{
            rand2.style.opacity = 1;
        }
    },false);

    rand.addEventListener("mouseleave",function () {
        if(rands === 0){
            rand0.style.opacity = 0;
        }else if(rands === 1){
            rand1.style.opacity = 0;
        }else{
            rand2.style.opacity = 0;
        }
    },false);

}

//键盘事件  回车键按下搜索歌曲
document.onkeydown = function (e) {
    e = e || window.event;
    if(e.keyCode === 13){
        if(search.value){
            value = search.value;
            inSearch = true;
            playMusic();
        }

    }
}

//点击搜索图标搜索歌曲
searchicon.onclick = function () {
    if(search.value){
        value = search.value;
        inSearch = true;
        playMusic();
    }
}
//  搜索框获取焦点 时
search.onfocus = function () {
    m_list.style.display = 'none';  // 隐藏 静态歌单
    h_list.style.display = 'none'; // 隐藏 历史歌单
    m_mark = true; //静态歌单是否隐藏
    h_mark = true;//历史歌单是否隐藏
}

var nth = 0; //此时播放的第nth+1首歌
//点击下一首
next.addEventListener("click",function () {
    switch (rands){
        case 0: // 单曲循环播放
        case 1: // 全部歌曲循环播放
            nth++;
            var aSpan = document.getElementsByClassName('songname');
            nth%=aSpan.length;
            //console.log(nth,aSpan.length);
            value = aSpan[nth].innerHTML;
            playMusic();
            break;
        case 2: // 随机播放
            var aSpan = document.getElementsByClassName('songname');
            var nth_new = Math.floor(Math.random()*aSpan.length);
            while(nth_new == nth){//随机播放下一首不能是当前播放的歌曲
                nth_new = Math.floor(Math.random()*aSpan.length);
            }
            nth = nth_new;
            value = aSpan[nth].innerHTML;
            playMusic();
            break;
    }
},false);

//点击上一首
prev.addEventListener("click",function () {
    switch (rands) {
        case 0: // 单曲循环播放
        case 1: // 全部歌曲循环播放
            nth--;
            var aSpan = document.getElementsByClassName("songname");
            if (nth < 0) nth = aSpan.length - 1;
            value = aSpan[nth].innerHTML;
            playMusic();
            break;
        case 2: // 随机播放
            var aSpan = document.getElementsByClassName('songname');
            var nth_new = Math.floor(Math.random()*aSpan.length);
            while(nth_new == nth){//随机播放下一首不能是当前播放的歌曲
                nth_new = Math.floor(Math.random()*aSpan.length);
            }
            nth = nth_new;
            value = aSpan[nth].innerHTML;
            playMusic();
            break;
    }
},false);

//点击歌单
menu.addEventListener('click',function (e) {
    e.stopPropagation();
    //如果歌单隐藏
  if(m_mark){
      h_list.style.display = "none"; //历史歌单隐藏
      h_mark = true; //历史歌单是否隐藏为ture
      songs.style.display = "none"; //搜索的歌单隐藏
      m_list.style.display = "block";//显示歌单
      // search.value = ""; //搜索框中内容清空

      var aP = m_list.getElementsByTagName("p");
      var aSpan1 = document.getElementsByClassName('songname');  // 歌名
      var aSpan2 = document.getElementsByClassName('remove1');  // 删除
      //console.log(aP.length,aSpan1.length,aSpan2.length);

      for(var i=0; i<aP.length; i++){
          //点击歌名
          aSpan2[i].index = i;
          aSpan1[i].index1 = i;
          aSpan1[i].onclick = function (e) {
              e.stopPropagation();
              m_list.style.display = "none";
              value = this.innerHTML;
              playMusic();
              m_mark = true;
              search.value = ""
              for(var j=0; j<aP.length; j++){
                  aSpan1[j].index1 = j;
              }
              // console.log(this.index1);
              nth = this.index1;  //播放第几首索引值得改变

              aP = m_list.getElementsByTagName("p");
          }

          //点击删除

          aSpan2[i].onclick = function (e) {
              e.stopPropagation();
              if(this.index <= nth && nth>0)--nth;
              console.log(this.index,nth);
              this.parentNode.parentNode.removeChild(aP[this.index]); //删除该歌曲

              //删除成功显示
              remove_success.style.opacity = 1;
              setTimeout(function () {
                  remove_success.style.opacity = 0;
              },2000);

              aP = m_list.getElementsByTagName("p");
              //console.log(aP.length);
              for(var j=0; j<aP.length; j++){
                  aSpan2[j].index = j;
              }
              if( aSpan2.length ===0 ){
                  m_list.style.display = 'none';
                  m_mark = true;
              }
          }

      }
  }else{
      m_list.style.display = "none";
  }
  m_mark = !m_mark;
},false);

//历史歌单添加歌曲
function addHistory(value){
    var exist = 0;
    var oP = document.createElement("p");
    //判断要添加到历史歌单的歌曲是否已存在
    var h_songname = h_list.getElementsByClassName("h_songname");
    for(var i=0; i<h_songname.length; i++){
        //console.log(text,m_songname[i].innerHTML);
        if(value === h_songname[i].innerHTML){
            exist = 1;
            break;
        }else{
            exist = 0;
        }
    }
    //如果不存在才添加
    if(!exist){
        oP.innerHTML = "<span class='h_songname'>"+value+"</span><span class='addsong'>收藏</span><span class='remove2'>删除</span>";
        h_list.appendChild(oP);
    }



}

//点击历史歌单
his.addEventListener("click",function (e) {
    e.stopPropagation();
    var aP = h_list.getElementsByTagName("p");
    //如果历史歌单处理隐藏状态
    if(aP.length){
        if(h_mark){
            m_list.style.display = "none";
            m_mark = true;
            songs.style.display = "none"; //搜索的歌单隐藏
            h_list.style.display = "block";//显示历史歌单
            // search.value = ""; //搜索框中内容清空


            var aSpan0 = document.getElementsByClassName('h_songname');  // 歌名
            var aSpan1 = document.getElementsByClassName('addsong');  // 添加
            var aSpan2 = document.getElementsByClassName('remove2');  // 删除
            //console.log(aSpan0.length,aSpan1.length,aSpan2.length);

            for(var i=0; i<aP.length; i++){

                aSpan2[i].index = i;
                //点击歌名
                aSpan0[i].index = i;
                aSpan0[i].addEventListener("click",function () {
                    h_list.style.display = "none";
                    value = this.innerHTML;
                    playMusic();
                    h_mark = true;
                    nth = this.index;
                    search.value = ""
                    for(var j=0; j<aP.length; j++){
                        aSpan0[j].index = j;
                    }
                },false);

                //点击收藏
                aSpan1[i].onclick = function (e) {

                    var exist = 0;
                    e.stopPropagation();
                    var oP = document.createElement('p');
                    var text = this.parentNode.firstChild.innerHTML;

                    //判断要收藏的歌曲是否已存在
                    var m_songname = m_list.getElementsByClassName("songname");
                    for(var i=0; i<m_songname.length; i++){
                        //console.log(text,m_songname[i].innerHTML);
                        if(text === m_songname[i].innerHTML){
                            exist = 1;
                            break;
                        }else{
                            exist = 0;
                        }
                    }

                    if(exist){
                        songExist.style.opacity = 1;
                        setTimeout(function () {
                            songExist.style.opacity = 0;
                        }, 2000);
                    }else{
                        oP.innerHTML = '<span class="songname">'+text+'</span><span class="remove1">删除</span>';
                        m_list.appendChild(oP);
                        add_success.style.opacity = 1;
                        setTimeout(function () {
                            add_success.style.opacity = 0;
                        },2000);
                    }
                }
               /*function h_list_click(e) {
                   e = e || window.event;
                   e.preventDefault();
                   console.log("tj");
                   //console.log(this.index.js);
                   var oP = document.createElement('p');
                   var text = this.parentNode.firstChild.innerHTML;
                   oP.innerHTML = '<span class="songname">'+text+'</span><span class="remove1">删除</span>';
                   m_list.appendChild(oP);
               }
                aSpan1[i].removeEventListener("click",h_list_click,false);
                aSpan1[i].addEventListener("click",h_list_click,false);*/

                //点击删除

                aSpan2[i].addEventListener("click",function (e) {
                    e.stopPropagation();
                    //console.log(this.index.js);

                    this.parentNode.parentNode.removeChild(aP[this.index]); //删除该歌曲
                    remove_success.style.opacity = 1;
                    setTimeout(function () {
                        console.log(111);
                        remove_success.style.opacity = 0;
                    },2000);
                    //console.log(aP.length);
                    for(var j=0; j<aP.length; j++){
                        aSpan2[j].index = j;
                    }
                    if( aSpan2.length ===0 ){
                        h_list.style.display = 'none';
                        h_mark = true;
                    }
                },false);
            }
        }else{
            h_list.style.display = "none";
        }
    }
    h_mark = !h_mark;
},false);

//jspnp动态请求歌曲
function getmusic(data) {
    var mp = data.data.song.list;

    if(inSearch){ //  true 代表回车键 搜索歌曲 就去动态请求api 及一些渲染歌单信息
        if(mp.length){
            // loading.style.display = "none";
            songs.style.display = "block";
            var html = "";

            var songLen = Math.min(mp.length,15);

            //多个歌手时
            for(var i=0; i<songLen; i++){
                var singerSpan = mp[i].singer[0].name; //歌手
                for(var k=1;k<mp[i].singer.length;k++){
                    singerSpan += '/'+mp[i].singer[k].name;
                }
                html += "<p><span>"+mp[i].songname+"</span><span>"+singerSpan+"</span></p>";
            }
            oUl.innerHTML = html;

            var aP = oUl.getElementsByTagName("p");

            for(var i=0; i<aP.length; i++){
                 !function (i){
                    aP[i].addEventListener('click',function () {
                        //console.log(i);
                        title.innerHTML = mp[i].songname;  //标题
                        singer.innerHTML = mp[i].singer[0].name; //歌手
                        for(var k=1;k<mp[i].singer.length;k++){
                            singer.innerHTML += '/'+mp[i].singer[k].name;
                        }
                        //歌曲路径
                        var songmid = mp[i].songmid;
                        myMusic.src = 'http://ws.stream.qqmusic.qq.com/C100'+songmid+'.m4a?fromtag=0&guid=126548448';//audio的路径

                        //图片
                        var albummid = mp[i].albummid;
                        var url = 'https://y.gtimg.cn/music/photo_new/T002R150x150M000'+albummid+'.jpg?max_age=2592000';
                        cd.style.background = 'url('+url+') no-repeat center/100%';

                        // myMusic.src = 'http://dl.stream.qqmusic.qq.com/C400001yS0N33yPm1B.m4a?vkey=02003751747C832E0E69F10B40BC803F0F4B89198106F58389B8FB7A20C304C6BAFBB4DA24F91DF34ED4AAD2F83192171537BAB66C1FC767&guid=2952913411&uin=310870966&fromtag=66';

                        search.value = ''; //搜索框清空
                        //loading.style.display = 'block';//加载显示

                        inSearch = false;
                        songs.style.display = 'none';  //隐藏请求成功的歌单列表
                        addHistory(mp[i].songname);//点击的歌曲添加到右上角历史歌曲

                        id = mp[i].songmid;
                        createLrc(id); // 请求歌词
                        load();
                    },false);
                }(i);
            }
        }else{
            oUl.innerHTML = "";
        }
    }else{
        title.innerHTML = mp[0].songname;  //标题
        singer.innerHTML = mp[0].singer[0].name;//歌手
        //myMusic.src = mp[0].m4a;//audio的路径
        //歌曲路径
        var songmid = mp[0].songmid;
        myMusic.src = 'http://ws.stream.qqmusic.qq.com/C100'+songmid+'.m4a?fromtag=0&guid=126548448';
        //loading.style.display = 'block';//加载显示

        //图片
        var albummid = mp[0].albummid;
        var url = 'https://y.gtimg.cn/music/photo_new/T002R150x150M000'+albummid+'.jpg?max_age=2592000';
        cd.style.background = 'url('+url+') no-repeat center/100%';
        addHistory(mp[0].songname);//点击的歌曲添加到右上角历史歌曲

        id = mp[0].songmid;
        createLrc(id); // 请求歌词
        load();
    }
}


//  获取当前时间  小圆点伴随歌曲播放移动
function nowTime() {
    //console.log( myMusic.currentTime );
    //console.log( time( myMusic.currentTime ),time( myMusic.duration ) );
    curTime.innerHTML = time( myMusic.currentTime ); // 当前播放时间
    allTime.innerHTML = time( myMusic.duration ); // 歌曲总时间
    var scale = myMusic.currentTime / myMusic.duration;
   // console.log(processBtn.offsetWidth);
    processBar.style.width = scale*(pro_bar.offsetWidth - processBtn.offsetWidth)*0.01 + 'rem';

}

//jsonp动态请求歌词
function getLrc(data){

    //console.log(data.showapi_res_body.lyric);
   //console.log(data);
    var lrc = data.showapi_res_body.lyric;
    txt.innerHTML = lrc;
    var lrc1 = txt.value;
    var lrcArr = lrc1.split('[');
    var html = '';
    for( var i=0;i<lrcArr.length;i++ ){
        var arr = lrcArr[i].split(']');
        var time = arr[0].split('.');
        var text = arr[1];
        var timer = time[0].split(':');
        var ms = timer[0]*60 + timer[1]*1;
        if( text&&text.length!=1&&ms ){
            html += '<p id="'+ms+'">'+text+'</p>';
        }
        con.innerHTML = html;
    }

    // 歌词同步
    var aP = con.getElementsByTagName('p');
    myMusic.addEventListener('timeupdate',function () {
        var curTime = parseInt(this.currentTime);
        nowTime();
        if( document.getElementById( curTime ) ){
            for( var i=0;i<aP.length;i++ ){
                aP[i].style.cssText = 'fonts-size:.32rem;color:rgba(255,255,255,.65)';
            }
            document.getElementById(curTime).style.cssText = 'color:rgba(255,255,255,1);fonts-size:.38rem';
            if( aP[5+num]&&aP[5+num].id == curTime ){
                con.style.top = -0.5*num + 'rem';
                num++;
            }
        }
    });

}
//  播放时，旋转 播放按钮
function load() {  // 当浏览器能够开始播放指定的音频/视频时, 该视频已准备好开始播放，发生canplay事件
    alert(111);
    myMusic.oncanplay = function () {
        alert(222);
        setTimeout(function () {
            alert(333);
            myMusic.play();
            mark = false;  //暂停状态为false即正在播放音乐
            cd.className = 'cd rotate';
            //loading.style.display = 'none';
        },100);
        alert(444);
        btn.style.backgroundImage = 'url(public/images/play.png)';
    }
}



//音乐api
function createScript(value) {
    var oScript = document.createElement("script");
    /*oScript.src = 'http://route.showapi.com/213-1?showapi_appid=62379&showapi_sign=02c4631165c94ae197bd9de6c77244ce' +
        '&keyword='+value+'&maxResult=10&jsonpcallback=getmusic';*/
    //oScript.src = 'http://route.showapi.com/213-1?showapi_appid=29331&showapi_sign=972fbdaf3d3d4213837c55284dde05d8 &keyword='+value+'&maxResult=10&jsonpcallback=getmusic';
    oScript.src = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp?g_tk=5381&uin=0&format=jsonp&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&w='+value+'&zhidaqu=1&catZhida=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&perpage=20&n=20&p=1&remoteplace=txt.mqq.all&_=1520833663464&guid=126548448&jsonpCallback=getmusic'
    document.body.appendChild(oScript);
}
//歌词
function createLrc(id) {
    // console.log(id);
    var oScript = document.createElement("script");
    //oScript.src = 'http://route.showapi.com/213-2?showapi_appid=62379&showapi_sign=b8a34df2796c4f68a5be6641c86fd4dc&showapi_timestamp='+formatterDateTime()+'&musicid='+id;
    oScript.src = 'https://route.showapi.com/213-2?showapi_appid=29331&showapi_sign=972fbdaf3d3d4213837c55284dde05d8 &musicid='+id+'&jsonpcallback=getLrc';
    //oScript.src = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?callback=getLrc&pcachetime=1494070301711&songmid='+id+'&g_tk=5381&jsonpCallback=getLrc&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8¬ice=0&platform=yqq&needNewCode=0'
    document.body.appendChild(oScript);
   /* ajax({
        url : "/ajax/test",
        data : {
            id : id,
        },
        type:'get',
        success : function (data) {
            console.log(data);
            //console.log(data);
        }
    });*/

}
/*function ajax( json ) {

    //处理参数
    var type = json.type || "GET";
    var url = json.url;
    var data = json.data || "";
    var success = json.success;
    var error = json.error;
    var dataType = json.dataType || "json";

    //处理data，同时处理url
    if ( data ){
        var str = "";
        for (var key in data) {
            str += key + "=" + data[key] + "&";
        }
        str += "_="+new Date().getTime();
        data = str;
        if ( /get/i.test(type) ){
            url += "?"+data;
            data = "";
        }
    }

    //请求部分
    var xhr = new XMLHttpRequest();
    xhr.open( type , url , true );

    //send之前设置请求头，post方式下必须的
    xhr.setRequestHeader('content-Type','application/x-www-form-urlencoded');

    xhr.send( data );
    xhr.onreadystatechange = function (ev) {
        if ( this.readyState === 4 ){
            var status = this.status;
            if ( status >= 200 && status < 300 ){
                var rep = this.responseText;
                // if ( dataType === "json" )rep = JSON.parse(rep);
                success && success( rep );
            }else{
                error && error( status );
            }
        }
    };
}*/
//jsonp时间戳
function formatterDateTime() {
    var date=new Date()
    var month=date.getMonth() + 1
    var datetime = date.getFullYear()
        + ""// "年"
        + (month >= 10 ? month : "0"+ month)
        + ""// "月"
        + (date.getDate() < 10 ? "0" + date.getDate() : date
            .getDate())
        + ""
        + (date.getHours() < 10 ? "0" + date.getHours() : date
            .getHours())
        + ""
        + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
            .getMinutes())
        + ""
        + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
            .getSeconds());
    return datetime;
}
// 获取 分 秒
function time(cTime){
    cTime = parseInt(cTime);  // 3700
    var h = zero(Math.floor(cTime%3600));  //获取 小时所剩的秒数
    var m = zero(Math.floor(cTime%3600/60)); // 获取分
    var s = zero(Math.floor(cTime%60));  // 获取秒
    return m+":"+s;
}
function zero(num){
    if (num < 10)
    {
        return "0"+num;
    }else{
        return ''+num;
    }
}

//获取DOM节点封装
function id(str) {
    return document.getElementById(str);
}
