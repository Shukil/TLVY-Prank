import { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    reason: '', 
    arrivalDate: '' 
  });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('http://localhost:5000/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', reason: '', arrivalDate: '' }); 
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
        
        {/* אזור הכותרת עם הלוגואים */}
        <div className="header-container">
          {/* הלוגו העגול - יופיע בימין כי אנחנו ב-RTL */}
          <img src="/maccabi.png" alt="Maccabi" className="header-logo" />
          
          <h1>בקשת אשרת תייר בכניסה לתל אביב יפו</h1>
          
          {/* הלוגו של הפנאטיקס - יופיע בשמאל */}
          <img src="/fanatics.png" alt="Fanatics" className="header-logo" />
        </div>
        
        {status === 'success' ? (
          <div className="success-message">
            <h3>✅ הבקשה התקבלה בהצלחה!</h3>
            <p>תשובה תתקבל בקרוב</p>
            <button onClick={() => setStatus('idle')}>שלח בקשה נוספת</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-container">
            
            <div className="input-group">
              <label>1. שם מלא:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="הכנס שם מלא"
              />
            </div>
            
            <div className="input-group">
              <label>2. כתובת מייל:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="כתובת אימייל תקינה"
              />
            </div>

            <div className="input-group">
              <label>3. סיבת הבקשה:</label>
              <select 
                value={formData.reason} 
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
              >
                <option value="" disabled>בחר סיבה מתוך הרשימה...</option>
                <option value="tourism">תיירות ונופש</option>
                <option value="business">עסקים ופגישות</option>
                <option value="family">ביקור משפחה / חברים</option>
                <option value="medical">טיפול רפואי</option>
                <option value="other">אחר</option>
              </select>
            </div>

            <div className="input-group">
              <label>4. תאריך הגעה צפוי:</label>
              <input
                type="date"
                value={formData.arrivalDate}
                onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                required
              />
            </div>

            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'מעבד נתונים...' : 'שלח בקשה לאשרה'}
            </button>
            
            {status === 'error' && (
              <p className="error-message">אופס! משהו השתבש. נסה שוב מאוחר יותר.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default App;