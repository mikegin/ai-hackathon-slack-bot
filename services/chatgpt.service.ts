import type { Context, Service, ServiceSchema } from "moleculer";
import { executeAIChat } from "./executor"
import { ResponseResult } from "./types"

export interface ActionHelloParams {
	name: string;
}

interface GreeterSettings {
	defaultName: string;
}

interface GreeterMethods {
	uppercase(str: string): string;
}

interface GreeterLocalVars {
	myVar: string;
}

type GreeterThis = Service<GreeterSettings> & GreeterMethods & GreeterLocalVars;

const ChatGPTService: ServiceSchema = {
  version: 1,
	name: "chatgpt",

	/**
	 * Settings
	 */
	settings: {
		defaultName: "Moleculer",
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
	   execute: {
			rest: {
				method: "POST",
				path: "/execute",
			},
			async handler(ctx: Context<{ prompt: string}, {}>): Promise<ResponseResult> {
				const response:ResponseResult = await executeAIChat(ctx.params.prompt);
        if(response.isQuestion) {
          //send to slack
        }
        return response
			},
		},
  //   givecontext: {
		// 	rest: {
		// 		method: "POST",
		// 		path: "/send",
		// 	},
		// 	async handler(ctx: Context<{ prompt: string}, {}>): Promise<string> {
		// 		return await executeAIChat("This is some context: \n" + ctx.params.prompt);
		// 	},
		// },
  //   ask: {
		// 	rest: {
		// 		method: "POST",
		// 		path: "/receive",
		// 	},
		// 	async handler(ctx: Context<{ prompt: string}, {}>): Promise<string> {
		// 		return await executeAIChat(ctx.params.prompt);
		// 	},
		// },
	},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {},

	// /*?*
	//  * Service created lifecycle event handler
	//  */
	// created(this: GreeterThis) {},

	// /**
	//  * Service started lifecycle event handler
	//  */
	async started() {    
    const { App } = require('@slack/bolt');
    
    const app = new App({
      token: process.env.SLACK_API_BOT_TOKEN,
      signingSecret: process.env.SLACK_API_SIGNING_SECRET,
      appToken: process.env.SLACK_API_APP_TOKEN,
      socketMode: true
    });

    // message: {
    // 	"type": "message",
    // 	"channel": "C2147483705",
    // 	"user": "U2147483697",
    // 	"text": "Hello world",
    // 	"ts": "1355517523.000005"
    //  ... (more properties based on message subtype)
    // }
    
    // app.message(<regex>, <function>)
    //   when a message is received matching the regex, execute the function.
    app.message('', async ({ message, say }: { message: any, say: Function }) => {
      console.log("Message received");
      const response: ResponseResult = await this.broker.call("v1.chatgpt.execute", {
        prompt: message.text
      })
      console.log("response>>", response)
      if(response.isQuestion) {
        await say(`Hello, <@${message.user}>!\n ${response.result}`);
      }
    });
    
    (async () => {
      await app.start(3001);
      console.log('Bot started');
    })();
  },

	// /**
	//  * Service stopped lifecycle event handler
	//  */
	// async stopped(this: GreeterThis) {},
};

export default ChatGPTService;
