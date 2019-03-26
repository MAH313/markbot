/* The interaction module*/

module.exports.module_info = {
  name: 'interactions',
  version: '0.3',
}

module.exports.module_data = {

  init: function(){
    commands.push(

    )
  },

  onMessage: function(message){

    //basic identification
    var matches = message.content.match(/ik ben ([\w\s]+)/i);

    var actionRandNum = Math.floor(Math.random()*5);

    if(message.content == 'hallo '+config.botname){
      message.channel.send('Hallo '+message.author.username);
      return true;
    }
    else if(message.content == 'doei '+config.botname){
      message.channel.send('doei '+message.author.username);
      return true;
    }
    else if(matches && !actionRandNum){
      message.channel.send('Hallo '+matches[1]+', ik ben '+config.botname);
      return true;
    }
  }
}
