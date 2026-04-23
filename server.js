require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend'); // ייבוא הספרייה

const app = express();
const PORT = process.env.PORT || 5000;
const resend = new Resend(process.env.RESEND_API_KEY); // חיבור למפתח שלנו

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running smoothly' });
});

app.post('/api/submit-form', async (req, res) => {
    const { email, name } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const randomDelaySeconds = Math.floor(Math.random() * (10800 - 3600 + 1)) + 3600;

    if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV MODE] Form received for ${email}. Mocking delay of 10 seconds...`);
        
        setTimeout(async () => {
            console.log(`[DEV MODE] ⏳ Time's up! Sending real email to: ${email}`);
            
           try {
                const data = await resend.emails.send({
                    from: 'onboarding@resend.dev', 
                    to: email,
                    subject: 'עדכון סטטוס: בקשת אשרת תייר לתל אביב יפו', 
                    html: `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #001122; font-family: Arial, Helvetica, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #001122;" dir="rtl">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #00163f; max-width: 600px; width: 100%; border-top: 5px solid #ffcc00; border-bottom: 2px solid #ffcc00;">
                    
                    <tr>
                        <td align="center" style="padding: 30px 20px; border-bottom: 1px solid #1a2a4f;">
                            <h1 style="color: #ffcc00; margin: 0; font-size: 24px;">עדכון סטטוס בקשה</h1>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="right" style="padding: 40px 30px; color: #ffffff; line-height: 1.6;">
                            <h2 style="color: #ffcc00; margin-top: 0; font-size: 20px;">שלום ${name},</h2>
                            <p style="font-size: 16px; color: #e0e0e0; margin: 0 0 10px 0;">פנייתך לקבלת אשרת תייר בכניסה לתל אביב יפו התקבלה ונבדקה במערכת שלנו.</p>
                            <p style="font-size: 16px; font-weight: bold; color: #ffffff; margin: 0 0 35px 0;">התשובה הסופית לגבי סטטוס הבקשה שלך ממתינה בקישור המצורף מטה.</p>
                            
                            <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto;">
                                <tr>
                                    <td align="center" style="background-color: #ffcc00; border-radius: 4px;">
                                        <a href="https://your-website.com/video-page" target="_blank" style="font-size: 18px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; color: #00163f; text-decoration: none; padding: 15px 35px; display: inline-block;">
                                            לבדיקת זכאות לחץ כאן
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="font-size: 14px; color: #aaaaaa; margin-top: 35px; margin-bottom: 0;">
                                אם הכפתור אינו עובד, ניתן להעתיק ולהדביק את הקישור הבא בדפדפן:<br>
                                <a href="https://your-website.com/video-page" style="color: #ffcc00; text-decoration: none; word-break: break-all;">https://your-website.com/video-page</a>
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="background-color: #000c24; padding: 20px; font-size: 13px; color: #666666; border-top: 1px solid #1a2a4f;">
                            <p style="margin: 0;">הודעה זו נשלחה אוטומטית ממערכת אישורי הכניסה לתל אביב יפו.</p>
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>
</body>
</html>
                    `
                });
                console.log("✅ Email sent successfully!", data.id);
            } catch (error) {
                console.error("❌ Failed to send email:", error);
            }
        }, 10000); 

    } else {
        console.log(`[PROD MODE] Scheduling email for ${email} in ${randomDelaySeconds} seconds.`);
        // כאן ישב הקוד של Google Cloud Tasks בעתיד
    }

    res.status(200).json({ 
        message: 'Request received successfully! Email will be sent later.',
        estimatedDelaySeconds: process.env.NODE_ENV === 'development' ? 10 : randomDelaySeconds
    });
});

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});