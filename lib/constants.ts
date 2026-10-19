export interface EventItem {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

export const events: EventItem[] = [
    {
        title: "Next.js Conf 2026",
        image: "/images/event1.png",
        slug: "nextjs-conf-2026",
        location: "San Francisco, CA & Virtual",
        date: "October 22, 2026",
        time: "09:00 AM - 05:00 PM PST",
    },
    {
        title: "React Summit 2026",
        image: "/images/event2.png",
        slug: "react-summit-2026",
        location: "Amsterdam, Netherlands",
        date: "November 14, 2026",
        time: "10:00 AM - 06:00 PM CET",
    },
    {
        title: "HackMIT 2026",
        image: "/images/event3.png",
        slug: "hackmit-2026",
        location: "Cambridge, MA",
        date: "September 18-20, 2026",
        time: "08:00 AM - 08:00 PM EST",
    },
    {
        title: "AWS re:Invent 2026",
        image: "/images/event4.png",
        slug: "aws-reinvent-2026",
        location: "Las Vegas, NV",
        date: "December 01-05, 2026",
        time: "08:30 AM - 06:30 PM PST",
    },
    {
        title: "JSWorld Conference 2026",
        image: "/images/event5.png",
        slug: "jsworld-conference-2026",
        location: "Amsterdam, Netherlands & Online",
        date: "June 25, 2026",
        time: "09:30 AM - 05:30 PM CET",
    },
    {
        title: "Global AI Hackathon 2026",
        image: "/images/event6.png",
        slug: "global-ai-hackathon-2026",
        location: "Online / Virtual",
        date: "July 11-12, 2026",
        time: "24 Hours (Starts 12:00 PM UTC)",
    },
];
