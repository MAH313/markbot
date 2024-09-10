/* The interaction module*/

module.exports.module_info = {
  name: 'activity',
  version: '0.1',
}

module.exports.module_data = {

  membersInVoice: {},

  init: function(){
    commands.push(

    )
  },

  onVoiceStateUpdate: function(oldState, newState){
    currentTimestamp = Date.now();

    member = newState.member;

    awardedRole = newState.guild.roles.cache.find(role => {return role.name === 'Extrovert'})

    memberIsExtrovert = member.roles.cache.some(role => {
      return role.name === 'Extrovert'
    })

    if (!memberIsExtrovert) {

      if(newState.channelId === null){
        if(this.membersInVoice[member.user.id]){
          if(((currentTimestamp - this.membersInVoice[member.user.id])/60000) > 1){
            member.roles.add(awardedRole);

            helper.sendMessageOnChannel(`Gooi een kroket in de frituur, ${member} is een CommunityCreatuur`, config.default_channel);
          }

          delete this.membersInVoice[member.user.id]
        }

      }
      else if(newState.channelId !== oldState.channelId){
        
        if(!this.membersInVoice[member.user.id]){
          this.membersInVoice[member.user.id] = currentTimestamp
        }
      }
    }

    console.log(this.membersInVoice)
  }

}