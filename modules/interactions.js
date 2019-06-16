/* The interaction module*/

module.exports.module_info = {
  name: 'interactions',
  version: '0.5',
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
  },

  onNewMember: function(member){
    channel.send(`Welkom, ${member}, ik ben `+config.botname+`.`);
  }
}

function includesFromArray(haystack, needles){
  if(!haystack || !needles || typeof haystack != 'string'){
    return false;
  }

  try{
    var result = false;

    for(i in needles){
      if(haystack.lower().includes(needles[i])){
        result = true;
        break;
      }
    }
  }
  catch(error){
    return false
  }

  return result;
}