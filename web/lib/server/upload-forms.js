// Which files each public form uploads, where they're stored, and what's allowed.
import "server-only";
import { CV_TYPES, IMAGE_TYPES } from "./files";

const IMAGE_MESSAGE = "Only JPG, PNG and WEBP images are allowed.";
const CV_MESSAGE = "Only PDF, DOC and DOCX CV files are allowed.";

export const UPLOAD_FORMS = {
    membership: {
        nationalIdFront: { folder: "national-ids", allowed: IMAGE_TYPES, typeMessage: IMAGE_MESSAGE },
        nationalIdBack: { folder: "national-ids", allowed: IMAGE_TYPES, typeMessage: IMAGE_MESSAGE },
        paymentReceipt: { folder: "payment-receipts", allowed: IMAGE_TYPES, typeMessage: IMAGE_MESSAGE }
    },
    "job-application": {
        cv: { folder: "job-applications", allowed: CV_TYPES, typeMessage: CV_MESSAGE }
    }
};
