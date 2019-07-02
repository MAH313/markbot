/* The calendar module*/
/* uses the google calendar api to intercat with a calendar to mark and notify certain events*/

const readline = require('readline');
const {google} = require('googleapis');

module.exports.module_info = {
  name: 'calendar',
  version: '0.5.1',
}

module.exports.module_data = {

  init: function(){
    commands.push(
      '--- Kalender module ---',
      config.botname+' events [periode] - geef een lijst van de eerst volgende 10 events in periode (x dagen, x maanden, x jaren, vanaf dd-mm-jjjj, tot dd-mm-jjjj)',
    )

    this.calendar = google.calendar({version: 'v3', auth: config.google.api_key});
  },

  onCommand: function(command_parts, message){
    switch(command_parts[1]){
      case 'events':
        var str = message.content.replace(new RegExp(command_parts[0]+'[^\w]+'+command_parts[1], 'i'), '').trim();
        var timeProperties = getTimeFromString(str);

        date = new Date();

        if(timeProperties['year'] || timeProperties['month'] || timeProperties['day']){
          date_min = date.toISOString();
          date_max = (new Date(date.getFullYear()+(timeProperties['year'] ? Number(timeProperties['year'][1]) : 0), 
                               date.getMonth()+(timeProperties['month'] ? Number(timeProperties['month'][1]) : 0), 
                                date.getDate()+(timeProperties['day'] ? Number(timeProperties['day'][1]) : 0))).toISOString();
        }
        else if(timeProperties['until'] && timeProperties['until'][1]){
          var broken_date = timeProperties['from'][1].match(/([0-9]{2})-([0-9]{2})-([0-9]{4})/);
          date_min = timeProperties['from'] ? (new Date(Number(broken_date[3]), Number(broken_date[2])-1, Number(broken_date[1]))).toISOString() : date.toISOString();
          broken_date = timeProperties['until'][1].match(/([0-9]{2})-([0-9]{2})-([0-9]{4})/);
          date_max = (new Date(Number(broken_date[3]), Number(broken_date[2])-1, Number(broken_date[1]))).toISOString();
        }
        else{
          date_min = date.toISOString();
          date_max = (new Date(date.getFullYear()+1, date.getMonth(), date.getDate())).toISOString();
        }

        var output = '';
        var date = new Date();
        this.calendar.events.list({
          calendarId: config.google.calendar,
          timeMin: date_min,
          timeMax: date_max,
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime',
        }, (err, res) => {
          if (err) return console.log(err);
          const events = res.data.items;
          if (events.length) {
            output += 'Ik heb '+events.length+' event'+(events.length != 1 ? 's':'')+':\n';
            for(i in events){

              var eventstring = buildMessage(events[i]);
              
              if(eventstring){
                output += eventstring+'\n';
              }
              //output += i+1+') '+events[i].summary+ (events[i].description ? ': '+events[i].description : '') + events[i].htmlLink+'\n';
            }
          } else {
            output = 'Ik heb geen events in de komende periode';
          }

          if(output){
            message.channel.send(output);
          }
        });
        return true;
    }

        
  },

  onMessage: function(message){
    
   
  },

  onHour: function(date){
    if(config.calendar.dayly_message && date.getHours() == config.calendar.hour){
        date = new Date();
        date_min = date.toISOString();
        date_max = (new Date(date.getFullYear(), date.getMonth(), date.getDate()+1)).toISOString();

        var output = '';
        this.calendar.events.list({
          calendarId: config.google.calendar,
          timeMin: date_min,
          timeMax: date_max,
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime',
        }, (err, res) => {
          if (err) return console.log(err);
          const events = res.data.items;
          if (events.length) {
            output += 'Ik heb vandaag '+events.length+' event'+(events.length != 1 ? 's':'')+':\n';
            for(i in events){
              var eventstring = buildMessage(events[i]);

              if(eventstring){
                output += eventstring+'\n';
              }
              //output += i+1+') '+events[i].summary+ (events[i].description ? ': '+events[i].description : '') + events[i].htmlLink+'\n';
            }
          }

          if(output){
            helper.sendMessage(output);
          }
        });

    }
  },
}

function buildMessage(event){
  str = '';

  var settings = checkOptions(event.description);

  //console.log(settings);

  if(settings && settings['options'] && settings['options']['nomessage']){
    return false;
  }

  start = formatDate(event.start);
  end = formatDate(event.end);
  daydiff = null;

  if(start.length == 10 && end.length == 10){
    startparts = start.match(/([0-9]{2})-([0-9]{2})-([0-9]{4})/i);
    endparts = end.match(/([0-9]{2})-([0-9]{2})-([0-9]{4})/i);

    startdate = new Date(startparts[3], startparts[2], startparts[1]);
    enddate = new Date(endparts[3], endparts[2], endparts[1]);

    daydiff = (enddate-startdate)/86400000;
  }

  str += '**'+event.summary+'**\n';
  str += start + ((start != end && daydiff !== 1) ? ' tot '+end : '' )+'\n';
  str += (settings['remains'] ? settings['remains']+'\n' : '');

  if(settings && settings['options'] && settings['options']['offline']){
    str += 'Offline: ';
    for(var i in settings['options']['offline']){
      str += '**'+settings['options']['offline'][i]+'** ' 
    }
    str += '\n';
  }

  /*str += event.htmlLink;*/
  
  return str;
}

function formatDate(date){
  if(date.dateTime){
    var matches = date.dateTime.match(/([0-9]{4})-([0-9]{2})-([0-9]{2}).*([0-9]{2}):([0-9]{2}):([0-9]{2})/);
    return (matches[3]+'-'+matches[2]+'-'+matches[1]+' om '+matches[4]+':'+matches[5]+':'+matches[6]);
  }
  else if(date.date){
    var matches = date.date.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})/);
    return (Number(matches[3])+'-'+matches[2]+'-'+matches[1]);
  }
}

function getTimeFromString(designations){
  var regexes = {
    'year': /([0-9]+)\s*(jaar|jaren)/i,
    'month': /([0-9]+)\s*(maand|maanden)/i,
    'day': /([0-9]+)\s*(dag|dagen)/i,
    'until': /tot\s+([0-9]{2}-[0-9]{2}-[0-9]{4})/i,
    'from': /van\s+([0-9]{2}-[0-9]{2}-[0-9]{4})/i,
  }

  var output = [];

  for(i in regexes){
    output[i] = designations.match(regexes[i]);
  }

  return output;
}

function checkOptions(string){
  if(!string){
    return {};
  }

  var raw_options = string.match(/[\w\:\s#]+;/g);
  var options = {}

  for(var i in raw_options){
    var parts = raw_options[i].match(/[\w#]+/g);
    switch(parts[0].trim()){
      case 'nomessage':
        options['nomessage'] = true;
        break;

      case 'offline':
        options['offline'] = [];
        if(parts[1]){
          for(var j = 1; j < parts.length; j+=1){
            options['offline'].push(parts[j]);
          }
        }
    }
  }

  var remains = string.replace(/[\w\:\s#]+;/g, '');

  return {
    'original': string,
    'raw_options': raw_options,
    'options': options,
    'remains': remains.trim()
  }
}