# Brand Drive — Contact Form → Google Sheets Setup Guide

Use this guide to connect the website contact form (`contact.html` and Home `#contact` section) to a Google Sheet so every submission is saved automatically.

**Website file to update after setup:** `assets/js/main.js` (line 8)

The form sends these fields:

| Form field | Sheet column |
|---|---|
| Full Name | Name |
| Email Address | Email |
| Phone Number | Phone |
| Subject | Subject |
| Your Message | Message |
| Send Message | (button only — not a column) |

After submit, the website shows: **"Thank you! Your message has been sent. We'll reach you within 24 hours."**

---

## Part 1: Create Google Sheet

1. Open [Google Sheets](https://sheets.google.com)
2. Click **Blank spreadsheet**
3. Name it: `Brand Drive Contact Form`
4. In **Row 1**, add these column headers:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| **Timestamp** | **Name** | **Email** | **Phone** | **Subject** | **Message** |

5. The sheet saves automatically

---

## Part 2: Add Google Apps Script

1. In the sheet menu: **Extensions → Apps Script**
2. Delete any default code and paste this:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = e.parameter;

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.subject || '',
    data.message || ''
  ]);

  return ContentService
    .createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

3. Click **Save** (Ctrl+S) and name the project: `Brand Drive Form`
4. Click **Run** once — Google will ask for permissions → choose your account → **Allow**

---

## Part 3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon → select **Web app**
3. Use these settings:
   - **Execute as:** Me (your Google account)
   - **Who has access:** **Anyone**
4. Click **Deploy**
5. If prompted, **Authorize** again
6. Copy the **Web app URL** — it looks like:

```
https://script.google.com/macros/s/AKfycbx.........../exec
```

> **Important:** Each new deployment gets a new URL. Always use the latest URL after redeploying.

If you already deployed an older script (without Subject), paste the new script, then **Deploy → Manage deployments → Edit (pencil) → New version → Deploy**, and copy the URL again.

---

## Part 4: Connect to the Website

1. Open: `brand-drive/assets/js/main.js`
2. Find line 8:

```javascript
const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';
```

3. Replace with your copied URL, for example:

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
```

4. Save the file, then push to GitHub:

```powershell
cd "c:\Users\dhruv\OneDrive\Desktop\Portfolio Web\brand-drive"

git add assets/js/main.js
git commit -m "Connect contact form to Google Sheets"
git push origin main
```

5. Wait 1–2 minutes for GitHub Pages to update, then test the live site

---

## Part 5: Test the Form

1. Open: [https://dhruvprkh69.github.io/brand-drive/contact.html](https://dhruvprkh69.github.io/brand-drive/contact.html)
2. Fill **Name, Email Address, Phone Number, Subject, Your Message** and click **Send Message**
3. You should see: *"Thank you! Your message has been sent. We'll reach you within 24 hours."*
4. Check your Google Sheet — a new row should appear with Timestamp, Name, Email, Phone, Subject, Message

**Where the form works:**
- Contact page (`contact.html`)
- Home page contact section (`index.html` → `#contact`)

---

## Form Fields (what gets sent)

| Field | Required | Sent to Sheet as |
|-------|----------|------------------|
| Full Name | Yes | `name` → **Name** |
| Email Address | Yes | `email` → **Email** |
| Phone Number | No | `phone` → **Phone** |
| Subject | Yes | `subject` → **Subject** |
| Your Message | Yes | `message` → **Message** |
| Send Message | — | Submit button only |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Form not configured — add your Google Script URL in main.js" | URL not pasted in `main.js`, or changes not pushed to GitHub |
| Form submits but no row in Sheet | Redeploy Web App with **Who has access: Anyone**; copy the new URL |
| Subject column empty | Update Apps Script to include `data.subject`, add a **Subject** header in column E, then **redeploy** |
| Permission / authorization error | Run the script once in Apps Script editor and click **Allow** |
| Old submissions missing | Check you are looking at the correct Google Sheet / tab |

---

## Optional: Email Alert on New Submission

To receive an email when someone submits the form, add this inside `doPost` after `appendRow`:

```javascript
MailApp.sendEmail({
  to: 'branddrive.in@gmail.com',
  subject: 'New contact form — Brand Drive',
  body:
    'Name: ' + (data.name || '') +
    '\nEmail: ' + (data.email || '') +
    '\nPhone: ' + (data.phone || '') +
    '\nSubject: ' + (data.subject || '') +
    '\n\n' + (data.message || '')
});
```

Replace the email address with the one you want to receive alerts on. Save and **redeploy** the Web App after any script change.

---

## Quick Checklist

- [ ] Google Sheet created with 6 column headers (Timestamp, Name, Email, Phone, Subject, Message)
- [ ] Apps Script pasted and saved (includes `data.subject`)
- [ ] Script authorized (Run once → Allow)
- [ ] Web App deployed — **Anyone** can access
- [ ] Web app URL copied
- [ ] URL pasted in `assets/js/main.js` line 8
- [ ] Changes committed and pushed to GitHub
- [ ] Live form tested — row appears in Sheet, success text shows 24 hours

---

*Last updated: August 2026 — Brand Drive® website*
