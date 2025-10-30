import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createFeedback } from '../store/slices/feedbackSlice';

const AddFeedback = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Planned', 
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector(state => state.feedback);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createFeedback(formData))
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch(error => {
        console.error('Failed to create feedback:', error);
      });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="text-center mb-4">
            <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style={{width: '70px', height: '70px'}}>
              <i className="bi bi-chat-square-text text-white fs-3"></i>
            </div>
            <h1 className="h2 fw-bold text-dark">Share Your Feedback</h1>
            <p className="text-muted">Help us improve by sharing your ideas and suggestions</p>
          </div>

          <div className="card shadow border-0">
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label fw-semibold fs-5">
                    <i className="bi bi-pencil-square text-primary me-2"></i>
                    Feedback Title
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Add dark mode to improve user experience"
                  />
                  <div className="form-text">
                    Choose a clear and descriptive title for your feedback
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-semibold fs-5">
                    <i className="bi bi-text-paragraph text-primary me-2"></i>
                    Detailed Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Please provide detailed information about your suggestion..."
                  />
                  <div className="form-text">
                    The more details you provide, the better we can understand your needs
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="status" className="form-label fw-semibold fs-5">
                    <i className="bi bi-tag text-primary me-2"></i>
                    Status
                  </label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Planned">📋 Planned</option>
                    <option value="In Progress">🚧 In Progress</option>
                    <option value="Completed">✅ Completed</option>
                    <option value="Rejected">❌ Rejected</option>
                  </select>
                  <div className="form-text">
                    Select the current status of this feedback item
                  </div>
                </div>

                <div className="d-grid gap-3 d-md-flex justify-content-md-end mt-5">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="btn btn-outline-secondary btn-lg px-4 me-md-2"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary btn-lg px-4"
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Submit Feedback
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFeedback;