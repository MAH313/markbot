/* The voice module*/
/* voice chat testing */
const ytdl = require('ytdl-core');

module.exports.module_info = {
  name: 'voice',
  version: '0.2',
}

module.exports.module_data = {

  init: function(){
    this.streamOptions = { seek: 0, volume: 0.2 };
    this.voiceChannel = null;

    commands.push(
      '--- Voice module ---',
      config.botname+' voice [youtube link] - speel youtube audio',
      config.botname+' stop - stop met afspelen',
    )
  },

  onCommand: async function(command_parts, message){
    try{
      if(command_parts[1] == 'voice'){

        if(this.voiceChannel){
          return;
        }

        this.voiceChannel = message.member.voice.channel;

        if(this.voiceChannel){

          var check = message.rawcontent.match(/(youtube\..+\/watch\?v=|youtu\.be\/|)([A-Za-z0-9\-\_]{9,})/)
          var videoID = check[2];

          if(!videoID){
            message.channel.send('Dat gaat niet lukken, geef mij een youtube url.');
            return;
          }

          if(videoID){
            const stream = await ytdl('https://youtu.be/'+videoID, { filter : 'audioonly' });
            stream.on('info', (info) => {
              helper.sendMessage('Now playing: '+info.title);
            });

            if(stream){
              const connection = await this.voiceChannel.join();
              const dispatcher = connection.play(stream, this.streamOptions);

              dispatcher.on("debug", debug => {console.log(debug);});
              dispatcher.on("finish", end => {console.log('stream has ended'); this.voiceChannel.leave(); this.voiceChannel = null});
              dispatcher.on('error', function(error){console.error(error); this.voiceChannel.leave(); this.voiceChannel = null});
            }
            else{
              message.channel.send('Die kan ik niet openen, check of het een geldige video is');
            }
          }
        }
        else{
          message.channel.send('Je moet eerst in een spraak kanaal zitten');
        }
      
      }
      else if(command_parts[1] == 'stop'){
        if(this.voiceChannel){
          this.voiceChannel.leave();
          this.voiceChannel = null;
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
