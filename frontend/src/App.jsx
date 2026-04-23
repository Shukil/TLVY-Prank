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
      // שים לב: כאן החלפתי את localhost בכתובת של Render שלך!
      // ודא שזו הכתובת המדויקת שמופיעה לך ב-Render Dashboard
      const response = await fetch('https://tlvy-backend.onrender.com/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('הבקשה נשלחה בהצלחה! בדוק את תיבת המייל שלך (וגם בספאם) לאישור הרשמי.');
        setFormData({ fullName: '', email: '' }); // איפוס הטופס
      } else {
        setMessage('אירעה שגיאה בשליחת הבקשה. נסה שוב מאוחר יותר.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('שגיאת תקשורת עם השרת. ודא שהשרת ב-Render רץ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" dir="rtl">
      <div className="form-card">
        <img src="/maccabi.png" alt="Maccabi Logo" className="logo" />
        <h1>הנפקת אשרת כניסה לתל אביב</h1>
        <p>מערכת הרישום הרשמית של עיריית תל אביב. האישור יישלח לכתובת המייל המצורפת.</p>
        
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
            {loading ? 'מעבד בקשה במערכת...' : 'הנפק אישור כניסה'}
          </button>
        </form>
        
        {message && <p className={`status-message ${message.includes('בהצלחה') ? 'success' : 'error'}`}>{message}</p>}
      </div>
    </div>
  );
}

export default App;