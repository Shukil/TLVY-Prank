const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// נתיב בדיקה לשרת
app.get('/', (req, res) => {
    res.status(200).send('<h1>Maccabi Server is UP and RUNNING! 💛💙</h1>');
});

// נתיב שליחת המייל
app.post('/send-email', async (req, res) => {
    // כאן השרת קולט את כל השדות מהטופס המעוצב שלך, כדי למנוע קריסות
    const { fullName, email, reason, arrivalDate } = req.body;
    
    // הלוג עודכן כדי שתוכל לראות ב-Render את כל הפרטים שהוזנו
    console.log(`ניסיון שליחת מייל ל- ${email} עבור ${fullName}. סיבת הגעה: ${reason}, תאריך: ${arrivalDate}`);

    try {
        const data = await resend.emails.send({
            from: 'Maccabi TLV <onboarding@resend.dev>',
            to: email,
            subject: 'אישור כניסה רשמי לתל אביב - הונפק בהצלחה',
            
            // --- עיצוב המייל של שעה 22:00 - ללא שום שינוי! ---
            html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; border: 4px solid #ffcc00; padding: 30px; text-align: center; background-color: #ffffff; max-width: 600px; margin: auto;">
                    <img src="https://upload.wikimedia.org/wikipedia/he/thumb/a/a8/Maccabi_Tel_Aviv_FC.svg/1024px-Maccabi_Tel_Aviv_FC.svg.png" alt="Maccabi Logo" style="width: 100px; margin-bottom: 20px;">
                    
                    <h1 style="color: #00163f; font-size: 24px;">שלום ${fullName},</h1>
                    
                    <p style="font-size: 18px; color: #333;">אנו שמחים לבשר לך שבקשת אשרת הכניסה שלך לתל אביב אושרה במערכת.</p>
                    <p style="font-weight: bold; font-size: 16px;">כדי להוריד את האישור הרשמי לטלפון, לחץ על הכפתור למטה:</p>
                    <br />
                    
                    <a href="https://tlvy-prank.vercel.app/video-page" 
                       style="background-color: #00163f; color: #ffcc00; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 18px; display: inline-block;">
                       צפייה באישור הכניסה
                    </a>
                    
                    <p style="margin-top: 40px; font-size: 12px; color: #888;">* האישור הונפק באופן ממוחשב ותקף ל-72 שעות.</p>
                    <p style="font-size: 12px; color: #888;">© 2026 עיריית תל אביב-יפו | מחלקת אשרות</p>
                </div>
            `
        });

        console.log('המייל נשלח בהצלחה:', data);
        res.status(200).json({ success: true, data });

    } catch (error) {
        console.error('שגיאה בשליחת המייל:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is jumping on port ${PORT} 🚀`);
});

// --- 2. דף המתיחה (מותאם לעיצוב הקריוקי החדש!) ---
function VideoPage() {
  const [showPrank, setShowPrank] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReveal = () => {
    setIsLoading(true);
    // מפעיל את ההשהיה של ה-2 שניות לפי העיצוב של הכפתור שלך
    setTimeout(() => {
      setShowPrank(true);
    }, 2000);
  };

  return (
    <div className="video-page-wrapper" dir="rtl">
      
      {/* תמונת רקע (אופציונלי - אם אין לך קובץ maccabi-bg.jpg תוכל למחוק את השורה הזו) */}
      <img src="/maccabi-bg.jpg" alt="Background" className="background-image" />
      <div className="video-overlay"></div>

      {!showPrank ? (
        <div className="start-screen">
          <img src="/maccabi.png" alt="Maccabi Logo" className="video-logo" />
          <h1>🔒 מסמך מאובטח</h1>
          <p>האישור שלך הונפק בהצלחה. מערכת האבטחה דורשת אישור ידני לפתיחת הקובץ.</p>
          <button 
            onClick={handleReveal} 
            className="start-button"
            disabled={isLoading}
          >
            {isLoading ? 'פותח אישור...' : 'צפייה באישור הכניסה'}
          </button>
        </div>
      ) : (
        <>
          <div className="karaoke-container">
            <h1 className="karaoke-text">תל אביב צהובה! 💛💙</h1>
          </div>
          
          {/* מנגן את השיר ששמת בתיקיית public מבלי להציג את הנגן על המסך */}
          <audio src="/maccabi-song.mp3" autoPlay loop style={{ display: 'none' }} />
        </>
      )}
    </div>
  );
}