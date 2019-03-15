/* The game list module*/

module.exports.module_name = 'gamelist';

module.exports.module_data = {

  active_games: {},

  init: function(){
    commands.push(
      '--- Game list module ---'
      'markbot open [game] - open een game',
      'markbot join [game] - join een open game',
      'markbot leave [game] - verlaat een open game',
      'markbot start [game] - start een open game',
      'markbot cancel [game] - cancel een open game',
      'markbot status [game] - geef info over een open game',
      'markbot gamelist - toon alle bekende spellen'
    )
  },

  onCommand: function(command_parts, message){

    switch(command_parts[1]){
      case 'gamelist':
        var output = '';
        for(i in appdata['games']){
          output += appdata['games'][i]['name']+', min. players: '+
                    (appdata['games'][i]['min'] || 'geen minimum')+', max. players: '+
                    (appdata['games'][i]['max'] || 'geen maximum')+'\n'
        }

        if(output){
          message.channel.send(output);
        }
        else{
          message.channel.send('Ik heb geen games gevonden');
        }
        
        return true;
        break;

      case 'open':
        if(appdata['games'][command_parts[2]]){
          if(!this.active_games[command_parts[2]]){
            this.active_games[command_parts[2]] = {
              'users':[message.author.id],
            }

            var needed = appdata['games'][command_parts[2]]['min'] ? appdata['games'][command_parts[2]]['min']-1 : false;
            var left = appdata['games'][command_parts[2]]['max'] ? appdata['games'][command_parts[2]]['max']-1 : false;

            var output = 'Wie doen er mee met '+appdata['games'][command_parts[2]]['name']+'?'+
                          (needed ? ' nog '+needed+' mensen nodig.' : '')+
                          (left ? ' nog '+left+' plekken over.' : '')+
                          ' Join met "'+config.botname+' join '+command_parts[2]+'"';

            message.channel.send(output);
          }
          else{
            message.channel.send('Sorry, '+appdata['games'][command_parts[2]]['name']+' is al open');
          }
        }
        else{
          message.channel.send('Sorry, ik ken "'+command_parts[2]+'" niet');
        }

        return true;
        break;

      case 'join':
        if(appdata['games'][command_parts[2]]){
          if(this.active_games[command_parts[2]]['users'].indexOf(message.author.id) == -1){
            if(appdata['games'][command_parts[2]]['max'] - this.active_games[command_parts[2]]['users'].length >= 1){
              this.active_games[command_parts[2]]['users'].push(message.author.id);

              var ammount = this.active_games[command_parts[2]]['users'].length;
              var needed = appdata['games'][command_parts[2]]['min']-ammount;
              var left = appdata['games'][command_parts[2]]['max']-ammount;

              var full = appdata['games'][command_parts[2]]['max'] ? left < 1 ? true : false : false

              message.channel.send('<@'+message.author.id+'> doet mee met '+
                                    appdata['games'][command_parts[2]]['name']+
                                    (full ? ', '+appdata['games'][command_parts[2]]['name']+' is nu vol' : 
                                            (needed ? ', nog '+needed+' mensen nodig' : '')+
                                            (left ? ', nog '+left+' plekken over' : '')));
            }
            else{
              message.channel.send('<@'+message.author.id+'> sorry maar '+appdata['games'][command_parts[2]]['name']+' is al vol');
            }
          }
          else{
            message.channel.send('<@'+message.author.id+'> je doet al mee met '+appdata['games'][command_parts[2]]['name']);
          }
        }
        return true;
        break;
      
      case 'leave':
        if(appdata['games'][command_parts[2]]){
          var arr_index = this.active_games[command_parts[2]]['users'].indexOf(message.author.id)
          if( arr_index != -1){
            this.active_games[command_parts[2]]['users'].splice(arr_index);

            var ammount = this.active_games[command_parts[2]]['users'].length;
            var needed = appdata['games'][command_parts[2]]['min']-ammount;
            var left = appdata['games'][command_parts[2]]['max']-ammount;

            var full = appdata['games'][command_parts[2]]['max'] ? left < 1 ? true : false : false

            message.channel.send('<@'+message.author.id+'> doet niet meer mee met '+
                                  appdata['games'][command_parts[2]]['name']+
                                  (full ? ', '+appdata['games'][command_parts[2]]['name']+' is nu vol' : 
                                          (needed ? ', nog '+needed+' mensen nodig' : '')+
                                          (left ? ', nog '+left+' plekken over' : '')));
          }
          else{
            message.channel.send('<@'+message.author.id+'> je deed niet mee met '+appdata['games'][command_parts[2]]['name']);
          }
        }
        return true;
        break;

      case 'start':
        if(appdata['games'][command_parts[2]]){
          if(this.active_games[command_parts[2]]){

            var ammount = this.active_games[command_parts[2]]['users'].length;

            if(appdata['games'][command_parts[2]]['min'] && appdata['games'][command_parts[2]]['min']-ammount && command_parts[3] != 'force'){
              message.channel.send('<@'+message.author.id+'> Er doen maar '+ammount+' spelers mee aan '+appdata['games'][command_parts[2]]['name']+
                                   ', je hebt '+appdata['games'][command_parts[2]]['min']+' nodig');
              return;
            }

            var output = '';

            for(var i in this.active_games[command_parts[2]]['users']){
              output += '<@'+this.active_games[command_parts[2]]['users'][i]+'>';
            }

            message.channel.send(output+' '+appdata['games'][command_parts[2]]['name']+' gaat nu beginnen, start snel op!');

            delete this.active_games[command_parts[2]];
          }
          else{
            message.channel.send('<@'+message.author.id+'> je moet '+appdata['games'][command_parts[2]]['name']+' eerst openen met "'+
                                 config.botname+' open '+appdata['games'][command_parts[2]]['name']+'"');
          }
        }
        else{
          message.channel.send('Sorry, ik ken "'+command_parts[2]+'" niet');
        }
        return true;
        break;

      case 'cancel':
        if(appdata['games'][command_parts[2]]){
          if(this.active_games[command_parts[2]]){
          
            var output = '';

            for(var i in this.active_games[command_parts[2]]['users']){
              output += '<@'+message.author.id+'>';
            }

            message.channel.send('<@'+message.author.id+'> ' + appdata['games'][command_parts[2]]['name']+' gaat niet door');

            delete this.active_games[command_parts[2]];
          }
          else{
            message.channel.send('<@'+message.author.id+'> ' + appdata['games'][command_parts[2]]['name']+' was niet open');
          }
        }
        else{
          message.channel.send('Sorry, ik ken "'+command_parts[2]+'" niet');
        }
        return true;
        break;

      case 'status':
        if(appdata['games'][command_parts[2]]){
          if(this.active_games[command_parts[2]]){
          
            var ammount = this.active_games[command_parts[2]]['users'].length;
            var needed = appdata['games'][command_parts[2]]['min']-ammount;
            var left = appdata['games'][command_parts[2]]['max']-ammount;

            var full = appdata['games'][command_parts[2]]['max'] ? left < 1 ? true : false : false

            message.channel.send('<@'+message.author.id+'> '+
                                  appdata['games'][command_parts[2]]['name']+
                                  ' heeft '+ammount+' deelnemers'+
                                  (full ? ', is vol' : 
                                          (needed ? ', heeft nog '+needed+' mensen nodig' : '')+
                                          (left ? ', heeft nog '+left+' plekken over' : '')))+'.';
          }
          else{
            message.channel.send('<@'+message.author.id+'> ' + appdata['games'][command_parts[2]]['name']+' is niet open');
          }
        }
        else{
          message.channel.send('Sorry, ik ken "'+command_parts[2]+'" niet');
        }
        return true;
        break;
    }
  }
}
