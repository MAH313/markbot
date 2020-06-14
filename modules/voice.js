/* The voice module*/
/* voice chat testing */
const ytdl = require('ytdl-core');

module.exports.module_info = {
  name: 'voice',
  version: '0.1',
}

module.exports.module_data = {

  init: function(){
    this.streamOptions = { seek: 0, volume: 0.5 };
  },

  onCommand: async function(command_parts, message){
    try{
    if(command_parts[1] == 'voice'){

      var voiceChannel = message.member.voice.channel;

      const connection = await voiceChannel.join();

      //voiceChannel.join()
      var check = message.rawcontent.match(/(youtube\..+\/watch\?v=|youtu\.be\/|)([A-Za-z0-9\-\_]{9,})/)
      var videoID = check[2];
      if(videoID){
        //const dispatcher = connection.playFile('/home/mark/private/discord_bot_live/audio/black_sabbath-war_pigs.mp3');
        const stream = ytdl('https://youtu.be/'+videoID, { filter : 'audioonly' });
        const dispatcher = connection.play(stream, this.streamOptions);
      
        dispatcher.on("debug", debug => {console.log(debug);});
        dispatcher.on("finish", end => {console.log('stream has ended'); voiceChannel.leave();});
        dispatcher.on('error', function(error){console.error(error); voiceChannel.leave();});
      }
      else{
        message.channel.send('Dat gaat niet lukken, geef mij een youtube url.');
      }
    
    }
    }
    catch(error){
      console.error(error);
    }
  },

  onMessage: function(message){
    
  },
}
