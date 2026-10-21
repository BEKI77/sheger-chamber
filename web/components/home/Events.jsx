"use client";

import { useState } from "react";
import { useApiList } from "@/lib/useApiList";
import EventCard from "./EventCard";

const PAGE_SIZE = 3;

export default function Events() {
    const { status, items } = useApiList("/api/events", "events");
    const [showAll, setShowAll] = useState(false);
    const upcomingEvents = items.filter((event) => event.status === "Upcoming");
    const visibleEvents = showAll ? upcomingEvents : upcomingEvents.slice(0, PAGE_SIZE);

    return (
        <div className="sc-hub-block">
            <div className="sc-hub-head">
                <h2>Upcoming events</h2>
                {upcomingEvents.length > PAGE_SIZE && (
                    <button type="button" className="sc-link" onClick={() => setShowAll((value) => !value)}>
                        {showAll ? "Show fewer" : `All ${upcomingEvents.length} events`}
                    </button>
                )}
            </div>

            {status === "loading" && (
                <p className="sc-empty">
                    <i className="fa-solid fa-spinner fa-spin"></i> Loading upcoming events...
                </p>
            )}
            {status === "error" && (
                <p className="sc-empty">
                    <i className="fa-solid fa-circle-exclamation"></i> Unable to load events at this time.
                </p>
            )}
            {status === "ready" && !upcomingEvents.length && (
                <p className="sc-empty">
                    <i className="fa-solid fa-calendar-xmark"></i> No upcoming events at the moment. New Chamber
                    events will be announced here.
                </p>
            )}
            {status === "ready" && visibleEvents.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
    );
}
