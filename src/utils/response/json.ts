import { createResponseHeader } from "./header";


interface JsonResponseCore {
	status: number;
	statusText: string;
	headers?: HeadersInit;
}

interface JsonResponse extends JsonResponseCore {
	body: unknown;
}

export function jsonResponse({ body, status, statusText, headers }: JsonResponse) {
	// in case there is a mistake we handle no content
	if (status === 204) {
		return new Response(null, { status, statusText, headers });
	}

	if (!body || typeof body === "string") {
		return Response.json({ status, message: body || "OK" }, { status, statusText, headers });
	}

	return Response.json(body, { status, statusText, headers });
}

// ERRORS

export function jsonResponseUnauthorized(message = "Unauthorized") {
	return jsonResponse({ body: message, status: 401, statusText: "Unauthorized" });
}

export function jsonResponseBadRequest(message: string, statusText = "Bad Request") {
	return jsonResponse({ body: message, status: 400, statusText });
}

export function jsonResponseNotFound(message: string, statusText = "Not found") {
	return jsonResponse({ body: message, status: 404, statusText });
}

export function jsonResponseForbidden(message: string, statusText = "Forbidden") {
	return jsonResponse({ body: message, status: 403, statusText });
}


// SUCCESS

export function jsonResponseGet(body: unknown, withCookieApiToken = true) {
	return jsonResponse({
		body,
		status: 200,
		statusText: "OK",
		headers: createResponseHeader(withCookieApiToken),
	});
}

export function jsonResponsePost(body: unknown, withCookieApiToken = true) {
	return jsonResponse({
		body,
		status: 201,
		statusText: "OK",
		headers: createResponseHeader(withCookieApiToken),
	});
}

export function jsonResponsePatch(body: unknown, withCookieApiToken = true) {
	return jsonResponse({
		body,
		status: 200,
		statusText: "OK",
		headers: createResponseHeader(withCookieApiToken),
	});
}

export function responseDelete(withCookieApiToken = true) {
	return new Response(null, {
		status: 204,
		statusText: "OK",
		headers: createResponseHeader(withCookieApiToken),
	});
}
