import { Message } from "@/payload-types";
import ws, { WebSocketServer } from "ws";
import type { Config } from "payload";
import { z } from "zod";


const DEFAULT_PORT = 8081;

const joinChatSchema = z.object({
	type: z.literal("JOIN_CHAT"),
	chatId: z.string().min(1),
});

/**
 * Configuration options for the WebSocket plugin
 */
interface PluginTypes {
	/** Port number for the WebSocket server. Defaults to 8081 */
	port?: number;
	/** Array of collection slugs to watch for changes */
	collections?: string[];
}

/** Global WebSocket server instance */
let wss: WebSocketServer | undefined;

const chatRooms = new Map<string, Set<ws>>(); // chatId => Set of WebSocket connections

/**
 * Payload CMS plugin that adds real-time functionality through WebSockets
 *
 * @param pluginOptions - Configuration options for the WebSocket server
 * @returns A Payload plugin that sets up WebSocket server and collection hooks
 *
 * @example
 * ```typescript
 * // In payload.config.ts
 * export default buildConfig({
 *   plugins: [
 *     websocketServerPlugin({
 *       collections: ['todos'],
 *       port: 8081
 *     })
 *   ]
 * })
 * ```
 */
export const websocketServerPlugin =
	(pluginOptions: PluginTypes = {}) =>
	(incomingConfig: Config): Config => {
		let config = { ...incomingConfig };

		if (!pluginOptions.collections?.length) return config;

		config.collections = (config.collections || []).map((collection) => {
			if (!pluginOptions.collections?.includes(collection.slug)) return collection;

			return {
				...collection,
				hooks: {
					...collection.hooks,
					/**
					 * Hook that runs after a document is deleted
					 * Broadcasts the deletion to all connected WebSocket clients
					 */
					// afterDelete: [
					// 	async ({ doc }) => {
					// 		if (wss) {
					// 			const message = JSON.stringify({
					// 				type: "COLLECTION_CHANGED",
					// 				collection: collection.slug,
					// 				operation: "delete",
					// 				doc,
					// 			});
					// 			wss.clients.forEach((client) => {
					// 				if (client.readyState === ws.OPEN) {
					// 					client.send(message);
					// 				}
					// 			});
					// 		}
					// 	},
					// ],
					/**
					 * Hook that runs after a document is changed (created/updated)
					 * Broadcasts the change to all connected WebSocket clients
					 */
					afterChange: [
						async ({ doc, operation }) => {
							if (!wss || operation !== "create") return doc;

							const roomConnections = chatRooms.get(doc.chat_room.id);

							console.log(roomConnections);

							if (!roomConnections) return doc;

							const message = doc as Message;

							roomConnections.forEach((client) => {
								if (client.readyState === ws.OPEN) {
									client.send(
										JSON.stringify({
											type: "MESSAGE_RECEIVED",
											message,
										})
									);
								}
							});
						},
					],
				},
			};
		});

		/**
		 * Initializes the WebSocket server when Payload starts
		 * Sets up message handling for collection data requests
		 */
		config.onInit = async (payload) => {
			console.log("🔄 NOT Initializing WebSocket server plugin...");

			// Await the existing onInit first
			if (incomingConfig.onInit) await incomingConfig.onInit(payload);

			// Check if WebSocket server is already initialized
			if (wss) return;

			// try {
			// 	const port = pluginOptions.port || DEFAULT_PORT;
			// 	// noServer : true means it attachs himself to current http server
			// 	// becarefull if you deploy to serverless functions because it's ephemeral and does not support long-lived tcp connections
			// 	// false means it creates a http server for himself
			// 	wss = new WebSocketServer({ port, noServer: true });
			// 	console.log(`✅ WebSocket server started successfully on port ${port}`);

			// 	wss.on("connection", (client) => {
			// 		client.on("message", async (message) => {
			// 			const { data, success } = joinChatSchema.safeParse(JSON.parse(message.toString()));

			// 			if (!success) {
			// 				console.log("❌ Invalid message format");
			// 				return;
			// 			}

			// 			const roomConnections = (chatRooms.get(data.chatId) as Set<ws>) || new Set();
			// 			roomConnections.add(client);
			// 			chatRooms.set(data.chatId, roomConnections);

			// 			client.on("close", () => {
			// 				roomConnections.delete(client);
			// 				chatRooms.set(data.chatId, roomConnections);
			// 			});
			// 		});
			// 	});

			// 	wss.on("error", (error) => {
			// 		console.error("⚠️ WebSocket server error:", error);
			// 	});
			// } catch (error) {
			// 	console.error("❌ Failed to start WebSocket server:", error);
			// }
		};

		return config;
	};
