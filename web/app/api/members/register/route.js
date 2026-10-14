import { db, schema } from "@/db";
import { fail, insertId, json, route } from "@/lib/server/http";
import { IMAGE_TYPES, checkUpload, saveUpload } from "@/lib/server/files";

const { members } = schema;
const IMAGE_MESSAGE = "Only JPG, PNG and WEBP images are allowed.";

// Public: the membership application form (multipart, with three photos)
export const POST = route(async (request) => {
    const form = await request.formData();
    const text = (name) => {
        const value = form.get(name);
        return typeof value === "string" ? value.trim() : "";
    };

    const fields = {
        fullName: text("fullName"),
        email: text("email"),
        phone: text("phone"),
        businessName: text("businessName"),
        businessSector: text("businessSector"),
        businessAddress: text("businessAddress"),
        businessDescription: text("businessDescription"),
        membershipType: text("membershipType"),
        businessCategory: text("businessCategory"),
        paymentMethod: text("paymentMethod")
    };
    const front = checkUpload(form.get("nationalIdFront"), IMAGE_TYPES, IMAGE_MESSAGE);
    const back = checkUpload(form.get("nationalIdBack"), IMAGE_TYPES, IMAGE_MESSAGE);
    const receipt = checkUpload(form.get("paymentReceipt"), IMAGE_TYPES, IMAGE_MESSAGE);

    if (Object.values(fields).some((value) => !value) || !front || !back || !receipt) {
        return fail(400, "Please fill in all required fields.");
    }

    let membershipFee;
    if (fields.membershipType === "member") {
        if (fields.businessCategory === "trader") membershipFee = 1000;
        else if (fields.businessCategory === "plc") membershipFee = 5000;
        else return fail(400, "Invalid business category.");
    } else if (fields.membershipType === "partnership") {
        membershipFee = 120;
    } else {
        return fail(400, "Invalid membership type.");
    }
    const membershipType = fields.membershipType === "member" ? "Member" : "Partnership";

    const [frontName, backName, receiptName] = [
        await saveUpload(front, "national-ids"),
        await saveUpload(back, "national-ids"),
        await saveUpload(receipt, "payment-receipts")
    ];

    let result;
    try {
        result = await db
            .insert(members)
            .values({
                full_name: fields.fullName,
                email: fields.email,
                phone: fields.phone,
                national_id: null,
                national_id_front: frontName,
                national_id_back: backName,
                tin_number: text("tin") || null,
                business_name: fields.businessName,
                business_type: fields.businessSector,
                business_category: fields.businessCategory,
                address: fields.businessAddress,
                business_description: fields.businessDescription,
                membership_type: membershipType,
                membership_fee: String(membershipFee),
                payment_status: "Pending",
                payment_method: fields.paymentMethod,
                payment_receipt: receiptName
            })
            .returning({ id: members.id });
    } catch (error) {
        if ((error.cause ?? error).code === "23505") {
            return fail(409, "This National ID is already registered.");
        }
        throw error;
    }

    return json(
        {
            success: true,
            message: "Membership application submitted successfully!",
            member_id: insertId(result),
            membership_type: membershipType,
            membership_fee: membershipFee,
            payment_status: "Pending",
            status: "Pending"
        },
        201
    );
});
