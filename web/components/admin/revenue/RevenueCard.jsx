export default function RevenueCard({ item }) {
    return (
        <div className="admin-revenue-card">
            <div className="admin-revenue-card-header">
                <div>
                    <span className="admin-revenue-type">{item.revenue_type}</span>
                    <h3>{item.description}</h3>
                </div>
                <strong className="admin-revenue-amount">{Number(item.amount).toLocaleString()} ETB</strong>
            </div>
            <div className="admin-revenue-card-body">
                <div>
                    <strong>Payer:</strong> {item.payer_name}
                </div>
                <div>
                    <strong>Payment:</strong> {item.payment_method}
                </div>
                <div>
                    <strong>Status:</strong> {item.payment_status}
                </div>
                <div>
                    <strong>Date:</strong> {item.payment_date || "Not provided"}
                </div>
            </div>
        </div>
    );
}
