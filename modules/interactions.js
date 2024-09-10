/* The interaction module*/

module.exports.module_info = {
  name: 'interactions',
  version: '1',
}

module.exports.module_data = {

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
      "P. 92.28.211.234 N: 43.7462 W: 12.4893 SS Number: 6979191519182016 IPv6: fe80::5dcd::ef69::fb22::d9888%12 UPNP: Enabled DMZ: 10.112.42.15 MAC: 5A:78:3E:7E:00 ISP: Ucom Universal DNS: 8.8.8.8 ALT DNS: 1.1.1.8.1 DNS SUFFIX: Dlink WAN: 100.23.10.15 GATEWAY: 192.168.0.1 SUBNET MASK: 255.255.0.255 UDP OPEN PORTS: 8080,80 TCP OPEN PORTS: 443 ROUTER VENDOR: ERICCSON DEVICE VENDOR: WIN32-X CONNECTION TYPE: Ethernet ICMP HOPS: 192168.0.1 192168.1.1 100.73.43.4 host-132.12.32.167.ucom.com host-66.120.12.111.ucom.com 36.134.67.189 216.239.78.111 sof02s32-in-f14.1e100.net TOTAL HOPS: 8 ACTIVE SERVICES: [HTTP] 192.168.3.1:80=>92.28.211.234:80 [HTTP] 192.168.3.1:443=>92.28.211.234:443 [UDP] 192.168.0.1:788=>192.168.1:6557 [TCP] 192.168.1.1:67891=>92.28.211.234:345 [TCP] 192.168.52.43:7777=>192.168.1.1:7778 [TCP] 192.168.78.12:898=>192.168.89.9:667 EXTERNAL MAC: 6U:78:89:ER:O4 MODEM JUMPS: 64",
      "Krijg nou een bakkie pleur! Je weet toch dat kroketten beter zijn dan frikandellen."
    ]

    var frikandel_matches = message.content.match(/(frikandel(len)?(.*)(beter|lekkerder|>|liever|boven|meer|laten)(.*)kroket(ten)?|kroket(ten)?(.*)(minder|viezer|<|onder|achter)(.*)frikandel(len)?)/i)
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
    helper.sendMessageOnChannel(`Welkom, ${member}, ik ben ${config.botname}. Welkom bij de CodingCreaturesNL! Om te weten hoe het hier werkt, lees de regels en kanaalbeschrijvingen ff door en check de aankondigingen!`, config.default_channel);
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