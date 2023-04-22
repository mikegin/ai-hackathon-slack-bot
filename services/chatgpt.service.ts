import type { Context, Service, ServiceSchema } from "moleculer";
import { executeAIChat } from "./executor"

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

const ChatGPTService: ServiceSchema<GreeterSettings> = {
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
			async handler(ctx: Context<{ prompt: string}, {}>): Promise<string> {
				return await executeAIChat(ctx.params.prompt);
			},
		},
    givecontext: {
			rest: {
				method: "POST",
				path: "/send",
			},
			async handler(ctx: Context<{ prompt: string}, {}>): Promise<string> {
				return await executeAIChat("This is some context: \n" + ctx.params.prompt);
			},
		},
    ask: {
			rest: {
				method: "POST",
				path: "/receive",
			},
			async handler(ctx: Context<{ prompt: string}, {}>): Promise<string> {
				return await executeAIChat(ctx.params.prompt);
			},
		},
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
	// async started(this: GreeterThis) {},

	// /**
	//  * Service stopped lifecycle event handler
	//  */
	// async stopped(this: GreeterThis) {},
};

export default ChatGPTService;
