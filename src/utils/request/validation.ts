import type { NextRequest } from "next/server";
import type { z } from "zod";

import { ContentTypeAccepted, ParserRequest } from "./_parser";


type ExtractedDataRequest<T> =
	| {
			error: true;
			messageError: string;
	  }
	| {
			error: false;
			data: T;
	  };

/**
 *
 * @param req The original request to parse
 * @param acceptedContentType What type of data is accepted
 * @param dataSchema Validator schema
 */
export async function validateRequest<T>(
	req: NextRequest,
	acceptedContentType: ContentTypeAccepted,
	dataSchema: z.ZodType<T>,
) {
	const parserRequest = new ParserRequest(req, acceptedContentType);

	// we first validate the content type
	const { error: errorContentType, messageError: messageErrorContentType } =
		parserRequest.validContentType();

	if (errorContentType)
		return { error: true, messageError: messageErrorContentType } satisfies ExtractedDataRequest<T>;

	// we parse the body to get the data
	const {
		error: errorParsing,
		messageError: messageErrorParsing,
		dataParsed,
	} = await parserRequest.parseBody();

	if (errorParsing)
		return { error: true, messageError: messageErrorParsing } satisfies ExtractedDataRequest<T>;

	// we verify the correctness of the data
	const {
		error: errorVerification,
		messageError: messageErrorVerification,
		dataVerified,
	} = parserRequest.validData(dataParsed, dataSchema);

	if (errorVerification)
		return { error: true, messageError: messageErrorVerification } satisfies ExtractedDataRequest<T>;

	// we return the data typed correctly
	return { error: false, data: dataVerified } satisfies ExtractedDataRequest<T>;
}
