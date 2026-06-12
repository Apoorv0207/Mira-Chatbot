export default function SkeletonCard() {
  return (
    <div className="property-card skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="card-body">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line medium" />
        <div className="skeleton-meta">
          <div className="skeleton skeleton-badge" />
          <div className="skeleton skeleton-badge" />
          <div className="skeleton skeleton-badge" />
        </div>
        <div className="skeleton skeleton-btn" />
      </div>
    </div>
  );
}
