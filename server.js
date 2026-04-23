const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();

// הגדרת CORS פשוטה שתאפשר לאתר שלך ב-Vercel לדבר עם השרת
app.use(cors());
app.use(express.json());

// הגדרת ה-API Key של Resend (נלקח מה-Environment Variables ב-Render)
const resend = new Resend(process.env.RESEND_API_KEY);

// נתיב בדיקה - זה מה שתראה כשתיכנס לכתובת של השרת בדפדפן
app.get('/', (req, res) => {
    res.send('Maccabi Server is UP and RUNNING! 💛💙');
});

// הנתיב לשליחת המייל
app.post('/send-email', async (req, res) => {
    const { email, fullName } = req.body;
    
    console.log(`ניסיון שליחת מייל ל: ${email}`);

    try {
        const data = await resend.emails.send({
            from: 'Maccabi TLV <onboarding@resend.dev>',
            to: email,
            subject: 'אישור כניסה רשמי לתל אביב - הונפק בהצלחה',
            html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; border: 2px solid #ffcc00; padding: 20px; text-align: center; background-color: #f9f9f9;">
                    <h1 style="color: #00163f;">שלום ${fullName},</h1>
                    <p style="font-size: 1.2rem; color: #333;">אנו שמחים לבשר לך שבקשת הויזה שלך לתל אביב אושרה במערכת.</p>
                    <p style="font-weight: bold;">כדי לצפות באישור הרשמי ולהוריד אותו לטלפון, לחץ על הכפתור למטה:</p>
                    <br />
                    <a href="https://tlvy-prank.vercel.app/video-page" 
                       style="background-color: #00163f; color: #ffcc00; padding: 15px 25px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 1.1rem; display: inline-block;">
                       צפייה באישור הכניסה (PDF)
                    </a>
                    <p style="margin-top: 30px; font-size: 0.8rem; color: #888;">* האישור תקוף ל-72 שעות בלבד מרגע ההנפקה.</p>
                    <p style="font-size: 0.8rem; color: #888;">עיריית תל אביב-יפו | מחלקת אשרות כניסה</p>
                </div>
            `
        });

        console.log('מייל נשלח בהצלחה:', data);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('שגיאה בשליחת המייל:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// הגדרת הפורט בצורה שמתאימה ל-Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is jumping on port ${PORT} 🚀`);
});