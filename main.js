/* The main controller for the bot */

const __INFO__ = {
  'Name': 'Markbot',
  'Version': '1.4.2',
  'Author': 'MAH313 (a.k.a MaHo)',
  'Github': 'https://github.com/MAH313/markbot',
  'Licence': 'MIT',
}

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

freshData = {};

commands = [];

//helper functions

helper = {
  save: function(dontlog) {
    if(!appdata){
      return;
    }
    fs.writeFile(config.storagefile+'.json', JSON.stringify(appdata), 'utf8', function(err){
      if (err) throw err;
      if(!dontlog) console.log('The file has been saved!');
    });
  },

  sendMessage: function(message){
    if(appdata['channels'] && appdata['channels']['default']){
      try{
        client.channels.get(appdata['channels']['default']).send(message);
      }
      catch(error){
        console.log('No valid default channel set ('+error+')');
      }
    }
    else{
      console.log('No default channel set');
    }
  }
}

/* pre init */

// init
client.once('ready', () => {
  var normalizedPath = path.join(__dirname, "modules");

  fs.readdirSync(normalizedPath).forEach(function(file) {
    mod = require("./modules/" + file);
    if(modules[mod.module_info.name]){
      throw new Error('Confliction module name "'+mod.module_info.name+'", please resolve this issue by renaming or removing on or more conflicting modules');
    }
    modules[mod.module_info.name] = mod.module_data;
    modules[mod.module_info.name].__VERSION__ = mod.module_info.version || '';
    console.log('loaded: '+file);
  });


  fs.readFile(config.storagefile+'.json', 'utf8', function(err, data){
    if (err){
      console.log(err);
    } else {
      try{
        data = JSON.parse(data) || {}; //now it is an object
      }
      catch(error){
        data = {};
        console.warn('error while loading json, data might be empty or corrupt. Loaded empty data.');
      }
      
      appdata = data;
    }

    commands = [
      (config.botname+' help - toon deze lijst'),
      (config.botname+' info - Geef info over '+config.botname),
    ]

    for(mod_name in modules){
      if(modules[mod_name].init){
        modules[mod_name].init();
      }

      console.log('module "'+mod_name+'" initiated')
    }

    var date = new Date();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    setTimeout(
      function(){
        everyHour();
        setInterval(everyHour, 3600000);/*3600000*/
      },
      (60*((60-min))+(60-sec))*1000
    );

    if(appdata['channels'] && appdata['channels']['default']){
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
  message.rawcontent = message.content;
  message.content = message.content.toLowerCase();


  if(message.author.bot){
    return;
  }

  if(appdata['SAU_id'] == message.author.id || (!appdata['SAU_id'] && message.author.username == config.superAdminName)){
    //person bound commands (SUPER ADMIN)

    if(!appdata['SAU_id']){
      appdata['SAU_id'] = message.author.id;
    }

    switch(message.content){
      case config.botname+' channel admin':
        if(!appdata['channels']){
          appdata['channels'] = {};
        }

        appdata['channels']['admin'] = message.channel.id;
        helper.save();
        return;
        break;
      case config.botname+' channel default':
        if(!appdata['channels']){
          appdata['channels'] = {};
        }

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

    if(command_parts[1] == 'info'){
      var output = '';
      for(i in __INFO__){
        output += i+': '+__INFO__[i]+'\n';
      }

      output += '\nLoaded modules:\n';

      for(name in modules){
        output += ' - '+name+' ('+modules[name].__VERSION__+')\n';
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

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  for(mod_name in modules){
    if(modules[mod_name].onMessage){
      var result = modules[mod_name].onNewMember(member);
    }
  }
});

function everyHour(){
  
  var date = new Date()

  for(mod_name in modules){
    if(modules[mod_name].onHour){
      var result = modules[mod_name].onHour(date);
    }
  }

  helper.save(false);

  console.log(date.toString());
}

client.on('error', function(err){
  
  try{
    client.users.get(appdata['SAU_id']).send(JSON.stringify(err));
  }
  catch(error){
    console.error(err);
    process.exit();
  }
  
  if(err.error.code != 'ECONNRESET'){
    console.error(err);
    process.exit();
  }
  else{
    console.error('ECONNRESET error')
  }

  helper.save();
  
});

fs.readFile(config_file_name, 'utf8', function(err, data){
  if (err){
    if(err.code == 'ENOENT'){
      console.log('Creating configuration file, please fill it out');

      fs.writeFile(config_file_name, JSON.stringify({botname: 'markbot',
                                                     superAdminName: '',
                                                     storagefile: 'botdata',
                                                     botkey: ''}), 'utf8', function(err){
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