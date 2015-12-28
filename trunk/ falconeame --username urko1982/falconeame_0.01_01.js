//In: Thu, 18 Jun 2009 14:08:55 +0200
//Out: 20090618140855
function FormatDate(pub){
  var pubMonth = pub.substr (8,3); //Jun
  var month = new Array();
  month[0]="Jan";	
  month[1]="Feb";
  month[2]="Mar";
  month[3]="Apr";
  month[4]="May";
  month[5]="Jun";
  month[6]="Jul";
  month[7]="Augt";
  month[8]="Sep";
  month[9]="Oct";
  month[10]="Nov";
  month[11]="Dec";
  i=1;
  while(pubMonth.indexOf(month[i])==-1){i++;}
  if(i<10) i ='0'+i;
  return pub.substr(12,4)+i+pub.substr(5,2)+pub.substr(17,2)+pub.substr(20,2)+pub.substr(23,2);
}

function Now(){
  now = new Date();
  return now.getFullYear()+now.getMonth()+now.getDay()+now.getHours()+now.getMinutes()+now.getSeconds();
}


//Funcion a la que es llamada desde la barra
function JoneameNotifier(doc){
  $(doc).click(this.goToInbox);
}

JoneameNotifier.prototype = {
  goToInbox: function() {
    jetpack.tabs.open("http://joneame.net/mafioso/Juez_Falcone/conversacion");
    jetpack.tabs[ jetpack.tabs.length-1 ].focus();
  },

  notify: function() {
    jetpack.notifications.show({
      title: 'Jonéame', 
      body:'Nuevas réplicas', 
      icon:'http://joneame.net/img/favicons/favicon4.ico'
    }); 
  },

//Abre update
  update: function(doc) {
    doc = $(doc);
    $.get(this.url,function(xml){
      var pubDate = $(xml).find('pubDate'); //Date of the last element
      if(pubDate) {
        var lastDate = pubDate.get(0).textContent;
				console.log(FormatDate(lastDate));
				console.log(Now());
      }
    });
  },

  count: 0,
  url: "http://joneame.net/comments_rss2.php?answers_id=86"
}

//Barra
jetpack.statusBar.append({
  html: "<img src='http://joneame.net/img/favicons/favicon4.ico'>",  
  width: 45,
  onReady: function(doc){
    console.log('statusBar', this);
    var user = new JoneameNotifier(doc);
    user.update(doc);
  }
});
