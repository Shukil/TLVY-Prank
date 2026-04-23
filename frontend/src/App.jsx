import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
      } else {
        setMessage('השרת החזיר שגיאה. נסה שוב מאוחר יותר.');
      }
    } catch (error) {
      setMessage('שגיאה בתקשורת עם השרת.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-main" dir="rtl">
      <div className="form-content">
        <img src="/maccabi.png" alt="Logo" className="maccabi-logo" />
        <h1 className="title">הנפקת אשרת כניסה לתל אביב</h1>
        <p className="description">מערכת הרישום הרשמית של עיריית תל אביב-יפו.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>שם מלא:</label>
            <input 
              type="text" 
              value={formData.fullName} 
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
              required 
            />
          </div>
          <div className="input-group">
            <label>כתובת אימייל:</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'מעבד...' : 'הנפק אישור כניסה'}
          </button>
        </form>
        
        {message && (
          <p className={`status-message ${message.includes('בהצלחה') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// --- קומפוננטת המתיחה (דף האישור) ---
function VideoPage() {
  const [showPrank, setShowPrank] = useState(false);

  // המסך המזויף שלפני המתיחה (חובה כדי לאפשר ניגון אוטומטי של סאונד)
  if (!showPrank) {
    return (
      <div className="reveal-container" dir="rtl">
        <div className="reveal-card">
          <h2 style={{color: '#d9534f'}}>🔒 מסמך מאובטח</h2>
          <p>האישור שלך הונפק בהצלחה. מערכת האבטחה דורשת אישור ידני לפתיחת הקובץ.</p>
          <button onClick={() => setShowPrank(true)} className="reveal-btn">
            לחץ כאן להצגת אישור הכניסה
          </button>
        </div>
      </div>
    );
  }

  // המסך של המתיחה האמיתית!
  return (
    <div className="prank-container">
      <div className="maccabi-overlay">
        <img src="/maccabi.png" alt="Maccabi Logo" className="maccabi-logo-large" />
        <h1>חחחח נראה לך?!</h1>
        <h2>תל אביב צהובה! 💛💙</h2>
        <p>אין כניסה לעיר בלי חולצה צהובה.</p>
        
        {/* נגן השמע של השיר שלך */}
        <div className="audio-wrapper" style={{ marginTop: '30px', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#ffcc00' }}>🔊 מדליק רמקולים...</h3>
          {/* ודא שהשם פה תואם לשם הקובץ בתיקיית public */}
          <audio src="/msong.mp3" autoPlay loop controls style={{ width: '100%', maxWidth: '400px' }} />
        </div>
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