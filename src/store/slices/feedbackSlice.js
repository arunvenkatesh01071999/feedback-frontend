import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { feedbackService } from '../../services/api';

const normalizeFeedback = (feedback) => ({
  ...feedback,
  id: feedback.id || feedback._id,
  votes: feedback.votes_count || feedback.votes || 0,
  status: feedback.status,
  user: feedback.author || feedback.user
});

export const fetchFeedbacks = createAsyncThunk(
  'feedback/fetchFeedbacks',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await feedbackService.getFeedbacks(filters);
      console.log('API Response:', response.data);
      
      let feedbacksArray = [];
      if (Array.isArray(response.data)) {
        feedbacksArray = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        feedbacksArray = response.data.data;
      } else if (response.data && Array.isArray(response.data.feedbacks)) {
        feedbacksArray = response.data.feedbacks;
      }
      
      const normalizedFeedbacks = feedbacksArray.map(normalizeFeedback);
      
      return normalizedFeedbacks;
    } catch (error) {
      console.error('Fetch feedbacks error:', error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createFeedback = createAsyncThunk(
  'feedback/createFeedback',
  async (feedbackData, { rejectWithValue }) => {
    try {
      const feedbackToSend = {
        ...feedbackData
      };
      
      const response = await feedbackService.createFeedback(feedbackToSend);
      return normalizeFeedback(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const upvoteFeedback = createAsyncThunk(
  'feedback/upvoteFeedback',
  async (feedbackId, { rejectWithValue }) => {
    try {
      console.log('Sending upvote for ID:', feedbackId);
      const response = await feedbackService.upvoteFeedback(feedbackId);
      console.log('Upvote response:', response.data);
      
      return normalizeFeedback(response.data);
    } catch (error) {
      console.error('Upvote error details:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          'You have already voted for this feedback';
      
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        feedbackId: feedbackId
      });
    }
  }
);

export const updateFeedbackStatus = createAsyncThunk(
  'feedback/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await feedbackService.updateFeedback(id, { status });
      return normalizeFeedback(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    feedbacks: [],
    filteredFeedbacks: [],
    isLoading: false,
    error: null,
    filters: {
      status: 'all',
    },
  },
  reducers: {
    setFilter: (state, action) => {
      state.filters.status = action.payload;
      if (action.payload === 'all') {
        state.filteredFeedbacks = [...state.feedbacks];
      } else {
        state.filteredFeedbacks = state.feedbacks.filter(
          feedback => feedback.status === action.payload
        );
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.isLoading = false;
        const feedbacksArray = Array.isArray(action.payload) ? action.payload : [];
        state.feedbacks = feedbacksArray;
        state.filteredFeedbacks = feedbacksArray;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.feedbacks = [];
        state.filteredFeedbacks = [];
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        if (action.payload) {
          state.feedbacks.push(action.payload);
          if (state.filters.status === 'all' || state.filters.status === action.payload.status) {
            state.filteredFeedbacks.push(action.payload);
          }
        }
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(upvoteFeedback.fulfilled, (state, action) => {
        if (action.payload && action.payload.id) {
          const index = state.feedbacks.findIndex(f => f.id === action.payload.id);
          if (index !== -1) {
            state.feedbacks[index] = action.payload;
          }
          const filteredIndex = state.filteredFeedbacks.findIndex(f => f.id === action.payload.id);
          if (filteredIndex !== -1) {
            state.filteredFeedbacks[filteredIndex] = action.payload;
          }
        }
      })
      .addCase(upvoteFeedback.rejected, (state, action) => {
        state.error = action.payload;
        console.error('Upvote failed in reducer:', action.payload);
      })
      .addCase(updateFeedbackStatus.fulfilled, (state, action) => {
        if (action.payload && action.payload.id) {
          const index = state.feedbacks.findIndex(f => f.id === action.payload.id);
          if (index !== -1) {
            state.feedbacks[index] = action.payload;
          }
          if (state.filters.status !== 'all' && state.filters.status !== action.payload.status) {
            state.filteredFeedbacks = state.filteredFeedbacks.filter(f => f.id !== action.payload.id);
          } else {
            const filteredIndex = state.filteredFeedbacks.findIndex(f => f.id === action.payload.id);
            if (filteredIndex !== -1) {
              state.filteredFeedbacks[filteredIndex] = action.payload;
            } else {
              state.filteredFeedbacks.push(action.payload);
            }
          }
        }
      })
      .addCase(updateFeedbackStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setFilter, clearError } = feedbackSlice.actions;
export default feedbackSlice.reducer;