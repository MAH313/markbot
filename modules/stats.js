/* The stats collection module*/

module.exports.module_info = {
  name: 'stats',
  version: '1.0',
}

module.exports.module_data = {

  log: [],
  users: [],
  channels: [],


  init: function(){
    commands.push(

    )

    if(!appdata['stats_info']){
      appdata['stats_info'] = {
        'users': [],
        'channels': [],
      }
    }
  },

  onMessage: function(message){

/*    if(!appdata['stats_info']['users'][message.author.id]){
      appdata['stats_info']['users'][message.author.id] = message.author.username;
    }
    if(!appdata['stats_info']['channels'][message.channel.id]){
      appdata['stats_info']['channels'][message.channel.id] = message.channel.name;
    }
    console.log(appdata['stats_info']);*/

    data = {
      'user': message.author.id,
      'channel': message.channel.id,
      'time': message.createdTimestamp,
      'user_name': message.author.username,
      'channel_name': message.channel.name,
    }

    if(!appdata['log']){
      appdata['log'] = [];
    }

    appdata['log'].push(data);

    //helper.save();

    return true;
  }
}
