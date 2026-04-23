const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();

// הגדרת ה-API Key של Resend (יילקח מ-Render Environment Variables בענן)
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// נתיב לבדיקה שהשרת חי
app.get('/', (req, res) => {
    res.send('Maccabi Server is Running!');
});

// הנתיב לשליחת המייל
app.post('/send-email', async (req, res) => {
    const { email, fullName } = req.body;

    try {
        const data = await resend.emails.send({
            from: 'Maccabi TLV <onboarding@resend.dev>', // שים לב: בגרסה החינמית זה תמיד נשלח מהכתובת הזו
            to: email,
            subject: 'אישור כניסה רשמי לתל אביב - הונפק בהצלחה',
            html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; border: 2px solid #ffcc00; padding: 20px; text-align: center;">
                    <h1 style="color: #00163f;">שלום ${fullName},</h1>
                    <p style="font-size: 1.2rem;">אנו שמחים לבשר לך שבקשת הויזה שלך לתל אביב אושרה במערכת.</p>
                    <p>כדי לצפות באישור הרשמי ולהוריד אותו לטלפון, לחץ על הקישור הבא:</p>
                    <a href="https://YOUR-FRONTEND-URL.vercel.app/video-page" 
                       style="background-color: #ffcc00; color: #00163f; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 5px;">
                       צפייה באישור הכניסה
                    </a>
                    <p style="margin-top: 20px; font-size: 0.8rem; color: #666;">* תוקף האישור ל-72 שעות בלבד.</p>
                </div>
            `
        });

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// הגדרת הפורט בצורה שמתאימה ל-Render
const PORT = process.env.PORT || 5000;

// האזנה לפורט בכתובת 0.0.0.0 - קריטי להצלחה ב-Render!
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Maccabi Server is jumping on port ${PORT}`);
});