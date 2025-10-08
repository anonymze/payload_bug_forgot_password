import type { NextRequest } from "next/server";
import { z } from "zod";


type ParsedRequest<T = undefined> =
	| { error: true; messageError: string }
	| { error: false; [key: string]: T | boolean };

export type ContentTypeAccepted = "multipart/form-data" | "application/json" | "application/x-www-form-urlencoded";

export class ParserRequest {
	constructor(
		readonly request: NextRequest,
		readonly contentType: ContentTypeAccepted,
	) {}

	validContentType() {
		if (this.request.headers.get("content-type")?.startsWith(this.contentType)) {
			return {
				error: false,
				contentType: this.contentType,
			} satisfies ParsedRequest<ContentTypeAccepted>;
		}

		return {
			error: true,
			messageError: "Content-Type does not match the accepted type",
		} satisfies ParsedRequest;
	}

	validData<T>(data: unknown, dataSchema: z.ZodType<T>) {
		try {
			const nameParamFile = "file[]";
			let dataToParse = data;

			if (this.contentType === "multipart/form-data" || this.contentType === "application/x-www-form-urlencoded") {
				const dataFormData: Record<string, unknown> = {};
				const files = (data as FormData).getAll(nameParamFile);
				
				dataFormData.files = files;
				
				for (const [key, value] of (data as FormData).entries()) {
					if (key === nameParamFile) continue;
					dataFormData[key] = value;
				}
				
				dataToParse = dataFormData;
			}

			dataSchema.parse(dataToParse)

			return {
				error: false,
				dataVerified: dataSchema.parse(dataToParse),
			} satisfies ParsedRequest<T>;
		} catch (err) {
			if (err instanceof Error) {
				return { error: true, messageError: err.message } satisfies ParsedRequest;
			}

			return {
				error: true,
				messageError: "Data does not match the provided schema",
			} satisfies ParsedRequest;
		}
	}

	async parseBody() {
		try {
			if (this.contentType === "multipart/form-data" || this.contentType === "application/x-www-form-urlencoded") {
				return {
					error: false,
					dataParsed: await this.request.formData(),
				} satisfies ParsedRequest<FormData>;
			}

			return {
				error: false,
				dataParsed: await this.request.json(),
			} satisfies ParsedRequest<unknown>;
		} catch (_) {
			return {
				error: true,
				messageError: "Content could not be parsed. Please check you are sendind data.",
			} satisfies ParsedRequest;
		}
	}
}
