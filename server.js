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
            from: 'עיריית תל אביב-יפו <visa@dormayor.com>', to: email,
            subject: 'אישור כניסה רשמי לתל אביב - הונפק בהצלחה',
            html: `
                <div dir="rtl" style="font-family: Arial, Helvetica, sans-serif; background-color: #eef2f7; padding: 24px; max-width: 620px; margin: auto;">

                  <!-- Header -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #003D87; border-radius: 4px 4px 0 0;">
                    <tr>
                      <td style="padding: 16px 20px;" align="right">
                        <table cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding-left: 14px;" valign="middle">
                              <img src="https://www.tel-aviv.gov.il/_layouts/15/TlvSP2013PublicSite/images/logo.png" alt="עיריית תל אביב" height="48" style="display: block;" />
                            </td>
                            <td valign="middle">
                              <div style="color: #ffffff; font-size: 20px; font-weight: bold; line-height: 1.2;">עיריית תל-אביב-יפו</div>
                              <div style="color: #a8c8f0; font-size: 12px; margin-top: 3px;">מערכת שירות לתושב</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Accent bar -->
                  <div style="background-color: #0066CC; height: 3px;"></div>

                  <!-- Content -->
                  <div style="background-color: #ffffff; padding: 32px 28px; border: 1px solid #d0d8e8; border-top: none;">

                    <p style="font-size: 15px; color: #444444; margin: 0 0 20px 0;">שלום ${fullName},</p>

                    <h2 style="color: #003D87; font-size: 20px; margin: 0 0 6px 0;">אישור קבלת בקשה</h2>
                    <div style="width: 36px; height: 3px; background-color: #0066CC; margin-bottom: 20px;"></div>

                    <p style="font-size: 15px; color: #444444; line-height: 1.7; margin: 0 0 14px 0;">
                      בקשתך להנפקת אישור כניסה לתל אביב-יפו התקבלה במערכת ועוברת לבחינת ראש העיר.
                    </p>

                    <p style="font-size: 15px; color: #444444; line-height: 1.7; margin: 0 0 28px 0;">
                      לצפייה ולהורדת האישור הרשמי, לחץ על הכפתור:
                    </p>

                    <!-- Button -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 28px auto;">
                      <tr>
                        <td align="center" style="border-radius: 4px; background-color: #0066CC;">
                          <a href="https://tlvy-prank.vercel.app/video-page"
                             style="display: inline-block; color: #ffffff; text-decoration: none; padding: 13px 32px; font-size: 16px; font-weight: bold; border-radius: 4px;">
                            לצפייה באישור הכניסה
                          </a>
                        </td>
                      </tr>
                    </table>

                    <hr style="border: none; border-top: 1px solid #e8edf4; margin: 0 0 20px 0;" />

                    <p style="font-size: 12px; color: #888888; line-height: 1.8; margin: 0;">
                      * האישור הונפק באופן ממוחשב ותקף ל-72 שעות.<br>
                      * לשאלות ופניות ניתן לפנות למוקד 106 של עיריית תל אביב-יפו.
                    </p>

                  </div>

                  <!-- Footer -->
                  <div style="background-color: #f0f4f8; border: 1px solid #d0d8e8; border-top: none; border-radius: 0 0 4px 4px; padding: 14px 20px; text-align: center;">
                    <p style="font-size: 11px; color: #888888; margin: 0;">
                      © 2026 עיריית תל-אביב-יפו | כל הזכויות שמורות<br>
                      הודעה זו נשלחה ממערכת ממוחשבת. אין להשיב על הודעה זו.
                    </p>
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is jumping on port ${PORT} 🚀`);
});