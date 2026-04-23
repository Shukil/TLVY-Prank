import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './VideoPage.css';

function FormPage() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('https://tlvy-prank-1.onrender.com/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <div className="main-wrapper" dir="rtl">
      <div className="container">

        <img src="/maccabi.png" alt="Maccabi" className="header-logo" />
        <h1>הנפקת ויזת תייר לתל אביב</h1>
        <p className="subtitle">מערכת הרישום הרשמית של עיריית תל אביב. האישור יישלח לכתובת המייל המצורפת.</p>

        {status === 'success' ? (
          <div className="success-message">
            <div className="success-header">
              <span className="check-icon">✓</span>
              <h3>הבקשה התקבלה בהצלחה!</h3>
            </div>
            <p className="success-text">הבקשה בבחינת דור פרץ-ראש העיר שלך</p>
            <button onClick={() => setStatus('idle')}>שלח בקשה נוספת</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-container">

            <div className="input-group">
              <label>שם מלא:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="הכנס שם מלא"
              />
            </div>

            <div className="input-group">
              <label>כתובת אימייל:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="כתובת אימייל תקינה"
              />
            </div>

            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'מעבד נתונים...' : 'הנפק אישור כניסה'}
            </button>

            {status === 'error' && (
              <p className="error-message">שגיאת תקשורת עם השרת. ודא שהשרת ב-Render רץ.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

function VideoPage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  const handleStart = () => {
    setIsLoading(true);

    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current.pause();
      }).catch(err => console.log(err));
    }

    setTimeout(() => {
      window.alert("תל אביב צהובה\nתשתחוו יבני זונות");

      setHasStarted(true);

      if (audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.currentTime = 174;
        audioRef.current.play();
      }
    }, 2000);
  };

  return (
    <div className="video-page-wrapper" dir="rtl">

      {hasStarted && (
        <>
          <img src="/bg-image.jpg" alt="Background" className="background-image" />
          <div className="video-overlay"></div>
        </>
      )}

      <audio ref={audioRef} loop preload="auto">
        <source src="/song.mp3" type="audio/mpeg" />
      </audio>

      {!hasStarted ? (
        <div className="start-screen">
          <img src="/maccabi.png" alt="Maccabi" className="video-logo" />
          <h1>הבקשה אושרה בהצלחה!</h1>
          <p>ראש העיר דור פרץ אישר את הבקשה. לחץ על הכפתור להצגת אישור הכניסה הרשמי שלך לתל אביב.</p>

          <button
            onClick={handleStart}
            className="start-button"
            disabled={isLoading}
          >
            {isLoading ? 'מאמת נתונים מול השרת...' : 'הצג אישור כניסה'}
          </button>
        </div>
      ) : (
        <div className="karaoke-container">
          <h1 className="karaoke-text">
            אני מכבי<br />מי אתם בכלל!
          </h1>
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
