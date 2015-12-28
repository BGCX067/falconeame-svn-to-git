/*
@
@           Name: Falcóneame Azul
@           Version: Alfa (00_00_04)
@           Author: Urko Joseba de Lucas Beaumont
@           E-mail: urko1982@gmail.com
@           License: GPU v 3.0
@
@           If you find a bug, modify the program, make a question or give your
@           opinion, please send me an email. Thank you, Urko
@
@                                    
*/



////////////////////AUXILIAR FUNCTIONS///////////////////

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


//Check if we need to adjust local time. As well, fix bug if comment was made at 23:59 (no important)
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


//Check if URL was sent - No implemented yet
function checkURL(){
  console.log('checkURL');
 /* jetpack.tabs.onFocus(function() {
    jetpack.notifications.show('http://joneame.net/api/url.php?url='+this.url);
  });*/
}

////////////////////MAIN FUNCTIONS///////////////////


//Funcion a la que es llamada desde la barra
function JoneameNotifier(doc){
  $(doc).click(this.goToInbox);
}

//Modify according with user (in this case, Juez_Falcone. We need storage data.
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
				//If it exists a reply in the last minute (doesn't works at 23:59)
				//We must implement when was the last access, so we must storage info.
				if(parseInt(FormatDate(lastDate))+100>parseInt(Now())){
				  self.notify();
				}
      }
    });
  },
	//URL of the feed
  url: "http://joneame.net/comments_rss2.php?answers_id=86"
}

//Slidebar 1 - Notifies if there is any reply 
jetpack.future.import("slideBar");
jetpack.slideBar.append({
  icon: 'http://joneame.net/img/favicons/favicon4.ico',
	html: 'Notificaciones',

  onSelect: function(slide) slide({ 
	  size: 100, 
    persist: true }),
		
  onReady: function(doc){
    var user = new JoneameNotifier(doc);
		//We receive if there are notifications since user initiate navigator
		user.update(doc);
		//Call to update every 60 seconds
		setInterval( function(){ user.update(doc) }, 60*1000);
  }
});

//Slidebar 2 - Check URL
jetpack.slideBar.append({
  icon: 'http://joneame.net/img/favicons/favicon-sneaker.ico',
	url: 'Mandar noticia',

  onSelect: function(slide) slide({
    checkURL();
//	  console.log(this);
	  size: 100, 
    persist: true }),
		
  onReady: function(doc){
	 // checkURL();
  }
});