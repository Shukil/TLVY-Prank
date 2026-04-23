import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import VideoPage from './VideoPage';
import './App.css';

// דף הטופס הראשי
function FormPage() {
  const [formData, setFormData] = useState({ fullName: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://tlvy-prank-1.onrender.com/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('הבקשה אושרה! האישור הרשמי נשלח למייל שלך.');
        setFormData({ fullName: '', email: '' });
      }
    } catch (error) {
      setMessage('שגיאת תקשורת. ודא שהשרת רץ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" dir="rtl">
      <div className="form-card">
        <img src="/maccabi.png" alt="Logo" className="logo" />
        <h1>הנפקת אשרת כניסה לתל אביב</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>שם מלא:</label>
            <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>כתובת אימייל (לשליחת האישור):</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'מעבד...' : 'הנפק אישור כניסה'}</button>
        </form>
        {message && <p className="status-message success">{message}</p>}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/video-page" element={<VideoPage />} />
      </Routes>
    </Router>
  );
}