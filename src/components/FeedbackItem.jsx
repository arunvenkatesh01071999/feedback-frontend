import React, { useState } from 'react';

const FeedbackItem = ({ feedback, onUpvote }) => {
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const feedbackId = feedback.id || feedback._id;
  
  const getStatusVariant = (status) => {
    switch (status) {
      case 'Planned':
        return 'bg-primary';
      case 'In Progress':
        return 'bg-warning';
      case 'Completed':
        return 'bg-success';
      case 'Rejected':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const handleUpvoteClick = async () => {
    if (!feedbackId || isUpvoting) return;

    setIsUpvoting(true);
    setLocalError('');

    try {
      await onUpvote(feedbackId);
    } catch (error) {
      setLocalError('Unable to upvote. You may have already voted for this feedback.');
      setTimeout(() => setLocalError(''), 3000);
    } finally {
      setIsUpvoting(false);
    }
  };

  const voteCount = feedback.votes || feedback.votes_count || 0;
  const userName = feedback.user?.name || feedback.author?.name || 'Anonymous';

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="card-title mb-0">{feedback.title}</h5>
          <span className={`badge ${getStatusVariant(feedback.status)}`}>
            {feedback.status}
          </span>
        </div>
        
        <p className="card-text text-muted mb-3">{feedback.description}</p>
        
        <div className="d-flex justify-content-between align-items-center">
          <button
            onClick={handleUpvoteClick}
            disabled={isUpvoting}
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
          >
            {isUpvoting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status"></span>
                <span>Voting...</span>
              </>
            ) : (
              <>
                <span>▲</span>
                <span>{voteCount}</span>
              </>
            )}
          </button>
          
          <div className="text-end">
            <small className="text-muted d-block">
              Posted by {userName}
            </small>
            {feedback.createdAt && (
              <small className="text-muted">
                {new Date(feedback.createdAt).toLocaleDateString()}
              </small>
            )}
          </div>
        </div>

        {localError && (
          <div className="alert alert-warning mt-2 mb-0 py-2" role="alert">
            <small>{localError}</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackItem;