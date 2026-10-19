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
    const parsedDate = new Date(this.date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date format: ${this.date}. Must be a valid date string.`);
    }
    // Store in normalized ISO date format YYYY-MM-DD
    this.date = parsedDate.toISOString().split("T")[0];
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
