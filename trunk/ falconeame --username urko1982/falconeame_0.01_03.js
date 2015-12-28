//Format a date (We use it for manipulating the last publication)
//In: Thu, 18 Jun 2009 14:08:55 +0200
//Out: 20090618140855
function FormatDate(pub){
  var pubMonth = pub.substr (8,3); //Jun
  var month = new Array();
  month[0]="Jan";	month[1]="Feb"; month[2]="Mar";  month[3]="Apr";
  month[4]="May"; month[5]="Jun"; month[6]="Jul";  month[7]="Augt";
  month[8]="Sep"; month[9]="Oct"; month[10]="Nov"; month[11]="Dec";
  i=0;
  while(pubMonth.indexOf(month[i])==-1){i++;} i++;
  if(i<10) i ='0'+i;
  return pub.substr(12,4)+i+pub.substr(5,2)+pub.substr(17,2)+pub.substr(20,2)+pub.substr(23,2);
}

//Gives the current date and time in appropiate format
function Now(){
  now = new Date();
	y=now.getFullYear();
	m=now.getMonth()+1; if(m<10) m='0'+m;
	d=now.getDate(); if(d<10) d='0'+d;
	hh=now.getHours(); if(hh<10) hh='0'+hh;
	mm=now.getMinutes(); if(mm<10) mm='0'+mm;
	ss=now.getSeconds(); if(ss<10) ss='0'+ss;
	return y+m+d+hh+mm+ss;
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

  update: function(doc) {
    doc = $(doc); self = this;
    $.get(self.url,function(xml){
      var pubDate = $(xml).find('pubDate'); //Date of the last element
      if(pubDate) {
        var lastDate = pubDate.get(0).textContent;
				//Si hay réplica en el último minuto
				//Estaría bien guardar en el último momento en el que se accede
				if(parseInt(FormatDate(lastDate))+100>parseInt(Now())){
				  self.notify();
				}
      }
    });
  },
  url: "http://joneame.net/comments_rss2.php?answers_id=86"
}

//Barra
jetpack.statusBar.append({
  html: "<img src='http://joneame.net/img/favicons/favicon4.ico'>",  
  width: 45,
  onReady: function(doc){
    console.log('statusBar', this);
    var user = new JoneameNotifier(doc);
		//Llama a la funcion update cada 60 segundos
		//Recibimos si hay notificaciones desde que hemos iniciado navegador
		user.update(doc);
		setInterval( function(){ user.update(doc) }, 60*1000);
  }
});
