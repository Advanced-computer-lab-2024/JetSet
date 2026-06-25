import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

function NotFoundPage() {
  return (
    <div className="not-found-page fade-in">
      <div>
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Page not found</h1>
        <p className="not-found-description">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          <FontAwesomeIcon icon={faHome} />
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
