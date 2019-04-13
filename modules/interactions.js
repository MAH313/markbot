/* The interaction module*/

module.exports.module_info = {
  name: 'interactions',
  version: '0.4',
}

module.exports.module_data = {

  blockWords: [
    'ziekenhuis',
    'morfine'
  ],

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
    else if(matches && (!actionRandNum || true)){
      if((matches[1].match(/(\w+)/g)).length <= 10 && !includesFromArray(matches[1], this.blockWords)){
        message.channel.send('Hallo '+matches[1]+', ik ben '+config.botname);
        return true;
      }
    }
  }
}

function includesFromArray(haystack, needles){
  var result = false;

  for(i in needles){
    if(haystack.lower().includes(needles[i])){
      result = true;
      break;
    }
  }

  return result;
}