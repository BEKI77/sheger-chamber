// Read form fields by element id. Text values are trimmed, like the old pages did.
export function readFields(form, ids) {
    const values = {};
    for (const [key, id] of Object.entries(ids)) {
        const element = form.querySelector(`#${id}`);
        const value = element ? element.value : "";
        values[key] = element && element.tagName !== "SELECT" ? value.trim() : value;
    }
    return values;
}

// Fill form fields by element id, e.g. when opening the edit panel.
export function fillFields(form, values) {
    for (const [id, value] of Object.entries(values)) {
        const element = form.querySelector(`#${id}`);
        if (element) element.value = value ?? "";
    }
}

// Date from the API (ISO or "YYYY-MM-DD...") as "YYYY-MM-DD" for <input type="date">
export function dateInputValue(value) {
    return value ? String(value).split("T")[0] : "";
}
