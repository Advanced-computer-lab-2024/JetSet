import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';

/**
 * EmptyState — placeholder when there's no data to display.
 * @param {import('@fortawesome/fontawesome-svg-core').IconDefinition} icon  FontAwesome icon (default: faInbox)
 * @param {string} title        Heading text
 * @param {string} description  Subtext
 * @param {string} actionLabel  Optional CTA button label
 * @param {function} onAction   CTA click handler
 */
function EmptyState({
  icon = faInbox,
  title = 'Nothing here yet',
  description = '',
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state fade-in">
      <div className="empty-state-icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
