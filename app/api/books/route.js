import { SeverityNumber } from "@opentelemetry/api-logs";
import { after } from "next/server";
import { posthogExportLogger, posthogLoggerProvider } from "@/instrumentation";

export async function GET() {
    posthogExportLogger?.emit({
        body: "books_api_request_received",
        severityNumber: SeverityNumber.INFO,
        attributes: {
            endpoint: "/api/books",
            method: "GET",
        },
    });

    posthogExportLogger?.emit({
        body: "books_api_response_sent",
        severityNumber: SeverityNumber.INFO,
        attributes: {
            endpoint: "/api/books",
            method: "GET",
            http_response_status_code: 200,
        },
    });

    if (posthogLoggerProvider) {
        after(async () => {
            await posthogLoggerProvider.forceFlush();
        });
    }

    return Response.json({ message: 'Hello, World from backend!' });
}