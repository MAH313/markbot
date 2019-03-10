<!DOCTYPE html>
<html>
<head>
  <title>Mark bot stats interface</title>
</head>
<body>
  <!-- basic stats -->
  <section class='content'>
    <div class='row'>
      <h1><span id='from_date'>Datum</span> tot en met <span id='to_date'>Datum</span></h1>
    </div>

    <div class='row'>
      <table>
        <thead>
          <tr>
            <th>Dag</th>
            <th>0</th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
            <th>6</th>
            <th>7</th>
            <th>8</th>
            <th>9</th>
            <th>10</th>
            <th>11</th>
            <th>12</th>
            <th>13</th>
            <th>14</th>
            <th>15</th>
            <th>16</th>
            <th>17</th>
            <th>18</th>
            <th>19</th>
            <th>20</th>
            <th>21</th>
            <th>22</th>
            <th>23</th>
          </tr>
        </thead>
        <tbody id='heatmap'>
          
        </tbody>
      </table>
    </div>

    <div class='row'>
      <table>
        <thead>
          <tr>
            <th colspan="2">Gebruikers</th>
          </tr>
          <tr>
            <th>Naam</th>
            <th>Berichten</th>
          </tr>
        </thead>
        <tbody id='userlist'>
          
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th colspan="2">Kanalen</th>
          </tr>
          <tr>
            <th>Kanaal</th>
            <th>Berichten</th>
          </tr>
        </thead>
        <tbody id='channellist'>
          
        </tbody>
      </table>
    </div>
  </section>

  <style>

    td[data-heat]{
      width: 2em;
      height: 2em;
    }

    th, td{
      text-align: center;
    }

    section.content > div.row > table{
      display: inline-block;
    }

    section.content{
      width: 100%;
    }

    section.content > div.row{
      width: 100%;
      align-content: start;
      display: flex;
      flex-wrap: wrap;
    }

  </style>

  <script type="text/javascript">
    var bot_data = JSON.parse('<?php echo file_get_contents('./botdata.json'); ?>');
    var message_log = bot_data['log'];

    var users = [];
    var channels = [];

    var timeSlots = {};

    var highestTotalCount = 0;

    function MakeHeatMap(now, lastweek){

      var dates = getDates(lastweek, now);
      var heatmapDOM = document.getElementById('heatmap');

      for(var i in dates){
        var day;
        try{
          day = timeSlots[dates[i].getFullYear()][dates[i].getMonth()][dates[i].getDate()];
        }
        catch(error){
        }

        var tr = '<tr><td>'+dates[i].getDate()+'-'+dates[i].getMonth()+'</td>';

        if(day){
          for(var hour = 0; hour < 24; hour++){
            if(!day[hour]){
              tr += '<td data-heat="0"></td>';
            }
            else{
              var alpha = day[hour]['total_messages']/highestTotalCount;
              tr += '<td data-heat="'+day[hour]['total_messages']+'" style="background-color: rgba(255,0,0,'+alpha+')"></td>';
            }
          }
        }
        else{
          for(var hour = 0; hour < 24; hour++){
            tr += '<td data-heat="0"></td>';
          }
        }

        heatmapDOM.innerHTML += tr+'</tr>';
      }
    }

    function makePlayerList(now, lastweek){
      var list = '';
      var dates = getDates(lastweek, now);

      var tableArray = {};

      for(var user_id in users){
        var user_count = 0;

        for(var i in dates){
          var day;
          try{
            day = timeSlots[dates[i].getFullYear()][dates[i].getMonth()][dates[i].getDate()];
          }
          catch(error){
          }

          if(day){
            for(var hour = 0; hour < 24; hour++){
              if(day[hour] && day[hour]['user_counters'][user_id]){
                user_count += day[hour]['user_counters'][user_id]
              }
            }
          }
        }
        tableArray[users[user_id].name] = user_count
      }

      var sortedArray = [];
      for (var row in tableArray) {
          sortedArray.push([row, tableArray[row]]);
      }

      sortedArray.sort(function(a, b) {
          return b[1] - a[1];
      });

      for(var key in sortedArray){
        if(sortedArray[key][1]){
          list += '<tr><td>'+sortedArray[key][0]+'</td><td>'+sortedArray[key][1]+'</td></tr>';
        }
      }
      
      document.getElementById('userlist').innerHTML = list;
    }

    function makeChannelList(now, lastweek){
      var list = '';
      var dates = getDates(lastweek, now);

      var tableArray = {};

      for(var channel_id in channels){
        var channel_count = 0;

        for(var i in dates){
          var day;
          try{
            day = timeSlots[dates[i].getFullYear()][dates[i].getMonth()][dates[i].getDate()];
          }
          catch(error){
          }

          if(day){
            for(var hour = 0; hour < 24; hour++){
              if(day[hour] && day[hour]['channel_counters'][channel_id]){
                channel_count += day[hour]['channel_counters'][channel_id]
              }
            }
          }
        }
        tableArray[channels[channel_id].name] = channel_count
      }

      var sortedArray = [];
      for (var row in tableArray) {
          sortedArray.push([row, tableArray[row]]);
      }

      sortedArray.sort(function(a, b) {
          return b[1] - a[1];
      });

      for(var key in sortedArray){
        if(sortedArray[key][1]){
          list += '<tr><td>'+sortedArray[key][0]+'</td><td>'+sortedArray[key][1]+'</td></tr>';
        }
      }
      
      document.getElementById('channellist').innerHTML = list;
    }

    function process_data(){
      for(var i in message_log){
        var message = message_log[i];

        if(!users[message['user']] && message['user_name']){
          users[message['user']] = {'name': message['user_name']};
        }
        if(!channels[message['channel']] && message['channel_name']){
          channels[message['channel']] = {'name': message['channel_name']};
        }

        var message_Date = new Date(message['time']);
        var hour = message_Date.getHours();
        var day = message_Date.getDate();
        var month = message_Date.getMonth();
        var year = message_Date.getFullYear();

        if(!timeSlots[year]){
          timeSlots[year] = {};
        }
        if(!timeSlots[year][month]){
          timeSlots[year][month] = {};
        }
        if(!timeSlots[year][month][day]){
          timeSlots[year][month][day] = {};
        }
        if(!timeSlots[year][month][day][hour]){
          timeSlots[year][month][day][hour] = {
            'user_counters': {},
            'channel_counters': {},
            'total_messages': 0,
          };
        }

        if(!timeSlots[year][month][day][hour]['user_counters'][message['user']]){
          timeSlots[year][month][day][hour]['user_counters'][message['user']] = 1;
        }
        else{
          timeSlots[year][month][day][hour]['user_counters'][message['user']] += 1;
        }

        if(!timeSlots[year][month][day][hour]['channel_counters'][message['channel']]){
          timeSlots[year][month][day][hour]['channel_counters'][message['channel']] = 1;
        }
        else{
          timeSlots[year][month][day][hour]['channel_counters'][message['channel']] += 1;
        }

        timeSlots[year][month][day][hour]['total_messages'] += 1;

        if(timeSlots[year][month][day][hour]['total_messages'] > highestTotalCount){
          highestTotalCount = timeSlots[year][month][day][hour]['total_messages'];
        }
      }
    }

    Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    }

    function getDates(startDate, stopDate) {
      var dateArray = new Array();
      var currentDate = startDate;
      while (currentDate <= stopDate) {
          dateArray.push(new Date (currentDate));
          currentDate = currentDate.addDays(1);
      }
      return dateArray;
    }

    window.onload = function(){

      var now = new Date();
      var lastweek = new Date();
      lastweek.setDate(now.getDate() - 6);

      process_data();
      MakeHeatMap(now, lastweek);
      makePlayerList(now, lastweek);
      makeChannelList(now, lastweek);

      document.getElementById('from_date').innerHTML = lastweek.getDate()+'-'+lastweek.getMonth()+'-'+lastweek.getFullYear();
      document.getElementById('to_date').innerHTML = now.getDate()+'-'+now.getMonth()+'-'+now.getFullYear();
    }

  </script>

</body>
</html>