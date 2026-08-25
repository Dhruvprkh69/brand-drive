# Brand Drive — Contact Form → Google Sheets Setup Guide

Use this guide to connect the website contact form (`contact.html` and Home `#contact` section) to a Google Sheet so every submission is saved automatically.

**Website file for Web App URL:** `assets/js/main.js` (line 8)

The form sends these fields:

| Form field | Sheet column |
|---|---|
| Full Name | Name |
| Email Address | Email |
| Phone Number | Phone |
| Subject | Subject |
| Budget | Budget |
| Your Message | Message (optional) |
| Send Message | (button only — not a column) |

Budget options: **5 Lakhs – 15 Lakhs**, **15 Lakhs – 30 Lakhs**, **30 Lakhs – 50 Lakhs**, **50 Lakhs & above**

After submit, the website shows: **"Thank you! Your message has been sent. We'll reach you within 24 hours."**

---

## Part 1: Create Google Sheet

1. Open [Google Sheets](https://sheets.google.com)
2. Click **Blank spreadsheet**
3. Name it: `Brand Drive Contact Form`
4. In **Row 1**, add these column headers:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **Timestamp** | **Name** | **Email** | **Phone** | **Subject** | **Budget** | **Message** |

If the sheet already exists, insert a **Budget** column (column F) and shift Message to column G.

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
    data.budget || '',
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

If you already deployed an older script, paste the updated script (with `data.budget`), then **Deploy → Manage deployments → Edit (pencil) → New version → Deploy**. Keep the same URL if Google allows, or paste the new URL into `main.js`.

---

## Part 4: Connect to the Website

1. Open: `brand-drive/assets/js/main.js`
2. Find line 8 and set:

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
```

3. Save, commit, and push:

```powershell
cd "c:\Users\dhruv\OneDrive\Desktop\Portfolio Web\brand-drive"

git add assets/js/main.js index.html contact.html CONTACT-FORM-SETUP-GUIDE.md
git commit -m "Add budget dropdown to contact form"
git push origin main
```

4. Wait 1–2 minutes for GitHub Pages to update, then test the live site

---

## Part 5: Test the Form

1. Open: [https://dhruvprkh69.github.io/brand-drive/contact.html](https://dhruvprkh69.github.io/brand-drive/contact.html)
2. Fill **Name, Email, Phone, Subject, Budget, Message** and click **Send Message**
3. You should see: *"Thank you! Your message has been sent. We'll reach you within 24 hours."*
4. Check your Google Sheet — new row with Timestamp, Name, Email, Phone, Subject, Budget, Message

**Where the form works:**
- Contact page (`contact.html`)
- Home page contact section (`index.html` → `#contact`)

---

## Form Fields (what gets sent)

| Field | Required | Sent to Sheet as |
|-------|----------|------------------|
| Full Name | Yes | `name` → **Name** |
| Email Address | Yes | `email` → **Email** |
| Phone Number | Yes (10 digits) | `phone` → **Phone** |
| Subject | Yes | `subject` → **Subject** |
| Budget | Yes | `budget` → **Budget** |
| Your Message | No | `message` → **Message** |
| Send Message | — | Submit button only |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Form not configured — add your Google Script URL in main.js" | URL not pasted in `main.js`, or changes not pushed to GitHub |
| Form submits but no row in Sheet | Redeploy Web App with **Who has access: Anyone**; copy the new URL |
| Budget column empty | Update Apps Script to include `data.budget`, add **Budget** header in column F, then **redeploy** |
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
    '\nBudget: ' + (data.budget || '') +
    '\n\n' + (data.message || '')
});
```

Replace the email address with the one you want to receive alerts on. Save and **redeploy** the Web App after any script change.

---

## Quick Checklist

- [ ] Google Sheet headers: Timestamp, Name, Email, Phone, Subject, Budget, Message
- [ ] Apps Script includes `data.budget` and is saved
- [ ] Script authorized (Run once → Allow)
- [ ] Web App redeployed — **Anyone** can access
- [ ] Web app URL in `assets/js/main.js`
- [ ] Changes pushed to GitHub
- [ ] Live form tested — Budget appears in Sheet

---

*Last updated: August 2026 — Brand Drive® website*
