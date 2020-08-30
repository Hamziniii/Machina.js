"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const machina_1 = require("../../machina");
const machinaUtility_1 = require("../../helper/machinaUtility");
const general_1 = require("./general");
require('dotenv').config();
const Bot = new machina_1.Machina(process.env["TOKEN"], "# ", { name: "Hamziniii", icon: "https://cdn.discordapp.com/avatars/393247221505851412/58db2923311a0d7df0bcc5d04e015303.webp" });
Bot.loadCommands(general_1.test); // this is where you would add in your commands, if you want more detail look at class example
Bot.initizalize();
Bot.client.on("message", async (msg) => {
    var _a;
    let cmd = Bot.evaluateMsg(msg);
    if (cmd.reason == "no commands available")
        return machina_1.Machina.noCommands(msg, cmd.extra);
    if (cmd.reason == "permission check passed multiple")
        return machina_1.Machina.multipleCommands(msg, machinaUtility_1.arrify(cmd.value));
    if (cmd.reason != "msg does not include the set prefix")
        console.log(cmd.reason);
    if (cmd.value)
        (_a = machinaUtility_1.arrify(cmd.value)) === null || _a === void 0 ? void 0 : _a.forEach(f => f(Bot, msg));
});
