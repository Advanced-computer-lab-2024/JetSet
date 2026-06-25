import React from 'react';

/**
 * LoadingSkeleton — shimmer placeholder for loading states.
 * @param {'card'|'table'|'profile'|'text'} type  Layout variant
 * @param {number} count  How many skeleton items to render
 */
function LoadingSkeleton({ type = 'text', count = 1 }) {
  const items = Array.from({ length: count }, (_, i) => i);

  switch (type) {
    case 'card':
      return (
        <div className="card-grid">
          {items.map((i) => (
            <div key={i} className="card" style={{ padding: '1.5rem' }}>
              <div className="skeleton skeleton-image" style={{ marginBottom: '1rem' }} />
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" />
            </div>
          ))}
        </div>
      );

    case 'table':
      return (
        <div className="table-container">
          {items.map((i) => (
            <div key={i} className="skeleton-row">
              <div className="skeleton skeleton-cell" />
              <div className="skeleton skeleton-cell" style={{ flex: 2 }} />
              <div className="skeleton skeleton-cell" />
              <div className="skeleton skeleton-cell" style={{ flex: 0.5 }} />
            </div>
          ))}
        </div>
      );

    case 'profile':
      return (
        <div className="flex gap-md items-center" style={{ padding: '1.5rem' }}>
          <div className="skeleton skeleton-avatar" />
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-title" style={{ width: '40%' }} />
            <div className="skeleton skeleton-text" style={{ width: '65%' }} />
          </div>
        </div>
      );

    case 'text':
    default:
      return (
        <div style={{ padding: '1rem 0' }}>
          {items.map((i) => (
            <React.Fragment key={i}>
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" style={{ width: '75%' }} />
              {i < items.length - 1 && <div style={{ marginBottom: '1.5rem' }} />}
            </React.Fragment>
          ))}
        </div>
      );
  }
}

export default LoadingSkeleton;
