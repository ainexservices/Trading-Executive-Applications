const SHEET_ID = "1X5Ki9l6rTCLwAZUwM479xknmtaMybaS3-VHf1kCPd04";
const SHEET_NAME = "Sheet1";
const SECRET_TOKEN = "CHANGE_THIS_TO_A_RANDOM_SECRET";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");

    if (data.secret !== SECRET_TOKEN) {
      return jsonResponse({ success: false, message: "Unauthorized" });
    }

    const required = [
      "name", "dob", "mobile", "whatsapp", "email",
      "state", "city", "experience", "device",
      "working_hours", "about"
    ];

    for (const key of required) {
      if (!String(data[key] || "").trim()) {
        return jsonResponse({ success: false, message: "Missing required field" });
      }
    }

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    // Create headers automatically if the sheet is empty.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Date of Birth",
        "Mobile",
        "WhatsApp",
        "Email",
        "State",
        "City/District",
        "Trading Experience",
        "Available Device",
        "9:30 AM–4:00 PM Availability",
        "About Yourself",
        "India Residence/Data Accuracy"
      ]);
    }

    sheet.appendRow([
      new Date(),
      safeCell(data.name),
      safeCell(data.dob),
      safeCell(data.mobile),
      safeCell(data.whatsapp),
      safeCell(data.email),
      safeCell(data.state),
      safeCell(data.city),
      safeCell(data.experience),
      safeCell(data.device),
      safeCell(data.working_hours),
      safeCell(data.about),
      safeCell(data.india_confirmation || "YES")
    ]);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, message: "Server error" });
  }
}

function safeCell(value) {
  const s = String(value || "").trim();
  // Prevent spreadsheet formula injection.
  if (/^[=+\-@]/.test(s)) return "'" + s;
  return s;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
