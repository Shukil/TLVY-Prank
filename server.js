const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();

// הגדרת CORS - מאפשר לכל דומיין לגשת לשרת (קריטי לחיבור עם Vercel)
app.use(cors());
app.use(express.json());

// אתחול Resend עם ה-API Key מהסביבה
const resend = new Resend(process.env.RESEND_API_KEY);

// --- נתיבי השרת (Routes) ---

// 1. נתיב בדיקה - זה מה שתראה כשתכתוב את כתובת השרת בדפדפן
app.get('/', (req, res) => {
    res.status(200).send('<h1>Maccabi Server is UP and RUNNING! 💛💙</h1><p>The backend is ready to send some prank emails.</p>');
});

// 2. נתיב שליחת המייל
app.post('/send-email', async (req, res) => {
    const { email, fullName } = req.body;
    
    console.log(`ניסיון שליחת מייל ל- ${email} עבור ${fullName}`);

    try {
        // שליחת המייל דרך Resend
        const data = await resend.emails.send({
            from: 'Maccabi TLV <onboarding@resend.dev>', // בגרסה החינמית חייב להישאר onboarding@resend.dev
            to: email,
            subject: 'אישור כניסה רשמי לתל אביב - הונפק בהצלחה',
            html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; border: 4px solid #ffcc00; padding: 30px; text-align: center; background-color: #ffffff; max-width: 600px; margin: auto;">
                    <h1 style="color: #00163f; font-size: 24px;">שלום ${fullName},</h1>
                    <p style="font-size: 18px; color: #333;">אנו שמחים לבשר לך שבקשת הויזה שלך לתל אביב אושרה במערכת עיריית תל אביב-יפו.</p>
                    <p style="font-weight: bold; font-size: 16px;">כדי לצפות באישור הכניסה הרשמי (PDF) ולהוריד אותו, לחץ על הכפתור למטה:</p>
                    <br />
                    <a href="https://tlvy-prank.vercel.app/video-page" 
                       style="background-color: #00163f; color: #ffcc00; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 18px; display: inline-block;">
                       צפייה באישור הכניסה
                    </a>
                    <p style="margin-top: 40px; font-size: 12px; color: #888;">* האישור הונפק באופן ממוחשב ותקף ל-72 שעות.</p>
                    <p style="font-size: 12px; color: #888;">© 2026 מחלקת אשרות כניסה, עיריית תל אביב-יפו</p>
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

// --- הגדרת הפורט והרצת השרת ---
const PORT = process.env.PORT || 5000;

// האזנה בפורט הנכון ובכתובת 0.0.0.0 (חובה ב-Render)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is jumping on port ${PORT} 🚀`);
});