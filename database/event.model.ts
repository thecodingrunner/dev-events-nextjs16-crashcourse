import { Document, Model, Schema, models, model } from "mongoose";

/**
 * Interface representing the Event document structure for TypeScript type safety.
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Helper function to generate a URL-friendly slug from a title string.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "") // Remove non-alphanumeric characters preserving Unicode letters and digits
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens
}

/**
 * Helper function to validate and normalize a date string to ISO format (YYYY-MM-DD).
 * Verifies that the input's calendar components match the parsed date to reject impossible dates (e.g. February 30).
 */
function normalizeAndValidateDate(dateInput: string): string {
  const trimmed = dateInput.trim();
  if (!trimmed) {
    throw new Error("Date must not be empty.");
  }

  // Check ISO format YYYY-MM-DD (optionally with time component)
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() + 1 !== month ||
      date.getUTCDate() !== day
    ) {
      throw new Error(`Invalid calendar date: ${dateInput}. Please provide a valid calendar date.`);
    }
    return date.toISOString().split("T")[0];
  }

  // Check MM/DD/YYYY or M/D/YYYY format
  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashMatch) {
    const month = parseInt(slashMatch[1], 10);
    const day = parseInt(slashMatch[2], 10);
    const year = parseInt(slashMatch[3], 10);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() + 1 !== month ||
      date.getUTCDate() !== day
    ) {
      throw new Error(`Invalid calendar date: ${dateInput}. Please provide a valid calendar date.`);
    }
    return date.toISOString().split("T")[0];
  }

  // Check month names (e.g. 'October 22, 2026' or '22 October 2026')
  const monthNames: Record<string, number> = {
    jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3,
    apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7,
    aug: 8, august: 8, sep: 9, september: 9, oct: 10, october: 10,
    nov: 11, november: 11, dec: 12, december: 12,
  };
  const monthMatch = trimmed.match(
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/i
  );
  const yearMatch = trimmed.match(/\b(\d{4})\b/);
  const dayMatch = trimmed.replace(/\b\d{4}\b/, "").match(/\b(\d{1,2})(?:st|nd|rd|th)?\b/);

  if (monthMatch && yearMatch && dayMatch) {
    const month = monthNames[monthMatch[1].toLowerCase()];
    const year = parseInt(yearMatch[1], 10);
    const day = parseInt(dayMatch[1], 10);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() + 1 !== month ||
      date.getUTCDate() !== day
    ) {
      throw new Error(`Invalid calendar date: ${dateInput}. Please provide a valid calendar date.`);
    }
    return date.toISOString().split("T")[0];
  }

  // Fallback to standard Date parsing
  const parsedDate = new Date(trimmed);
  if (isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date format: ${dateInput}. Must be a valid date string.`);
  }

  return parsedDate.toISOString().split("T")[0];
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      trim: true,
    },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      trim: true,
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (items: string[]) => Array.isArray(items) && items.length > 0,
        message: "Agenda must contain at least one item",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (items: string[]) => Array.isArray(items) && items.length > 0,
        message: "Tags must contain at least one tag",
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook:
 * 1. Auto-generates and updates slug when title is modified.
 * 2. Validates and normalizes date into ISO format (YYYY-MM-DD or ISO string).
 * 3. Normalizes and validates time format.
 */
EventSchema.pre<IEvent>("save", function (this: IEvent) {
  // Regenerate slug only if the title field has changed
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }

  // Ensure slug is not empty before saving
  if (!this.slug) {
    throw new Error("Failed to generate a valid slug from the event title.");
  }

  // Validate and normalize date to ISO format (YYYY-MM-DD)
  if (this.isModified("date")) {
    this.date = normalizeAndValidateDate(this.date);
  }

  // Normalize time string by trimming extra whitespace
  if (this.isModified("time")) {
    const trimmedTime = this.time.trim();
    if (!trimmedTime) {
      throw new Error("Time must not be empty.");
    }
    this.time = trimmedTime;
  }
});

// Cache the compiled model to avoid re-compilation in Next.js development server
export const Event: Model<IEvent> =
  (models.Event as Model<IEvent>) || model<IEvent>("Event", EventSchema);

export default Event;
