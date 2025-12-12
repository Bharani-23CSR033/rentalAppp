import "./RequestCard.css";

export default function RequestCard({ request, onAccept, onReject }) {
  // request: { _id, userId: { _id, name, email }, status, createdAt }
  const user = request.userId || request.user; // depends on backend populate
  return (
    <div className="request-card glass fade-in">
      <div className="request-left">
        <div className="avatar">{(user?.name || "U").slice(0,1)}</div>
        <div>
          <h4>{user?.name || "Unknown"}</h4>
          <p className="small">{user?.email || ""}</p>
          <p className="small muted">{new Date(request.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="request-actions">
        <span className={`status ${request.status}`}>{request.status}</span>
        {request.status === "pending" && (
          <>
            <button className="accept" onClick={() => onAccept(request)}>Accept</button>
            <button className="reject" onClick={() => onReject(request)}>Reject</button>
          </>
        )}
      </div>
    </div>
  );
}
