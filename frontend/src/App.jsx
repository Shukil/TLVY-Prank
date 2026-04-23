import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// --- דף הבית (הטופס) ---
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
      setMessage('שגיאת תקשורת. ודא שהשרת ב-Render רץ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" dir="rtl">
      <div className="form-card">
        <div className="logo-placeholder">🏙️</div>
        <h1>הנפקת אשרת כניסה לתל אביב</h1>
        <p className="subtitle">מערכת רישום תושבי חוץ - עיריית תל אביב-יפו</p>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="שם מלא" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
          <input type="email" placeholder="כתובת אימייל" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'מעבד...' : 'הנפק אישור כניסה'}</button>
        </form>
        {message && <p className="status-message">{message}</p>}
      </div>
    </div>
  );
}

// --- דף המתיחה המשופר ---
function VideoPage() {
  const [isPrankActive, setIsPrankActive] = useState(false);

  return (
    <div className={`prank-page ${isPrankActive ? 'party-mode' : 'official-mode'}`} dir="rtl">
      {!isPrankActive ? (
        <div className="official-check-card">
          <div className="check-icon">✔️</div>
          <h1>אישור הכניסה הונפק!</h1>
          <p>מספר אישור: {Math.floor(Math.random() * 900000 + 100000)}</p>
          <div className="details-box">
            <p><strong>סטטוס:</strong> מאושר</p>
            <p><strong>תוקף:</strong> 72 שעות</p>
          </div>
          <button className="download-btn" onClick={() => setIsPrankActive(true)}>
             להורדת האישור (PDF) לחץ כאן
          </button>
        </div>
      ) : (
        <div className="maccabi-madness">
          <h1 className="flash-text">חחחח נראה לך?! 😂</h1>
          <h2 className="flash-text-blue">תל אביב צהובה! 💛💙</h2>
          <div className="video-wrapper">
            <iframe 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0" 
              title="Maccabi"
              frameBorder="0" 
              allow="autoplay; encrypted-media" 
              allowFullScreen>
            </iframe>
          </div>
          <div className="scrolling-text">
            <span>יאללה מכבי! יאללה מכבי! יאללה מכבי!</span>
          </div>
        </div>
      )}
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