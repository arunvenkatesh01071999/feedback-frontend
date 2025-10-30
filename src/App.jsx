import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import FeedbackList from './components/FeedbackList';
import AddFeedback from './components/AddFeedback';
import { useSelector } from 'react-redux';


function AppContent() {
  const { token } = useSelector(state => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route 
            path="/login" 
            element={!token ? <Login /> : <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!token ? <Register /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={token ? <FeedbackList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/add-feedback" 
            element={token ? <AddFeedback /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;