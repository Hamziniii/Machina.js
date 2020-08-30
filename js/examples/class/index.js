"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const machina_1 = require("../../machina");
const machinaUtility_1 = require("../../helper/machinaUtility");
require('dotenv').config(); // This simply adds the env file to the process.env variable
// Here I am creating a new instance of Machina using my token from my env file, setting the prefix to "# ", and setting my name and icon. 
// The name and icon are part of the global variable incase if you want to use it.
const Bot = new machina_1.Machina(process.env["TOKEN"], "# ", { name: "Hamziniii", icon: "https://cdn.discordapp.com/avatars/393247221505851412/58db2923311a0d7df0bcc5d04e015303.webp" });
// First I am extracting the the classes (essentially a glorified require, but you can do multiple files or an entire dir. You can also blacklist files)
// NOTE: Use loadCommands if you are doing commands and not classes 
Bot.loadClasses(machinaUtility_1.extractClasses("file", "node_modules/machina/examples/class/general.ts"));
// This is where it starts the bot. If you want to start some other things, you can put a function inside. This is useful if you have mongo or something.
Bot.initizalize(() => {
    // Mongo or anything else that needs to be started here
});
// Hash.client is a Discord.js client instance. You can subscribe to events like normal. Below is an example of on message.
Bot.client.on("message", async (msg) => {
    var _a;
    // Here the bot evaluates the message based on what is inputted.
    // It has three properties: 
    //  value: either nothing, a single function that matched the query, or multiple functions that matched the query 
    //  reason: added information about the reuslts. no commands if the query didnt match any, etc
    //  extra: extra stuff for debugging 
    let cmd = Bot.evaluateMsg(msg);
    // This sends a message to the user that there are no commands with that query
    if (cmd.reason == "no commands available")
        return machina_1.Machina.noCommands(msg, cmd.extra);
    // This sends a message to the user that there are multiple commands with that query and that they should use a more specific query 
    if (cmd.reason == "permission check passed multiple")
        return machina_1.Machina.multipleCommands(msg, machinaUtility_1.arrify(cmd.value));
    // Uncomment the next line if you want to debug, and see everything
    // if(cmd.reason != "msg does not include the set prefix") console.log(cmd.reason)
    // Here if there is a command that can be called it calls them with the perameters of the bot instance and the message
    if (cmd.value)
        (_a = machinaUtility_1.arrify(cmd.value)) === null || _a === void 0 ? void 0 : _a.forEach(f => f(Bot, msg));
});
