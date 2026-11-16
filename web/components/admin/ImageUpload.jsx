"use client";

import { useEffect, useRef, useState } from "react";
import { discardImage, uploadImage } from "@/lib/adminApi";
import styles from "./ImageUpload.module.css";

// Picture field for admin forms. Choosing a file uploads it to storage right
// away (see uploadImage) and keeps the resulting URL in a hidden input with
// the given `id`, so readFields / fillFields work with it like a text field.
// The form's reset clears it; submitting while an upload runs is blocked.
// Images uploaded here but then replaced, removed or reset are thrown away.
// That includes leaving the page without saving: closing the tab, reloading,
// or opening another admin page (the server keeps any image a saved record uses).
export default function ImageUpload({ id, name, label = "Image", folder, groupClassName = "admin-form-group" }) {
    const [url, setUrlState] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const hiddenRef = useRef(null);
    const fileRef = useRef(null);
    const uploadingRef = useRef(false);
    const urlRef = useRef("");
    // URLs uploaded by this field, which may not be saved with any record
    const uploadedRef = useRef(new Set());

    function setUrl(next) {
        const previous = urlRef.current;
        if (previous && previous !== next && uploadedRef.current.has(previous)) {
            uploadedRef.current.delete(previous);
            discardImage(previous);
        }
        urlRef.current = next;
        setUrlState(next);
    }

    useEffect(() => {
        const hidden = hiddenRef.current;
        const form = hidden?.form;
        const onSet = (event) => {
            setUrl(String(event.detail || ""));
            setError("");
        };
        const onReset = () => {
            setUrl("");
            setError("");
        };
        // Runs before React's onSubmit handler, which then never sees the event
        const onSubmit = (event) => {
            if (!uploadingRef.current) {
                // Being saved now: never discard it, even if the tab closes
                // before the save finishes (a failed save may leave it behind)
                uploadedRef.current.delete(urlRef.current);
                return;
            }
            event.preventDefault();
            event.stopImmediatePropagation();
            alert("Please wait for the image to finish uploading.");
        };
        // Leaving without saving (tab closed, reload, another site): throw
        // away unsaved uploads. keepalive lets the request outlive the tab.
        let discardedShown = false;
        const discardPending = () => {
            for (const pending of uploadedRef.current) {
                discardImage(pending);
                if (pending === urlRef.current) discardedShown = true;
            }
            uploadedRef.current.clear();
        };
        // Back button restored the page from the browser's cache: the image it
        // still shows was deleted, so ask for it again.
        const onPageShow = (event) => {
            if (!event.persisted || !discardedShown) return;
            discardedShown = false;
            urlRef.current = "";
            setUrlState("");
            setError("The image was removed when you left the page. Please choose it again.");
        };
        hidden?.addEventListener("imageupload:set", onSet);
        form?.addEventListener("reset", onReset);
        form?.addEventListener("submit", onSubmit, true);
        window.addEventListener("pagehide", discardPending);
        window.addEventListener("pageshow", onPageShow);
        return () => {
            hidden?.removeEventListener("imageupload:set", onSet);
            form?.removeEventListener("reset", onReset);
            form?.removeEventListener("submit", onSubmit, true);
            window.removeEventListener("pagehide", discardPending);
            window.removeEventListener("pageshow", onPageShow);
            // Moving to another admin page inside the app also counts as leaving
            discardPending();
        };
    }, []);

    async function handleFile(event) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        setError("");
        setUploading(true);
        uploadingRef.current = true;
        try {
            const uploaded = await uploadImage(file, folder);
            uploadedRef.current.add(uploaded);
            setUrl(uploaded);
        } catch (uploadError) {
            console.error("Image upload error:", uploadError);
            setError(uploadError.message || "Could not upload the image.");
        } finally {
            setUploading(false);
            uploadingRef.current = false;
        }
    }

    return (
        <div className={groupClassName}>
            <label htmlFor={`${id}File`}>{label}</label>
            <input type="hidden" id={id} name={name} value={url} data-image-upload="" ref={hiddenRef} readOnly />
            <div className={styles.box}>
                {url ? (
                    <img src={url} alt="" className={styles.preview} />
                ) : (
                    <div className={styles.placeholder}>
                        <i className="fas fa-image"></i>
                    </div>
                )}
                <div className={styles.controls}>
                    <input
                        type="file"
                        id={`${id}File`}
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFile}
                        ref={fileRef}
                        disabled={uploading}
                        className={styles.file}
                    />
                    <div className={styles.buttons}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => fileRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Uploading...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-upload"></i> {url ? "Replace image" : "Choose image"}
                                </>
                            )}
                        </button>
                        {url && !uploading && (
                            <button type="button" className="btn btn-secondary" onClick={() => setUrl("")}>
                                <i className="fas fa-trash"></i> Remove
                            </button>
                        )}
                    </div>
                    <small>JPG, PNG or WEBP, up to 5 MB.</small>
                    {error && <small className={styles.error}>{error}</small>}
                </div>
            </div>
        </div>
    );
}
