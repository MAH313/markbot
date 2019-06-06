# MarkBot

## Introduction

MarkBot is a discord bot based on discord.js. Its target is to offer a all in one bot by using a modular setup and an easy way to add new and/or custom modules.
This README covers the MarkBot core. The core does not offer much functionality except some base commands like 'help' and 'info' (see usage for more info). For more info about the individual modules and info about writing your own modules, see the 'modules' folder.

## Instalation

Markbot requires Node.js and Discord.js to run. additional modules might have additional requirements. These are listed in their respective readme files.

[Node.js](https://nodejs.org/)

[Discord.js](https://discord.js.org/)

these sites offer indepth guides for multiple platforms.

## Setup

MarkBot can be run on linux by navigating to the instalation folder and running the command `sudo node main.js`. On first setup this will create a json file called 'config.json'. this has to be filled out, otherwise the bot wont run its normal routine. the file contains the following fields:

* botname: The screenname of the bot, is used as a command indicator and to prevent the bot from reacting to itself. (not case sensitive, default: markbot)
* superAdminName: the screen name of the super admin, is used to user bind very powerfull commands that cant be bound to specific channels. after detecting this user, MarkBot will store the user's id and bind it to that. (case sensitive)
* storagefile: the name of the data storage file (default: botdata)
* botkey: the client token for the discord bot, this can be found in the [discord developer portal](https://discordapp.com/developers/).

more fields can be added to this list by modules, check their respective readme files.

after filling out the config file markbot is ready to run.

## Default commands

*botname* help: lists all commands, both core and from modules (if added correctly).
*botname* info: displays info about MarkBot and the loaded modules.

## Adding modules

Drop any compatible modules in the 'modules' folder and run/restart the bot. An indepth documentation about creating modules will be added in the future.

## Credits

*[Node.js](https://nodejs.org/)
*[Discord.js](https://discord.js.org/)
*MAH313 (aka MaHo)