"use client";

import { useApiList } from "@/lib/useApiList";
import ExpoCard from "./ExpoCard";

export default function Expo() {
    const { status, items } = useApiList("/api/expos", "expos");
    const activeExpos = items.filter((expo) => expo.status === "Upcoming" || expo.status === "Ongoing");

    return (
        <div id="expo" className="sc-hub-block">
            <div className="sc-hub-head">
                <h2>Expos</h2>
            </div>

            {status === "loading" && (
                <p className="sc-empty">
                    <i className="fa-solid fa-spinner fa-spin"></i> Loading expos...
                </p>
            )}
            {status === "error" && (
                <p className="sc-empty">
                    <i className="fa-solid fa-circle-exclamation"></i> Unable to load Expo information at this time.
                </p>
            )}
            {status === "ready" && !activeExpos.length && (
                <p className="sc-empty">
                    <i className="fa-solid fa-calendar-xmark"></i> No upcoming expos at the moment. Contact the
                    Chamber to hear about the next National or International Expo.
                </p>
            )}
            {status === "ready" && activeExpos.map((expo) => <ExpoCard key={expo.id} expo={expo} />)}
        </div>
    );
}
