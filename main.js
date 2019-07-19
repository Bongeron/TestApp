phina.globalize();

var SCREEN_WIDTH = 1600;
var SCREEN_HEIGHT = 900;

phina.define('CheckBoard',{
  superClass: 'RectangleShape',
    init: function(fill,Comment,fontsize,rotate,Process){
      this.superInit();
      var self = this;
      
      //�`�F�b�N�󋵂�ێ�
      this.Process = Process;
      this.fill = fill;
      this.rotate = rotate;
      
      this.Comment = new Label({
        stroke: null,
        text:Comment,  
        fontSize:fontsize , 
        align:"center"  
     });
       //�w�i�{�b�N�X
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
       //�`�F�b�N���t�]������
       this.Process = !this.Process;
        this.setBackColor();
       //�^�b�`�A�j���[�V����
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
    //�������Ă��邩�ۂ��Ŕw�i�F�ς���
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
      
      //�`�F�b�N�󋵂�ێ�
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
      //�w�i�{�b�N�X
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
    //�����̃X�P�W���[�����擾
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

    //���t����
    ConstBorad(45,"Black",this.todaySchedule.Date+"("+
    this.todaySchedule.Week+")",100,2).addChildTo(this).setOrigin(0.5,0.5).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
      );
    
    grid_x=0.5;
    grid_y+=3;
    //�����̗\��ɂ��Ă���Ώ���
    
    if(this.todaySchedule.Club != ""){
      ConstBorad(80,"Black","����:" + this.todaySchedule.Club,60,2).setOrigin(0.5,0.5).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=3;
    }
    if(this.todaySchedule.Drum != ""){
      ConstBorad(80,"Black","�h����",60,-2).addChildTo(this).setOrigin(0.5,0.5).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=3;
    }
    if(this.todaySchedule.Juku != ""){
      ConstBorad(80,"Black","�m:" + this.todaySchedule.Juku,60,0).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=5;
    }
    if(this.todaySchedule.Etc != ""){
      ConstBorad(80,"Black","�����̂��̑��̗\��:" + this.todaySchedule.Etc,60,0).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
    }


    grid_y+=2;
    grid_x=0.5;
    //����B
    ConstBorad(0,"Black","����",60,0).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
    ).addChildTo(this);
    
    grid_x+=2;
    if(this.todaySchedule.Japanese.Kanso != "") {
      CheckBoard(30,"���z��",35,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=1.5;
    }

    if(this.todaySchedule.Japanese.Column != ""){
      CheckBoard(30,"�R����",35,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=1.5;
    }
    CheckBoard(30,"�ăg��:"+this.todaySchedule.Japanese.SummerTrain ,35,5,false).addChildTo(this).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
    );
    grid_x+=2;

    CheckBoard(30,"����(��):"+this.todaySchedule.Japanese.KanjiRead ,35,5,false).addChildTo(this).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
    );
    grid_x+=3;
    CheckBoard(30,"����(��):"+this.todaySchedule.Japanese.KanjiWrite ,35,5,false).addChildTo(this).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
    );
    grid_x+=3;
    
    grid_y+=2;
    grid_x=0.5;
    //�Љ�
    ConstBorad(0,"Black","�Љ�",60,0).addChildTo(this).setPosition(
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
     //���w
    ConstBorad(0,"Black","���w",60,0).addChildTo(this).setPosition(
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
    //����
    ConstBorad(0,"Black","����",60,0).addChildTo(this).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
    );
    grid_x+=2;
    if(this.todaySchedule.Science.Animal!=""){
      CheckBoard(30,"��������" ,35,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=2;
    }
    if(this.todaySchedule.Science.Work!=""){
      CheckBoard(30,"���[�N:"+todaySchedule.Science.Work ,35,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=2;
    }
    if(this.todaySchedule.Science.Kenkyu!=""){
      CheckBoard(30,"���R����",35,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=2;
    }

    grid_y+=2;
    grid_x=0.5;
    //���[��
    ConstBorad(0,"Black","�p��",60,0).addChildTo(this).setPosition(
      this.gridX.span(grid_x),
      this.gridY.span(grid_y)
    );
    grid_x+=2;
    if(this.todaySchedule.English.Train!=""){
      CheckBoard(30,"�g��:"+this.todaySchedule.English.Train ,35,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=2.5;
    }
    if(this.todaySchedule.English.BNote!=""){
      CheckBoard(30,"B�m�[�g:"+this.todaySchedule.English.BNote ,35,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=3;
    }
    if(this.todaySchedule.English.Work!=""){
      CheckBoard(30,"���[�N:"+this.todaySchedule.English.Work,35,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=3;
    }
    
    //���̂ق�
    grid_y+=2;
    grid_x=8;
    if(this.todaySchedule.Music!=""){
      CheckBoard(90,"���y:"+this.todaySchedule.Music ,60,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=8;
    }
    if(this.todaySchedule.Economics!=""){
      CheckBoard(90,"�ƒ��:"+this.todaySchedule.Economics ,60,5,false).addChildTo(this).setPosition(
        this.gridX.span(grid_x),
        this.gridY.span(grid_y)
      );
      grid_x+=8;
    }
  }
});

// ���C��
phina.main(function() {
  var app = GameApp({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    startLabel: 'main',
  });
  
  app.run();
});
