import config from "@payload-config";
import {
  APIError,
  CollectionBeforeValidateHook,
  Endpoint,
  getPayload,
  PayloadRequest,
  ValidationError,
} from "payload";
import { getPlaiceholder } from "plaiceholder";
import sharp from "sharp";

import type { AppUser } from "../payload-types";

const ORIGIN_MOBILE = "simply-life-app://mobile";
const ORIGIN_APP = "simply-life-app://app";
type originType = "mobile" | "app";

export const canAccessApi = (
  req: PayloadRequest,
  roles: AppUser["role"][],
  originType?: originType,
): boolean => {
  if (!req.user) return false;
  if (req.user.collection === "admins") return true;
  // console.log(req.headers.get("cookie"));
  if (originType && !verifyOrigin(req.headers?.get("origin"), originType))
    return false;

  return roles.includes(req.user.role);
};

const verifyOrigin = (
  origin: string | null,
  originType: originType,
): boolean => {
  if (!origin) return false;
  return originType === "mobile"
    ? origin === ORIGIN_MOBILE
    : origin === ORIGIN_APP;
};

/**
 * Throws error if password strength is not met. Password must have:
 *  - 10 or more characters
 *  - letters
 *  - numbers
 **/
export const validatePassword: CollectionBeforeValidateHook = (
  payloadRequest,
) => {
  const { data } = payloadRequest;
  if (!data?.password) return;

  if (data.password.length < 10)
    throw new ValidationError({
      errors: [
        {
          message:
          // @ts-ignore
            payloadRequest.req.i18n.translations?.custom.errorlengthPassword,
          label:
          // @ts-ignore
            payloadRequest.req.i18n.translations?.custom.errorlengthPassword,
          path: "password",
        },
      ],
    });

  const hasLetters = /[a-zA-Z]/.test(data.password);
  const hasNumbers = /\d/.test(data.password);

  if (!hasLetters) {
    throw new ValidationError({
      errors: [
        {
          message:
          // @ts-ignore
            payloadRequest.req.i18n.translations?.custom.errorLettersPassword,
          label:
          // @ts-ignore
            payloadRequest.req.i18n.translations?.custom.errorLettersPassword,
          path: "password",
        },
      ],
    });
  }

  if (!hasNumbers)
    throw new ValidationError({
      errors: [
        {
          message:
          // @ts-ignore
            payloadRequest.req.i18n.translations?.custom.errorNumbersPassword,
          label:
          // @ts-ignore
            payloadRequest.req.i18n.translations?.custom.errorNumbersPassword,
          path: "password",
        },
      ],
    });
};

/**
 * Server-Sent Events (SSE) endpoint for Messages collection using TransformStream
 * Implements a polling mechanism to check for new messages and stream them to clients
 */
export const SSEMessages: Endpoint = {
  path: "/sse",
  method: "get",
  handler: async (req) => {
    try {
      // Create abort controller to handle connection termination
      const abortController = new AbortController();
      const { signal } = abortController;

      // Set up streaming infrastructure
      const stream = new TransformStream();
      const writer = stream.writable.getWriter();
      const encoder = new TextEncoder();

      // Initialize timestamp to fetch all messages from the beginning
      // let lastTimestamp = new Date(0).toISOString();

      // Send keep-alive messages every 30 seconds to maintain connection
      const keepAlive = setInterval(async () => {
        if (signal.aborted) return;
        await writer.write(encoder.encode("event: ping\ndata: keep-alive\n\n"));
      }, 30000);

      /**
       * Polls for new messages and sends them to connected clients
       * - Queries messages newer than the last received message
       * - Updates lastTimestamp to the newest message's timestamp
       * - Streams messages to client using SSE format
       */
      const pollMessages = async () => {
        if (signal.aborted) return;

        // Query for new messages since last update
        const messages = await req.payload.find({
          collection: "messages",
          // where: {
          // 	updatedAt: { greater_than: lastTimestamp },
          // },
          sort: "-createdAt",
          limit: 25,
          depth: 2,
          // add email app-users related to the message
          // populate: {
          // 	"app-users": {
          // 		email: true,
          // 	},
          // },
        });

        if (messages.docs.length > 0) {
          // Update timestamp to latest message for next poll
          // lastTimestamp = messages.docs[0].updatedAt;
          // Send messages to client in SSE format
          await writer.write(
            encoder.encode(
              `event: message\ndata: ${JSON.stringify(messages.docs)}\n\n`,
            ),
          );
        }
      };

      // Poll for new messages every second
      const messageInterval = setInterval(pollMessages, 1000);

      // Clean up intervals and close writer when connection is aborted
      signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        clearInterval(messageInterval);
        writer.close();
      });

      // Return SSE response with appropriate headers
      return new Response(stream.readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no", // Prevents nginx from buffering the response
          "Access-Control-Allow-Origin": "*", // CORS header for cross-origin requests
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    } catch (error) {
      console.log(error);
      return new Response("Error occurred", { status: 500 });
    }
  },
};

export const operationGenerationBlurHash: CollectionBeforeValidateHook =
  async ({ data, operation, req }) => {
    if (operation !== "create" && operation !== "update") return data;
    if (req.file?.mimetype.startsWith("image/")) {
      try {
        const buffer = req.file.data;
        const base64 = await generateImageBlurHash(buffer);

        return {
          ...data,
          blurhash: base64,
        };
      } catch (error) {
        throw new APIError("Failed to generate blur data url");
      }
    }

    return {
      ...data,
      blurhash: undefined,
    };
  };

export const generateImageBlurHash = async (buffer: Buffer) => {
  // First process the image with Sharp to handle orientation
  const processedBuffer = await sharp(buffer)
    .rotate() // This will automatically rotate based on EXIF orientation
    .toBuffer();

  const { base64 } = await getPlaiceholder(processedBuffer, { size: 32 });
  return base64;
};

export const generateVideoBlurHash = async (buffer: Buffer) => {
  // const { base64 } = await getPlaiceholder(buffer, { size: 32 });
  // return base64;
  return undefined;
};

export const validateMedia = async (
  data: unknown,
  mimeType:
    | "image/"
    | "video/"
    | "application/pdf"
    | "sheet"
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" = "image/",
) => {
  if (typeof data !== "string") return "Le média est obligatoire.";
  const payload = await getPayload({
    config,
  });
  const file = await payload.findByID({
    collection: "media",
    id: data,
  });

  // Handle sheet files (Excel and CSV)
  if (mimeType === "sheet") {
    const isExcel =
      file.mimeType?.startsWith(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ) || file.mimeType?.startsWith("application/vnd.ms-excel");
    const isCsv = file.mimeType?.startsWith("text/csv");

    if (!isExcel && !isCsv) {
      return "Le fichier doit être un Excel (.xlsx, .xls) ou CSV (.csv).";
    }
    return true; // Valid sheet file
  }

  if (file.mimeType?.startsWith(mimeType) === false) {
    if (mimeType === "image/") return "Le fichier doit être une image.";
    if (mimeType === "video/") return "Le fichier doit être une vidéo.";
    if (mimeType === "application/pdf") return "Le fichier doit être un PDF.";
    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
      return "Le fichier doit être un Excel (.xlsx, .xls).";
  }

  return true;
};

export const rolesOptions = [
  {
    label: {
      en: "Associate",
      fr: "Associé",
    },
    value: "associate",
  },
  {
    label: {
      en: "Employee",
      fr: "Employé",
    },
    value: "employee",
  },
  {
    label: {
      en: "Independent",
      fr: "Indépendant",
    },
    value: "independent",
  },
  {
    label: {
      en: "Visitor",
      fr: "Visiteur",
    },
    value: "visitor",
  },
];
