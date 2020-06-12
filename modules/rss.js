/* The rss module*/
const FeedParser = require('feedparser');
const request = require('request'); // for fetching the feed
var feednum = 0;

module.exports.module_info = {
  name: 'RSS',
  version: '0.5',
}

module.exports.module_data = {

  init: function(){
    commands.push(

    )

    //this.feedparser = new FeedParser();

    appdata['rss'] = appdata['rss'] || {};

  },

  onMessage: function(message){

  },

  onCommand: function(command_parts, message){
    if(command_parts[1] == 'rss'){
      feednum = 0;
      this.readFeed(config.feeds[feednum]);
      return true;
    }
  },

  onNewMember: function(member){
    
  },

  onHour: function(date){
    feednum = 0;
    if(config.feeds && config.feeds[feednum]){
      this.readFeed(config.feeds[feednum]);
    }
  },

  readFeed: function(url){
    var req = request(url)

    var rss_cls = this;
    var feedparser = new FeedParser();

   //console.log('reading rss feed '+url);

    req.on('response', function (res) {
      var stream = this; // `this` is `req`, which is a stream

      if (res.statusCode !== 200) {
        this.emit('error', new Error('Bad status code'));
      }
      else {
        stream.pipe(feedparser);
      }
    });

    feedparser.on('error', function (error) {
      console.error(error);
    });

    feedparser.on('end', function(){
      
      appdata['rss'][this.source_name] = this.last_message[this.source_name]

      feednum += 1
      if(feednum < config.feeds.length){
        rss_cls.readFeed(config.feeds[feednum]);
      }
    });

    feedparser.on('readable', function () {
      // This is where the action is!
      var stream = this; // `this` is `feedparser`, which is a stream
      var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
      var item;
      var last_message;
      var source;

      if(!this.stopped) this.stopped = {};
      if(!this.last_message) this.last_message = {};

      while (item = stream.read()) {
        if(!source) source = item.meta.title.replace(/[^a-zA-Z0-9]/, '');

        if(this.stopped[source] || appdata['rss'][source] == item.title){
          this.stopped[source] = true;
          //console.log(source, 'closed');
          return;
        }

        if(!last_message) last_message = item.title;
        

        var message = buildRSSMessage(item)
        if(appdata['channels']['feed']){
          helper.sendMessageOnChannel(message, appdata['channels']['feed']);
        }
        else{
          helper.sendMessage(message);
        }
      }
      
      if(source && !this.last_message[source]){
        this.last_message[source] = last_message;
        this.source_name = source;
        //appdata['rss'][source] = last_message;
        //helper.save();
      }
    });
  }
}

function buildRSSMessage(rssItem){
  str = '';

  str += '**'+rssItem.title+'**\n';
  str += '*'+rssItem.meta.title+' - '
  str += rssItem.date+'*\n';

  var content = rssItem.summary.replace(/(<([^>]+)>)/ig,"");
  if(content.length > 1750){
    content = content.substr(0, 1750)+'...';
  }
  str += content + '\n';
  str += rssItem.link;

  /*str += event.htmlLink;*/
  
  return str;
}
