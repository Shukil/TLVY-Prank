const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();

// הגדרת CORS - מאפשר ל-Vercel לגשת לשרת ללא חסימות
app.use(cors());
app.use(express.json());

// אתחול Resend (ה-API Key חייב להיות מוגדר ב-Render תחת Environment Variables)
const resend = new Resend(process.env.RESEND_API_KEY);

// --- נתיבי השרת ---

// 1. נתיב בדיקה (Health Check) - תבדוק אותו בדפדפן כדי לוודא שהשרת Live
app.get('/', (req, res) => {
    res.status(200).send(`
        <div dir="rtl" style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: #00163f;">השרת של שוקי באוויר! 🚀</h1>
            <p style="color: #ffcc00; font-size: 1.5rem; font-weight: bold;">Maccabi TLV Mode: ON</p>
        </div>
    `);
});

// 2. נתיב שליחת המייל (הלב של המתיחה)
app.post('/send-email', async (req, res) => {
    const { email, fullName } = req.body;
    
    console.log(`ניסיון שליחת מייל ל: ${email} עבור: ${fullName}`);

    try {
        const data = await resend.emails.send({
            from: 'עיריית תל אביב-יפו <onboarding@resend.dev>', // בגרסה החינמית זה נשאר כך
            to: email,
            subject: 'אישור כניסה רשמי לתל אביב - הונפק בהצלחה',
            html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-top: 10px solid #ffcc00;">
                <div style="background-color: #00163f; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">עיריית תל אביב-יפו</h1>
                    <p style="margin: 5px 0 0 0; color: #ffcc00;">מחלקת אשרות כניסה ופיקוח עירוני</p>
                </div>
                <div style="padding: 30px; background-color: #ffffff; color: #333333; line-height: 1.6;">
                    <h2 style="color: #00163f;">שלום ${fullName},</h2>
                    <p>אנו שמחים לעדכן כי בקשתך לקבלת <strong>אשרת כניסה זמנית לעיר תל אביב</strong> אושרה במערכות העירייה.</p>
                    <p>האישור תקף ל-72 שעות מרגע קבלת הודעה זו. עליך להציג את האישור הממוחשב במידה ותתבקש על ידי פקח עירוני או במחסומי הכניסה הנבחרים.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="font-weight: bold;">להורדת האישור הרשמי בפורמט PDF לטלפון:</p>
                        <a href="https://tlvy-prank.vercel.app/video-page" 
                           style="background-color: #00163f; color: #ffcc00; padding: 15px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
                           צפייה והורדת אישור הכניסה
                        </a>
                    </div>
                    
                    <p style="font-size: 14px; color: #666;">* אין להעביר אישור זה לצד ג'.<br>* הכניסה לעיר מותנית בעמידה בתקנות העירייה.</p>
                </div>
                <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eeeeee;">
                    <p>הודעה זו נשלחה באופן אוטומטי על ידי מערכת האשרות העירונית.<br>אין להשיב למייל זה.</p>
                    <p>© 2026 עיריית תל אביב-יפו | אבן גבירול 69, תל אביב</p>
                </div>
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

// --- הפעלת השרת ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Maccabi Server is jumping on port ${PORT} 🚀`);
});