import { Document, Model, Schema, Types, models, model } from "mongoose";
import { Event } from "./event.model";

/**
 * Interface representing the Booking document structure for TypeScript type safety.
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Regular expression for standard email format validation.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => EMAIL_REGEX.test(email),
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook:
 * Verifies that the referenced eventId corresponds to an existing Event record.
 */
BookingSchema.pre<IBooking>("save", async function (this: IBooking) {
  // Only check event existence if eventId was provided or modified
  if (this.isModified("eventId")) {
    const eventExists = await Event.findById(this.eventId);
    if (!eventExists) {
      throw new Error(`Referenced Event with ID ${this.eventId} does not exist.`);
    }
  }
});

// Cache the compiled model to avoid re-compilation in Next.js development server
export const Booking: Model<IBooking> =
  (models.Booking as Model<IBooking>) || model<IBooking>("Booking", BookingSchema);

export default Booking;
