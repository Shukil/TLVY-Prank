import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ fullName: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // *** שים לב: תחליף את הקישור למטה לקישור ה-RENDER שלך ***
      const response = await fetch('https://YOUR-SERVICE-NAME.onrender.com/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessage('הבקשה נשלחה בהצלחה! האישור יישלח למייל שלך תוך דקות.');
        setFormData({ fullName: '', email: '' });
      } else {
        setMessage('השרת החזיר שגיאה. נסה שוב.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('שגיאת תקשורת. ודא שהשרת ב-Render עובד (סטטוס LIVE).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" dir="rtl">
      <div className="form-card">
        <img src="/maccabi.png" alt="Maccabi Logo" className="logo" />
        <h1>הנפקת אשרת כניסה לתל אביב</h1>
        <p>מערכת הרישום הרשמית. האישור יישלח לכתובת המייל המצורפת.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>שם מלא:</label>
            <input 
              type="text" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              required 
              placeholder="הכנס שם מלא"
            />
          </div>
          <div className="input-group">
            <label>כתובת אימייל:</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="example@gmail.com"
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

export default App;