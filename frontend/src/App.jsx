import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

// --- קומפוננטת הטופס (דף הבית) ---
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
        setMessage('הבקשה אושרה! בדוק את המייל שלך לאישור הרשמי.');
        setFormData({ fullName: '', email: '' });
      }
    } catch (error) {
      setMessage('שגיאה בתקשורת עם השרת.');
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
            <label>כתובת אימייל:</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'מעבד...' : 'הנפק אישור כניסה'}</button>
        </form>
        {message && <p className="status-message success">{message}</p>}
      </div>
    </div>
  );
}

// --- קומפוננטת המתיחה (דף האישור) ---
function VideoPage() {
  return (
    <div className="prank-container">
      <div className="maccabi-overlay">
        <h1>חחחח נראה לך?!</h1>
        <h2>תל אביב צהובה! 💛💙</h2>
        <div className="maccabi-colors"></div>
      </div>
      {/* כאן אפשר להוסיף וידאו מיוטיוב של קהל/שירים */}
      <iframe 
        width="0" height="0" 
        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
        frameBorder="0" allow="autoplay">
      </iframe>
    </div>
  );
}

// --- הקומפוננטה הראשית עם הניתוב ---
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