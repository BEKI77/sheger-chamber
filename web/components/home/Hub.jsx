import Events from "./Events";
import Expo from "./Expo";
import Jobs from "./Jobs";

// "What's on": events and expos next to opportunities and jobs
export default function Hub() {
    return (
        <section id="hub" className="sc-section sc-section-white">
            <div className="sc-container sc-hub">
                <div id="events" className="sc-hub-column">
                    <Events />
                    <Expo />
                </div>
                <div id="opportunities" className="sc-hub-column">
                    <Jobs />
                </div>
            </div>
        </section>
    );
}
