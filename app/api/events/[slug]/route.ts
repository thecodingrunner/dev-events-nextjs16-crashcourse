import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/database/event.model";

/**
 * Route context interface representing dynamic parameters for the route.
 */
interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET /api/events/[slug]
 * Fetches single event details by its unique slug.
 *
 * @param _req - NextRequest instance.
 * @param context - Dynamic route parameters containing the event slug.
 * @returns JSON response with event details or error message.
 */
export async function GET(
  _req: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  try {

    // Establish database connection
    await connectToDatabase();

    const { slug } = await params;

    // Validate slug parameter existence and format
    if (!slug || typeof slug !== "string" || !slug.trim()) {
      return NextResponse.json(
        { message: "Slug parameter is required and must be a valid non-empty string." },
        { status: 400 }
      );
    }

    const trimmedSlug = slug.trim().toLowerCase();

    // Query event by unique slug
    const event = await Event.findOne({ slug: trimmedSlug }).lean();

    // Handle case where event is not found
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${trimmedSlug}' not found.` },
        { status: 404 }
      );
    }

    // Return the found event
    return NextResponse.json(
      { message: "Event fetched successfully", event },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching event details by slug:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch event details",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
