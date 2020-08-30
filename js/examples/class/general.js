"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.General = void 0;
const machinaDecorator_1 = require("../../helper/machinaDecorator");
const machinaMessage_1 = require("../../helper/machinaMessage");
const machinaUtility_1 = require("../../helper/machinaUtility"); // This isnt needed, but it will help you 90% of the time 
// This class wont be exported, so everything here wont be in the bot 
class General2 {
}
General2.sub2 = (params) => {
    new machinaMessage_1.MachinaMessage({ description: "not a surprise" }, params.msg).send();
};
__decorate([
    machinaDecorator_1.machinaDecoratorInfo({ monikers: "sub2", description: "something terrible" }),
    __metadata("design:type", Object)
], General2, "sub2", void 0);
class General {
}
// This is an example of what a command would look like
// This is where you put specific information about the function, like the parameters, monikers, descriptions, and more
General.test = async (params) => {
    // This is where your actual code is 
    console.log("Sending message!");
    // This is an example of using MachinaMessage. To learn more about it, look at the MachinaMessage file 
    await new machinaMessage_1.MachinaMessage({ title: "Test!", description: "This is what you inputted: " + params.args }, params.msg).send();
    console.log("Sent message!");
};
// This is an example of a function that uses a sub command
General.subTest = async (params) => {
    // Here I am using param.info which gives the infromation put into machinaDecoratorInfo
    // Then I look at the subs property and put it into the subs functon. This is becaus property can either be MachinaFunction or MachinaFunction[]
    // I map each sub functions name, then I join them together with ", "
    // When you run this command it should tell you all of the sub commands for this command
    new machinaMessage_1.MachinaMessage({ title: "subTest", description: "Use one of this command's sub commands: " + machinaUtility_1.arrify(params.info.subs).map(s => s.name).join(", ") }, params.msg).send();
};
__decorate([
    machinaDecorator_1.machinaDecoratorInfo({ monikers: ["test"], description: "testing function", args: { name: "an arg", type: "string", description: "write anything" } }),
    __metadata("design:type", Object)
], General, "test", void 0);
__decorate([
    machinaDecorator_1.machinaDecoratorInfo({ monikers: ["subTest", "sTest"], description: "a test for sub commands!", subs: [
            // Essentially this is the same way that you would go about making a machina function wihtout a class
            machinaDecorator_1.machinaDecoratorInfo({ monikers: ["sub1"], description: "a suprise!" })("General", "sub1", (params) => {
                new machinaMessage_1.MachinaMessage({ description: "a surprise!" }, params.msg).send();
            }),
            // You can import other commands and use them as sub commands. If there are any errors, with will tell you the class or location of where its located. 
            // Thats why you must put in the class and function name when you make a machina function without classes  
            General2.sub2
        ]
    }),
    __metadata("design:type", Object)
], General, "subTest", void 0);
exports.General = General;
