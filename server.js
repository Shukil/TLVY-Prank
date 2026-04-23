const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();

// הגדרת CORS חזקה למניעת שגיאות דפדפן
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// טיפול בבקשות OPTIONS (Preflight)
app.options('*', cors());

app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// נתיב לבדיקה שהשרת חי (תבדוק אותו בדפדפן!)
app.get('/', (req, res) => {
    res.send('Maccabi Server is Running and Ready for Pranks!');
});

// הנתיב לשליחת המייל
app.post('/send-email', async (req, res) => {
    console.log('Received request:', req.body); // לוג כדי לראות ב-Render שהבקשה הגיעה
    const { email, fullName } = req.body;

    try {
        const data = await resend.emails.send({
            from: 'Maccabi TLV <onboarding@resend.dev>',
            to: email,
            subject: 'אישור כניסה רשמי לתל אביב - הונפק בהצלחה',
            html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; border: 2px solid #ffcc00; padding: 20px; text-align: center;">
                    <h1 style="color: #00163f;">שלום ${fullName},</h1>
                    <p style="font-size: 1.2rem;">אנו שמחים לבשר לך שבקשת הויזה שלך לתל אביב אושרה במערכת.</p>
                    <p>כדי לצפות באישור הרשמי ולהוריד אותו לטלפון, לחץ על הקישור הבא:</p>
                    <a href="https://tlvy-prank.vercel.app/video-page" 
                       style="background-color: #ffcc00; color: #00163f; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 5px;">
                       צפייה באישור הכניסה
                    </a>
                </div>
            `
        });

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is jumping on port ${PORT}`);
});