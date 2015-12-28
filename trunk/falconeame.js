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
        var aux = pubDate.get(0).textContent;
        console.log(aux,this);
        
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
