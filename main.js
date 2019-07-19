phina.globalize();

var SCREEN_WIDTH = 1600;
var SCREEN_HEIGHT = 900;

phina.define('CheckBoard',{
  superClass: 'RectangleShape',
    init: function(fill,Comment,fontsize,rotate,Process){
      this.superInit();
      var self = this;
      
      //チェック状況を保持
      this.Process = Process;
      this.fill = fill;
      this.rotate = rotate;
      
      this.Comment = new Label({
        stroke: null,
        text:Comment,  
        fontSize:fontsize , 
        align:"center"  
     });
       //背景ボックス
      this.Box = new RectangleShape({
        stroke: "black",
        width : this.Comment.calcCanvasWidth()+5,
        height : this.Comment.calcCanvasHeight(),
        radius : 25
      });
     this.setInitTween(); 
     this.Box.addChildTo(this).setOrigin(0.0,0.0).setPosition(this.x,this.y);
     this.Comment.addChildTo(this).setOrigin(0.0,0.0).setPosition(this.x+2,this.y+2);
     this.width = this.Box.width;
     this.height = this.Box.height;
     this.backgroundColor = null;
     this.stroke = null;
     this.setOrigin(0.0,0.0);

     this.setBackColor();

     this.setInteractive(true);
     this.onpointstart = function() {
       //チェックを逆転させる
       this.Process = !this.Process;
        this.setBackColor();
       //タッチアニメーション
       this.tweener.clear();

       var self = this;

       this.tweener
       .by({rotation:360,},2000,"easeOutElastic")
       .call(function(){
        self.setInitTween();
      })
       .play();
     }
      // 
   },
   setInitTween: function(){
     /*
    this.tweener.clear();
    this.tweener
    .by({rotation:this.rotate},1000)
    .by({rotation:-this.rotate*2},1000)
    .by({rotation:this.rotate},1000)
    .setLoop(true)
    .play();
*/

   },
   setBackColor: function() {
    //完了しているか否かで背景色変える
    if(this.Process) {
      var fillcolor='hsl({0}, 75%, 50%)'.format(this.fill);
      var textcolor="White";
    }
    else {
      var fillcolor='hsl({0}, 25%, 50%)'.format(this.fill);
      var textcolor="Black";
    }
    this.Box.fill = fillcolor;
    this.Comment.fill = textcolor;
   },
});

phina.define('ConstBorad',{
  superClass: 'DisplayElement',
    init: function(fill,textcolor,Comment,fontsize,rotate){
      this.superInit();
      var self = this;
      
      //チェック状況を保持
      this.fill = fill;
      this.textcolor = textcolor;
      this.Comment = Comment;
      this.fontSize = fontsize;
      
      this.Comment = new Label({
        stroke: null,
        fill:this.textcolor,
        text:this.Comment,
        fontSize:this.fontSize,
        align:"center"  
      });
      //背景ボックス
      this.Box = new RectangleShape({
        stroke: "black",
        fill:'hsl({0}, 75%, 50%)'.format(this.fill),
        width : this.Comment.calcCanvasWidth()+5,
        height : this.Comment.calcCanvasHeight(),
      });

      

     this.Box.addChildTo(this).setOrigin(0.0,0.0).setPosition(this.x,this.y);
     this.Comment.addChildTo(this).setOrigin(0.0,0.0).setPosition(this.x+2,this.y+5);
     /*
      this.tweener
      .by({rotation:rotate},1000)
      .by({rotation:-rotate*2},1000)
      .by({rotation:rotate},1000)
      .setLoop(true)
      .play();
      */
   },
});

phina.define('MainScene', {
  superClass: 'DisplayScene',
    init: function() {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      });
    
    var today = new Date();
    var month = today.getMonth()+1;
    var day = today.getDate()+4;
    var searchDate = ( '00' + month ).slice( -2 )
                  +"/"+( '00' + day ).slice( -2 );
    
    this.backgroundColor = 'rgb(200, 250, 250)';
    this.todaySchedule = null;
    this.getSchedule(searchDate);
    this.showSchedule();
  },
  getSchedule:function(date) {
    //今日のスケジュールを取得
    SCHEDULE.forEach(element => {
      if(element.Date == date) {
        this.todaySchedule = element;
        return;
      }
    });
  },
  showSchedule:function() {
    var grid_x = 0;
    var grid_y = 0;

    //日付おく
    ConstBorad(45,"Black",this.todaySchedule.Date+"("+
    this.todaySchedule.Week+")",100,2).addChildTo(this).setOrigin(0.5,0.5).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
      );
    
    grid_x=0.5;
    grid_y+=3;
    //今日の予定についてあれば書く
    
    if(this.todaySchedule.Club != ""){
      ConstBorad(80,"Black","部活:" + this.todaySchedule.Club,60,2).setOrigin(0.5,0.5).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=3;
    }
    if(this.todaySchedule.Drum != ""){
      ConstBorad(80,"Black","ドラム",60,-2).addChildTo(this).setOrigin(0.5,0.5).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=3;
    }
    if(this.todaySchedule.Juku != ""){
      ConstBorad(80,"Black","塾:" + this.todaySchedule.Juku,60,0).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=5;
    }
    if(this.todaySchedule.Etc != ""){
      ConstBorad(80,"Black","今日のその他の予定:" + this.todaySchedule.Etc,60,0).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
    }


    grid_y+=2;
    grid_x=0.5;
    //国語達
    ConstBorad(0,"Black","国語",60,0).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
    ).addChildTo(this);
    
    grid_x+=2;
    if(this.todaySchedule.Japanese.Kanso != "") {
      CheckBoard(30,"感想文",35,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=1.5;
    }

    if(this.todaySchedule.Japanese.Column != ""){
      CheckBoard(30,"コラム",35,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=1.5;
    }
    CheckBoard(30,"夏トレ:"+this.todaySchedule.Japanese.SummerTrain ,35,5,false).addChildTo(this).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
    );
    grid_x+=2;

    CheckBoard(30,"漢字(読):"+this.todaySchedule.Japanese.KanjiRead ,35,5,false).addChildTo(this).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
    );
    grid_x+=3;
    CheckBoard(30,"漢字(書):"+this.todaySchedule.Japanese.KanjiWrite ,35,5,false).addChildTo(this).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
    );
    grid_x+=3;
    
    grid_y+=2;
    grid_x=0.5;
    //社会
    ConstBorad(0,"Black","社会",60,0).addChildTo(this).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
    );

    grid_x+=2;
    CheckBoard(30,this.todaySchedule.Society ,35,5,false).addChildTo(this).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
    );

    grid_y+=2;
    grid_x=0.5;
     //数学
    ConstBorad(0,"Black","数学",60,0).addChildTo(this).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
    );
    grid_x+=2;
    CheckBoard(30,this.todaySchedule.Math ,35,5,false).addChildTo(this).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
    );
    
    grid_y+=2;
    grid_x=0.5;
    //理科
    ConstBorad(0,"Black","理科",60,0).addChildTo(this).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
    );
    grid_x+=2;
    if(this.todaySchedule.Science.Animal!=""){
      CheckBoard(30,"動物調べ" ,35,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=2;
    }
    if(this.todaySchedule.Science.Work!=""){
      CheckBoard(30,"ワーク:"+todaySchedule.Science.Work ,35,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=2;
    }
    if(this.todaySchedule.Science.Kenkyu!=""){
      CheckBoard(30,"自由研究",35,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=2;
    }

    grid_y+=2;
    grid_x=0.5;
    //えーご
    ConstBorad(0,"Black","英語",60,0).addChildTo(this).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
    );
    grid_x+=2;
    if(this.todaySchedule.English.Train!=""){
      CheckBoard(30,"トレ:"+this.todaySchedule.English.Train ,35,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=2.5;
    }
    if(this.todaySchedule.English.BNote!=""){
      CheckBoard(30,"Bノート:"+this.todaySchedule.English.BNote ,35,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=3;
    }
    if(this.todaySchedule.English.Work!=""){
      CheckBoard(30,"ワーク:"+this.todaySchedule.English.Work,35,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=3;
    }
    
    //そのほか
    grid_y+=2;
    grid_x=8;
    if(this.todaySchedule.Music!=""){
      CheckBoard(90,"音楽:"+this.todaySchedule.Music ,60,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=8;
    }
    if(this.todaySchedule.Economics!=""){
      CheckBoard(90,"家庭科:"+this.todaySchedule.Economics ,60,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=8;
    }
  }
});

// メイン
phina.main(function() {
  var app = GameApp({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    startLabel: 'main',
  });
  
  app.run();
});
