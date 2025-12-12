import "./DashboardStats.css";

export default function DashboardStats({ stats }) {
  return (
    <div className="stats-grid">
      {stats.map((stat, idx) => (
        <div key={idx} className="stat-card" style={{ borderTopColor: stat.color }}>
          <div className="stat-header" style={{ color: stat.color }}>
            <span className="stat-label">{stat.label}</span>
          </div>
          <div className="stat-value" style={{ color: stat.color }}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}
