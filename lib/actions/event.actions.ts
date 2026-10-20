"use server";

import connectToDatabase from "@/lib/mongodb";
import Event, {IEvent} from "@/database/event.model";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectToDatabase();
        const event = await Event.findOne({ slug }).lean();

        if (!event) return [];

        const similarEvents = await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags },
        }).lean();

        return similarEvents.map((item) => ({
            ...item,
            _id: item._id.toString(),
            createdAt: item.createdAt?.toISOString(),
            updatedAt: item.updatedAt?.toISOString(),
        }));
    } catch {
        return [];
    }
}