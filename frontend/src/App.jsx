import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// --- קומפוננטת הטופס (המראה הלוקאלי המקורי והפשוט) ---
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
        setMessage('הבקשה אושרה! האישור נשלח לכתובת המייל המבוקשת.');
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
    <div dir="rtl" style={{ padding: '20px', fontFamily: 'Times New Roman, Arial, sans-serif' }}>
      <div style={{ textAlign: 'right' }}>
        <img src="/maccabi.png" alt="Maccabi Logo" style={{ width: '150px' }} />
      </div>
      
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginTop: '10px' }}>הנפקת אשרת כניסה לתל אביב</h1>
      
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'right' }}>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontWeight: 'bold' }}>שם מלא: </label>
            <input 
              type="text" 
              value={formData.fullName} 
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
              required 
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: 'bold' }}>כתובת אימייל (לשליחת האישור): </label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>
          
          <div style={{ textAlign: 'left' }}>
            <button type="submit" disabled={loading} style={{ padding: '5px 15px', cursor: 'pointer' }}>
              {loading ? 'מעבד...' : 'הנפק אישור כניסה'}
            </button>
          </div>
          
        </form>
        
        {message && (
          <p style={{ marginTop: '20px', color: message.includes('אושרה') ? 'green' : 'red', fontWeight: 'bold' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// --- קומפוננטת המתיחה (דף האישור - נשאר עם מסך האבטחה והשיר) ---
function VideoPage() {
  const [showPrank, setShowPrank] = useState(false);

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

  return (
    <div className="prank-container">
      <div className="maccabi-overlay">
        <img src="/maccabi.png" alt="Maccabi Logo" className="maccabi-logo-large" />
        <h1>חחחח נראה לך?!</h1>
        <h2>תל אביב צהובה! 💛💙</h2>
        <p>אין כניסה לעיר בלי חולצה צהובה.</p>
        
        <div className="audio-wrapper" style={{ marginTop: '30px', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#ffcc00' }}>🔊 מדליק רמקולים...</h3>
          <audio src="/maccabi-song.mp3" autoPlay loop controls style={{ width: '100%', maxWidth: '400px' }} />
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