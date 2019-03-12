/* The main controller for the bot */

//loading the discord module
const Discord = require('discord.js');
const client = new Discord.Client();

//loading the filesystem module
const fs = require('fs');
const path = require("path");

const config_file_name = 'config.json';

//config
config = {
  botname: 'markbot',
  superAdminName: 'MAH313',
  storagefile: 'botdata',
  botkey: 'key',
}

//stores all modules
modules = [];

//a neat way to store data, this gets written to a file
appdata = {};

commands = [
  'markbot help - toon deze lijst', 
]

//helper functions

helper = {
  save: function(dontlog) {
    fs.writeFile(config.storagefile+'.json', JSON.stringify(appdata), 'utf8', function(err){
      if (err) throw err;
      if(!dontlog) console.log('The file has been saved!');
    });
  }
}

/* pre init */

// init
client.once('ready', () => {
  var normalizedPath = path.join(__dirname, "modules");

  fs.readdirSync(normalizedPath).forEach(function(file) {
    mod = require("./modules/" + file);
    modules[mod.module_name] = mod.module_data;
    console.log('loaded: '+file);
  });


  fs.readFile(config.storagefile+'.json', 'utf8', function(err, data){
    if (err){
      console.log(err);
    } else {
      data = JSON.parse(data); //now it is an object
      appdata = data;
    }

    for(mod_name in modules){
      if(modules[mod_name].init){
        modules[mod_name].init();
      }

      console.log('module "'+mod_name+'" loaded')
    }

    if(appdata['channels']['default']){
      try{
        client.channels.get(appdata['channels']['default']).send(config.botname+' is nu online!');
      }
      catch(error){
        console.log('No valid default channel set ('+error+')');
      }
      
    }
    else{
      console.log('No default channel set');
    }

    console.log('Ready!');
  });
});

client.on('message', message => {
  message.content = message.content.toLowerCase()

  if(message.author.username == config.botname){
    return;
  }

  if(appdata['SAU_id'] == message.author.id || (!appdata['SAU_id'] && message.author.username == config.superAdminName)){
    //person bound commands (SUPER ADMIN ONLY!!)

    if(!appdata['SAU_id']){
      appdata['SAU_id'] = message.author.id;
    }

    switch(message.content){
      case config.botname+' channel admin':
        appdata['channels']['admin'] = message.channel.id;
        helper.save();
        return;
        break;
      case config.botname+' channel default':
        appdata['channels']['default'] = message.channel.id;
        helper.save();
        return;
        break;
      case config.botname+' force save':
        helper.save();
        return;
        break;

      default:
        //console.log(message.content);
        break;
    }
  }

  if(message.content.match(new RegExp('^'+config.botname))){
    var command_parts = message.content.match(/(\w+)/g);

    if(command_parts[1] == 'help'){
      var output = '';
      for(i in commands){
        output += commands[i]+'\n';
      }
      message.channel.send(output);
      return;
    }

    if(modules[command_parts[1]] && modules[command_parts[1]].onCommand){
      var result = modules[command_parts[1]].onCommand(command_parts, message);

      if(result === true){
        return;
      }
    }

    for(mod_name in modules){
      if(modules[mod_name].onCommand){
        var result = modules[mod_name].onCommand(command_parts, message);

        if(result === true){
          return;
        }
      }
    }
  }

  for(mod_name in modules){
    if(modules[mod_name].onMessage){
      var result = modules[mod_name].onMessage(message);

      if(result === true){
        return;
      }
    }
  }

});

fs.readFile(config_file_name, 'utf8', function(err, data){
  if (err){
    if(err.code == 'ENOENT'){
      console.log('Creating configuration file, please fill it out');

      fs.writeFile(config_file_name, JSON.stringify({botname: 'markbot', superAdminName: '', storagefile: 'botdata', botkey: ''}), 'utf8', function(err){
        if (err) throw err;
      });
    }
    else{
      console.error(err);
    }
  } else {
    data = JSON.parse(data); //now it is an object
    config = data;

    if(config.botkey && config.botname && config.superAdminName && config.storagefile){
      client.login(config.botkey);
    }
    else{
      console.error('invalid configuration')
    }
    
  }
});