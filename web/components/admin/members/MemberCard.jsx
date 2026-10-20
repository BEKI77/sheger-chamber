import { fileName } from "@/lib/adminApi";

// One membership application. `onAction(kind, member)` handles the buttons.
export default function MemberCard({ member, hidden, onAction }) {
    const front = fileName(member.national_id_front);
    const back = fileName(member.national_id_back);
    const receipt = fileName(member.payment_receipt);

    return (
        <div
            className="admin-member-card"
            data-member-status={member.status || ""}
            data-member-type={member.membership_type || ""}
            data-member-payment={member.payment_status || ""}
            style={hidden ? { display: "none" } : undefined}
        >
            <div className="admin-member-card-header">
                <div>
                    <span className="member-status">{member.status}</span>
                    <h3>{member.full_name}</h3>
                </div>
                <span className="member-type">{member.membership_type}</span>
            </div>

            <div className="admin-member-actions">
                {member.status === "Pending" && (
                    <>
                        <button
                            type="button"
                            className="approve-member-button"
                            onClick={() => onAction("approve", member)}
                        >
                            <i className="fas fa-check"></i> Approve
                        </button>{" "}
                        <button
                            type="button"
                            className="reject-member-button"
                            onClick={() => onAction("reject", member)}
                        >
                            <i className="fas fa-times"></i> Reject
                        </button>{" "}
                    </>
                )}
                <button type="button" className="delete-member-button" onClick={() => onAction("delete", member)}>
                    <i className="fas fa-trash"></i> Delete
                </button>
            </div>

            <div className="admin-member-info">
                <p>
                    <strong>Email:</strong> {member.email}
                </p>
                <p>
                    <strong>Phone:</strong> {member.phone}
                </p>
                <p>
                    <strong>Business:</strong> {member.business_name}
                </p>
                <p>
                    <strong>Sector:</strong> {member.business_type}
                </p>
                <p>
                    <strong>Business Type:</strong> {member.business_category || "-"}
                </p>
                <p>
                    <strong>Fee:</strong> {Number(member.membership_fee).toLocaleString()} ETB
                </p>
                <p>
                    <strong>Payment Method:</strong> {member.payment_method || "-"}
                </p>
                <p>
                    <strong>Payment Status:</strong> {member.payment_status}
                </p>

                {member.payment_status === "Pending" && (
                    <div className="admin-payment-actions">
                        <button
                            type="button"
                            className="verify-payment-button"
                            onClick={() => onAction("verify", member)}
                        >
                            <i className="fas fa-check-circle"></i> Verify Payment
                        </button>{" "}
                        <button
                            type="button"
                            className="failed-payment-button"
                            onClick={() => onAction("fail", member)}
                        >
                            <i className="fas fa-times-circle"></i> Mark Failed
                        </button>
                    </div>
                )}

                <div className="member-id-section">
                    <h4>
                        <i className="fas fa-id-card"></i> National ID
                    </h4>
                    <div className="member-id-images">
                        <div className="member-id-image-box">
                            <h5>Front</h5>
                            <img src={`/api/members/id-image/${encodeURIComponent(front)}`} />
                        </div>
                        <div className="member-id-image-box">
                            <h5>Back</h5>
                            <img src={`/api/members/id-image/${encodeURIComponent(back)}`} />
                        </div>
                    </div>
                </div>

                <div className="member-id-section">
                    <h4>
                        <i className="fas fa-receipt"></i> Payment Receipt
                    </h4>
                    <div className="member-id-images">
                        <div className="member-id-image-box">
                            <h5>Receipt</h5>
                            {receipt ? (
                                <img src={`/api/members/payment-receipt/${encodeURIComponent(receipt)}`} />
                            ) : (
                                <p>No payment receipt uploaded.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// The words a search can match: everything shown on the card
export function memberSearchText(member) {
    return [
        member.status,
        member.full_name,
        member.membership_type,
        member.email,
        member.phone,
        member.business_name,
        member.business_type,
        member.business_category,
        member.payment_method,
        member.payment_status,
        Number(member.membership_fee).toLocaleString(),
        "ETB"
    ]
        .join(" ")
        .toLowerCase();
}
