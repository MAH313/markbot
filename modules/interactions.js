/* The interaction module*/

module.exports.module_info = {
  name: 'interactions',
  version: '1',
}

module.exports.module_data = {

  blockWords: [
    'ziekenhuis',
    'morfine',
    'depressie',
    'bezig',
    'aan het werk',
    'moe',
    'verdrietig'
  ],

  init: function(){
    commands.push(

    )
  },

  onMessage: function(message){

    

    var actionRandNum = Math.floor(Math.random()*5);

    if(message.content == 'hallo '+config.botname.toLowerCase()){
      message.channel.send('Hallo '+message.author.username);
      return true;
    }
    
    if(message.content == 'doei '+config.botname.toLowerCase()){
      message.channel.send('doei '+message.author.username);
      return true;
    }
    
    //basic identification
    var dad_matches = message.content.match(/ik ben ([\w\s]+)/i);
    if(dad_matches && !actionRandNum){
      if((dad_matches[1].match(/(\w+)/g)).length <= 10 && !includesFromArray(dad_matches[1], this.blockWords)){
        message.channel.send('Hallo '+dad_matches[1]+', ik ben '+config.botname);
        return true;
      }
    }

    const frikandel_reacties = [
      "Waar zat je met je lul, toen je zei dat frikandellen beter zijn dan kroketten?",
      "Klootviool, ik douw een bamischijf in je reet!",

    ]

    var frikandel_matches = message.content.match(/frikandel(len)?(.*)(beter|lekkerder|dan|>)(.*)kroket(ten)?/)
    if(frikandel_matches){
      const frikandel = message.guild.emojis.cache.find(emoji => emoji.name === 'frikandel');
      message.react(frikandel)


      let message_num = Math.floor(Math.random()*frikandel_reacties.length);

      //message.channel.send(frikandel_reacties[message_num]);
      message.reply(frikandel_reacties[message_num])
      return true;
    }


  },

  onNewMember: function(member){
    helper.sendMessageOnChannel(`Welkom, ${member}, ik ben `+config.botname+`. Welkom bij de  CodingCreaturesNL! Om te weten hoe het hier werkt, lees de regels en kanaalbeschrijvingen ff door en check de aankondigingen!`, config.default_channel);
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