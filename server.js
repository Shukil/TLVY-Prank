const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();

// הגדרת CORS פשוטה שתאפשר לאתר שלך ב-Vercel לדבר עם השרת
app.use(cors());
app.use(express.json());

// אתחול Resend עם ה-API Key מהסביבה ב-Render
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
        // שליחת המייל דרך Resend עם העיצוב המלא
        const data = await resend.emails.send({
            from: 'מערכת אשרות לתל אביב <onboarding@resend.dev>', // שולח בעברית (בגרסה החינמית חייב להישאר onboarding@resend.dev)
            to: email,
            subject: 'אישור כניסה רשמי לתל אביב - הונפק בהצלחה',
            html: `
            <!DOCTYPE html>
            <html dir="rtl" lang="he">
            <head>
                <meta charset="UTF-8">
                <style>
                    /* סגנונות ספציפיים לגוגל - לא תמיד עובדים, עדיף inline-css */
                    body { font-family: sans-serif; margin: 0; padding: 0; background-color: #f1f1f1; }
                    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border-top: 10px solid #ffcc00; }
                    .header { background-color: #00163f; color: #ffffff; padding: 30px; text-align: center; }
                    .content { padding: 40px; color: #333333; line-height: 1.6; font-size: 16px; }
                    .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #888888; font-size: 12px; }
                    .btn { display: inline-block; background-color: #ffcc00; color: #00163f; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 18px; margin-top: 20px; }
                    .btn:hover { background-color: #e6b800; }
                    h1 { margin-top: 0; color: #ffffff; font-size: 28px; }
                    p { margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>עיריית תל אביב-יפו</h1>
                        <p style="color: #ffcc00;">מחלקת אשרות כניסה</p>
                    </div>
                    <div class="content">
                        <p>שלום <strong>${fullName}</strong>,</p>
                        <p>אנו שמחים לבשר לך שבקשת הויזה שלך לתל אביב אושרה במערכת הממוחשבת.</p>
                        <p>האשרה תקפה ל-72 שעות בלבד.</p>
                        <p>על מנת לצפות באישור הרשמי ולהוריד אותו לטלפון, אנא לחץ על הכפתור למטה:</p>
                        <div style="text-align: center;">
                            <a href="https://tlvy-prank.vercel.app/video-page" class="btn">צפייה באישור הכניסה</a>
                        </div>
                        <p style="margin-top: 30px; color: #666666; font-size: 14px;">הודעה זו נשלחה אליך באופן אוטומטי.</p>
                    </div>
                    <div class="footer">
                        <p>© עיריית תל אביב-יפו | רחוב אבן גבירול 69 | www.tel-aviv.gov.il</p>
                    </div>
                </div>
            </body>
            </html>
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