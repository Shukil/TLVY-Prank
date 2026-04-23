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
    const { email, fullName } = req.body;
    
    console.log(`ניסיון שליחת מייל ל- ${email} עבור ${fullName}`);

    try {
        const data = await resend.emails.send({
from: 'עיריית תל אביב-יפו <visa@dormayor.com>',            to: email,
            subject: 'אישור כניסה רשמי לתל אביב - הונפק בהצלחה',
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