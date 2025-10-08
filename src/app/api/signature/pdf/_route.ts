import { jsonResponseBadRequest, jsonResponsePost, jsonResponseUnauthorized } from "@/utils/response/json";
// To avoid installing Drizzle, you can import everything that drizzle has from our re-export path.
import { eq, sql, and } from "@payloadcms/db-postgres/drizzle";
import { validateRequest } from "@/utils/request/validation";
import { isValidToken } from "@/utils/response/header";
import { getPayload, Payload } from "payload";
import { NextRequest } from "next/server";
import config from "@payload-config";
import { writeFileSync } from "fs";
import { join } from "path";
import { z } from "zod";


// const ACCEPTED_CONTENT_TYPE = "application/json";

// const mediaSchema = z.object({
// 	// IT'S BASE64 FOR NOW
// 	files: z.array(z.string()).min(1),
// });

// export async function POST(req: NextRequest) {
// 	const payload = await getPayload({
// 		config,
// 	});

// 	const chatRooms = await payload.db.drizzle.query.chat_rooms.findMany();

// 	if (!isValidToken(req.cookies)) return jsonResponseUnauthorized();

// 	const { error, messageError, data } = await validateRequest(req, ACCEPTED_CONTENT_TYPE, mediaSchema);

// 	if (error) return jsonResponseBadRequest(messageError);

// 	// console.dir(data.files[0], { depth: null})

// 	// const signatures = await payload.db.drizzle.query.signatures.findMany()

// 	return jsonResponsePost({ message: "OK" });
// }
