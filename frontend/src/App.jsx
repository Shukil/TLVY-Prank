import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// --- דף הטופס ---
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
        <img src="/maccabi.png" alt="Logo" className="logo" />
        <h1>הנפקת אשרת כניסה לתל אביב</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>שם מלא:</label>
            <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>מייל למשלוח האישור:</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'מעבד...' : 'הנפק אישור כניסה'}</button>
        </form>
        {message && <p className="status-message success">{message}</p>}
      </div>
    </div>
  );
}

// --- דף המתיחה ---
function VideoPage() {
  return (
    <div className="prank-container" style={{textAlign: 'center', padding: '50px', backgroundColor: '#00163f', color: '#ffcc00', height: '100vh'}}>
      <h1>חחחח נראה לך?! 😂</h1>
      <h2>תל אביב צהובה! 💛💙</h2>
      <div style={{marginTop: '30px'}}>
        <iframe width="100%" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
      </div>
      <h3 style={{marginTop: '20px'}}>יאללה מכבי!</h3>
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