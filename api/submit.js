export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "METHOD NOT ALLOWED" });
  }

  try {
    const data = req.body || {};

    if (data.website) {
      return res.status(400).json({ success: false, message: "INVALID SUBMISSION." });
    }

    const required = [
      "name", "dob", "mobile", "whatsapp", "email",
      "state", "city", "experience", "device",
      "working_hours", "about"
    ];

    for (const key of required) {
      if (!String(data[key] || "").trim()) {
        return res.status(400).json({
          success: false,
          message: "PLEASE FILL ALL REQUIRED FIELDS."
        });
      }
    }

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    const secret = process.env.SHEET_SECRET;

    if (!scriptUrl || !secret) {
      return res.status(500).json({
        success: false,
        message: "GOOGLE SHEET SERVICE IS NOT CONFIGURED IN VERCEL."
      });
    }

    const payload = {
      ...data,
      secret
    };

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "trading-recruitment/1.0"
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let result = {};
    try {
      result = JSON.parse(text);
    } catch (_) {}

    if (!response.ok || !result.success) {
      return res.status(502).json({
        success: false,
        message: "APPLICATION COULD NOT BE SAVED TO THE SHEET."
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "APPLICATION SUBMIT NAHI HO PAYA. KRIPYA DOBARA PRAYAS KAREN."
    });
  }
}
