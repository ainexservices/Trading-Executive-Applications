# Trading Executive Recruitment — Vercel + Google Sheet

This version saves applications directly into your Google Sheet through a Google Apps Script web app. Resend/email is not required.

## 1) Google Apps Script

Open the Google Sheet:

https://docs.google.com/spreadsheets/d/1X5Ki9l6rTCLwAZUwM479xknmtaMybaS3-VHf1kCPd04/edit

Then open Extensions → Apps Script.

Create a new script and paste the contents of `google-apps-script.gs`.

IMPORTANT:
- In `google-apps-script.gs`, replace `CHANGE_THIS_TO_A_RANDOM_SECRET` with a long random secret.
- Keep the Sheet private if you want; the Apps Script runs under your Google account.
- Deploy → New deployment → Web app.
- Execute as: Me
- Who has access: Anyone
- Copy the Web app URL ending in `/exec`.

## 2) Vercel Environment Variables

Remove the old Resend variables (`RESEND_API_KEY`, `FROM_EMAIL`, `TO_EMAIL`) if you no longer need them.

Add these Production variables:

GOOGLE_APPS_SCRIPT_URL = your Apps Script `/exec` URL
SHEET_SECRET = exactly the same secret you put in the Apps Script

Then Redeploy.

## 3) Test

Open the live website and submit one test application.

A new row should appear in the Google Sheet.

Application data is designed to be stored in the Sheet, not emailed through Resend.

## Important

Do not collect passwords, OTPs, UPI PINs, bank-card details, broker login credentials, or money from applicants.
