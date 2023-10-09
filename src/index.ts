import express from "express";
import { createServer } from "node:http";
import {
	dbConection,
	defineMiddlewares,
	gracefulShutdown,
} from "./helpers/index.js";
// Create express app
const app = express();
defineMiddlewares(app);

const server = createServer(app);
const PORT = process.env.PORT || "3434";
server.on("listening", () => {
	console.log(`Server up on: http://localhost:${PORT}/`);
});

server.on("error", (err) => {
	console.error("Server error");
	console.log(err);
});

async function startServer(PORT: string) {
	try {
		const db = await dbConection();
		server.listen(PORT);
	} catch (error) {
		console.log("Error connecting with the database");
		console.log(error);
		process.exit(1);
	}
}

// Set up signal handlers for SIGTERM and SIGINT
process.on("SIGTERM", () => gracefulShutdown(server));
process.on("SIGINT", () => gracefulShutdown(server));

startServer(PORT);
