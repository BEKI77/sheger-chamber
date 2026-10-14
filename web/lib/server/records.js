// Turn API request bodies into database values (shared by create and update).
import "server-only";
import { clean } from "./http";

const EVENT_STATUSES = ["Upcoming", "Completed", "Cancelled"];

const dateOrNull = (value) => (value ? new Date(value) : null);

// Used by POST /api/news and PUT /api/news/[id]
export function newsValues(body) {
    const status = body.status === "Draft" ? "Draft" : "Published";
    return {
        title: String(body.title).trim(),
        category: String(body.category).trim(),
        image_url: clean(body.imageUrl),
        excerpt: clean(body.excerpt),
        content: String(body.content).trim(),
        author: clean(body.author),
        status,
        published_at: status === "Published" ? new Date() : null
    };
}

// Used by POST /api/events and PUT /api/events/[id]; returns null when required fields are missing
export function eventValues(body) {
    if (!body.title || !body.eventType || !body.eventDate) return null;
    return {
        title: body.title,
        event_type: body.eventType,
        description: body.description || null,
        event_date: dateOrNull(body.eventDate),
        event_time: body.eventTime || null,
        location: body.location || null,
        image_url: body.imageUrl || null,
        contact_email: body.contactEmail || null,
        contact_phone: body.contactPhone || null,
        status: EVENT_STATUSES.includes(body.status) ? body.status : "Upcoming"
    };
}

// Used by POST /api/expos and PUT /api/expos/[id]; returns null when required fields are missing
export function expoValues(body) {
    if (!body.title || !body.type || !body.description) return null;
    return {
        title: body.title,
        type: body.type,
        description: body.description,
        image_url: body.image_url || null,
        location: body.location || null,
        start_date: dateOrNull(body.start_date),
        end_date: dateOrNull(body.end_date),
        contact_email: body.contact_email || null,
        contact_phone: body.contact_phone || null,
        status: body.status || "Upcoming"
    };
}

// Used by POST /api/partnerships and PUT /api/partnerships/[id]; returns null when required fields are missing
export function partnershipValues(body) {
    if (!body.partner_name || !body.partner_type) return null;
    return {
        partner_name: body.partner_name,
        partner_type: body.partner_type,
        description: body.description || null,
        logo_url: body.logo_url || null,
        website_url: body.website_url || null,
        contact_email: body.contact_email || null,
        contact_phone: body.contact_phone || null,
        status: body.status || "Active"
    };
}
