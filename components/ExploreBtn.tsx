"use client";

import Image from "next/image";
import posthog from "posthog-js";

const ExploreBtn = () => {
    const handleExplore = () => {
        console.log("click");
        posthog.capture("events_explored", { source: "homepage_hero" });
    };

    return (
        <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={handleExplore}>
            <a href="#events">
                Explore Events
                <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} />
            </a>
        </button>
    )
}
export default ExploreBtn
