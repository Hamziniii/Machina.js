"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const machinaDecorator_1 = require("../../helper/machinaDecorator");
const machinaMessage_1 = require("../../helper/machinaMessage");
// Look at the class example if you are a beginner
// This is just an example of what you would do if you wanted it to be in command format
// This is practically the same as the sub example but put into a varaible 
exports.test = machinaDecorator_1.machinaDecoratorInfo({ monikers: ["test"], description: "testing function", args: { name: "an arg", type: "string", description: "write anything" } })("General", "test", async (params) => {
    console.log("Sending message!");
    await new machinaMessage_1.MachinaMessage({ title: "Test!", description: "This is what you inputted: " + params.args }, params.msg).send();
    console.log("Sent message!");
});
