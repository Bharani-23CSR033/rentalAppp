import "./Skeleton.css";
export default function Skeleton({ height=20, width="100%", borderRadius=8 }) {
  return <div className="skeleton" style={{ height, width, borderRadius }} />;
}
