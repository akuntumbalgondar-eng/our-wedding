/**
 * ============================================================================
 * WEDDING RSVP BACKEND — Google Apps Script
 * ----------------------------------------------------------------------------
 * What this does:
 *  - doPost()  → receives RSVP submissions from the website and appends a
 *                new row to the "RSVP" sheet in real time.
 *  - doGet()   → when called with ?action=wishes, returns the guest wishes
 *                (name, attendance, message) as JSON so the website can show
 *                them in the "Wedding Wishes" section.
 *
 * SETUP: see README.md "Step 2: Connect Google Sheets" for the full,
 * numbered walkthrough. Short version:
 *   1. Create a Google Sheet, name a tab "RSVP" with header row:
 *      Timestamp | Name | Attendance | Guests | Message
 *   2. Extensions → Apps Script, paste this whole file in, replacing
 *      any starter code.
 *   3. Deploy → New deployment → type "Web app".
 *      Execute as: Me. Who has access: Anyone.
 *   4. Copy the Web App URL into appsScriptUrl in assets/js/config.js.
 * ============================================================================
 */

const SHEET_NAME = "RSVP";

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Name", "Attendance", "Guests", "Message"]);
    sheet.getRange(1, 1, 1, 5).setFontWeight("bold");
  }
  return sheet;
}

/**
 * Handles RSVP form submissions (POST from the website).
 * Expects a JSON body: { name, attendance, guests, message }
 */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    const name = (body.name || "").toString().trim();
    const attendance = (body.attendance || "").toString().trim();
    const guests = (body.guests || "0").toString().trim();
    const message = (body.message || "").toString().trim();

    if (!name || !attendance) {
      return jsonResponse_({ status: "error", message: "Missing required fields." });
    }

    const sheet = getSheet_();
    sheet.appendRow([new Date(), name, attendance, guests, message]);

    return jsonResponse_({ status: "success" });
  } catch (err) {
    return jsonResponse_({ status: "error", message: err.message });
  }
}

/**
 * Handles read requests from the website.
 *   ?action=wishes  → returns all RSVP messages as JSON for the
 *                      "Wedding Wishes" section.
 *   (no params)     → simple status page, useful for confirming the
 *                      deployment works when opened directly in a browser.
 */
function doGet(e) {
  const action = e.parameter.action;

  if (action === "wishes") {
    const sheet = getSheet_();
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
      return jsonResponse_({ wishes: [] });
    }

    const values = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
    const wishes = values
      .filter((row) => row[1]) // has a name
      .map((row) => ({
        timestamp: row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
        name: row[1],
        attendance: row[2],
        guests: row[3],
        message: row[4],
      }));

    return jsonResponse_({ wishes: wishes });
  }

  return ContentService.createTextOutput(
    "Wedding RSVP backend is running. Use ?action=wishes to fetch wishes."
  ).setMimeType(ContentService.MimeType.TEXT);
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
