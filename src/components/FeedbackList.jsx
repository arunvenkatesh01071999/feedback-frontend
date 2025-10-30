import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedbacks, setFilter, upvoteFeedback, clearError } from '../store/slices/feedbackSlice';
import FeedbackItem from './FeedbackItem';
import StatusFilter from './StatusFilter';

const FeedbackList = () => {
  const dispatch = useDispatch();
  const { feedbacks, filteredFeedbacks, isLoading, filters, error } = useSelector(state => state.feedback);

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleUpvote = async (feedbackId) => {
    console.log('Upvoting feedback with ID:', feedbackId);
    
    if (!feedbackId || feedbackId === 'undefined') {
      console.error('Invalid feedback ID:', feedbackId);
      throw new Error('Invalid feedback ID');
    }
    
    dispatch(clearError());
    
    const result = await dispatch(upvoteFeedback(feedbackId));
    
    if (upvoteFeedback.rejected.match(result)) {
      throw new Error(result.payload?.message || 'Failed to upvote');
    }
    
    return result;
  };

  const handleFilterChange = (status) => {
    console.log('Changing filter to:', status);
    dispatch(setFilter(status));
  };

  const displayFeedbacks = Array.isArray(filteredFeedbacks) ? filteredFeedbacks : [];

  console.log('Feedbacks data:', displayFeedbacks);
  console.log('Current filter:', filters.status);

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 text-center" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted fw-medium">Loading feedback...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-light py-4 mb-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-9">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                <div>
                  <h2 className="mb-1 fw-bold text-dark">
                    <i className="bi bi-collection text-primary me-2"></i>
                    Feedback Dashboard
                  </h2>
                  <p className="text-muted mb-0 small">
                    <i className="bi bi-info-circle me-1"></i>
                    {displayFeedbacks.length} {displayFeedbacks.length === 1 ? 'item' : 'items'} found
                  </p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                    <i className="bi bi-funnel me-1"></i>
                    Filter Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-9">
            {error && (
              <div className="alert alert-danger alert-dismissible fade show border-0 shadow-sm mb-4" role="alert">
                <div className="d-flex align-items-start">
                  <i className="bi bi-exclamation-triangle-fill text-danger me-3 fs-4"></i>
                  <div className="flex-grow-1">
                    <h6 className="alert-heading mb-1 fw-bold">Oops! Something went wrong</h6>
                    <p className="mb-0">{error.message}</p>
                  </div>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => dispatch(clearError())}
                    aria-label="Close"
                  ></button>
                </div>
              </div>
            )}

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <StatusFilter currentFilter={filters.status} onFilterChange={handleFilterChange} />
              </div>
            </div>

            <div className="feedback-list-container">
              {displayFeedbacks.length === 0 ? (
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center py-5">
                    <div className="mb-4">
                      <i className="bi bi-inbox text-muted" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
                    </div>
                    <h4 className="text-muted fw-semibold mb-2">No Feedback Found</h4>
                    <p className="text-muted mb-4">
                      {filters.status === 'All' 
                        ? "There are no feedback items yet. Be the first to add one!" 
                        : `No feedback items with status "${filters.status}". Try a different filter.`}
                    </p>
                    {filters.status !== 'All' && (
                      <button 
                        className="btn btn-primary btn-sm rounded-pill px-4"
                        onClick={() => handleFilterChange('All')}
                      >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Clear Filter
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="row g-3">
                  {displayFeedbacks.map(feedback => (
                    <div key={feedback.id || feedback._id} className="col-12">
                      <FeedbackItem
                        feedback={feedback}
                        onUpvote={handleUpvote}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {displayFeedbacks.length > 0 && (
              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted small mb-0">
                  <i className="bi bi-check-circle me-1"></i>
                  Showing {displayFeedbacks.length} of {feedbacks.length} total feedback items
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .feedback-list-container {
          animation: fadeIn 0.4s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card {
          transition: all 0.3s ease;
        }

        .alert {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .spinner-border {
          border-width: 0.3rem;
        }

        @media (max-width: 767.98px) {
          .bg-light {
            padding: 1.5rem 0 !important;
          }
        }
      `}</style>
    </>
  );
};

export default FeedbackList;