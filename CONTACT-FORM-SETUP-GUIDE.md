# Brand Drive — Contact Form Setup (Google Sheets)

The contact form on `contact.html` sends submissions to Google Sheets via Google Apps Script.

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name it **Brand Drive Contact Form**.
3. In Row 1, add headers: `Timestamp | Name | Email | Phone | Message`

## Step 2: Create Apps Script

1. In the sheet: **Extensions → Apps Script**
2. Paste this code:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = e.parameter;
  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.message || ''
  ]);
  return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Save the project.

## Step 3: Deploy as Web App

1. **Deploy → New deployment → Web app**
2. Execute as: **Me**
3. Who has access: **Anyone**
4. Copy the **Web App URL**.

## Step 4: Add URL to Website

In `assets/js/main.js`, replace:

```javascript
const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';
```

## Step 5: GitHub Pages + Custom Domain

1. Upload `brand-drive/` folder to a GitHub repo.
2. Enable Pages from **main** branch.
3. For custom domain (e.g. branddrive.in): add in Pages settings + DNS A/CNAME records.

## Client Details

- **Founder:** Mitesh Baudhanwala
- **Phone:** +91 98244 61445
- **Email:** branddrive.in@gmail.com
