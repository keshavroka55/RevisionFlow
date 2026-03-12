// src/templates/revision-email.js

export const morningDigestTemplate = ({ userName, schedules, revisionTime, appUrl }) => {
  const noteRows = schedules.map((s) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0">
        <strong style="color:#1a1a1a">${s.note.title}</strong>
        <div style="color:#888;font-size:12px;margin-top:2px">${s.note.folder?.name ?? ""}</div>
      </td>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0;text-align:center">
        <span style="background:#EEF2FF;color:#4F46E5;padding:4px 10px;border-radius:20px;font-size:12px">
          ${s.stage.replace("_", " ")}
        </span>
      </td>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0;text-align:center">
        <span style="background:#F0FDF4;color:#16A34A;padding:4px 10px;border-radius:20px;font-size:12px">
          Session ${s.sessionSlot}
        </span>
      </td>
    </tr>
  `).join("");

  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family:Arial,sans-serif;background:#f9fafb;margin:0;padding:20px">
      <div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="background:#4F46E5;padding:30px;text-align:center">
          <h1 style="color:white;margin:0;font-size:24px">🧠 Revision Flow</h1>
          <p style="color:#c7d2fe;margin:8px 0 0">Good morning!</p>
        </div>

        <div style="padding:30px">
          <h2 style="color:#1a1a1a;margin-top:0">Hi ${userName} 👋</h2>
          <p style="color:#555">
            You have <strong>${schedules.length} revision(s)</strong> scheduled 
            for today at <strong>${revisionTime}</strong>. Stay consistent!
          </p>

          <table style="width:100%;border-collapse:collapse;margin-top:20px">
            <thead>
              <tr style="background:#f8f9ff">
                <th style="padding:12px;text-align:left;color:#555;font-size:13px">Note</th>
                <th style="padding:12px;text-align:center;color:#555;font-size:13px">Stage</th>
                <th style="padding:12px;text-align:center;color:#555;font-size:13px">Session</th>
              </tr>
            </thead>
            <tbody>${noteRows}</tbody>
          </table>

          <div style="text-align:center;margin-top:30px">
            <a href="${appUrl}/dashboard"
               style="background:#4F46E5;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:bold">
              View Dashboard
            </a>
          </div>
        </div>

        <div style="background:#f8f9ff;padding:20px;text-align:center">
          <p style="color:#888;font-size:12px;margin:0">
            <a href="${appUrl}/settings" style="color:#4F46E5">Manage preferences</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const upcomingReminderTemplate = ({ userName, schedules, revisionTime, appUrl }) => {
  const noteLinks = schedules.map((s) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0">
        <strong style="color:#1a1a1a">${s.note.title}</strong>
      </td>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0;text-align:right">
        <a href="${appUrl}/notes/${s.note.id}"
           style="background:#4F46E5;color:white;padding:6px 14px;border-radius:6px;text-decoration:none;font-size:13px">
          Open Note
        </a>
      </td>
    </tr>
  `).join("");

  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family:Arial,sans-serif;background:#f9fafb;margin:0;padding:20px">
      <div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="background:#DC2626;padding:30px;text-align:center">
          <h1 style="color:white;margin:0;font-size:24px">⏰ Starting in 15 minutes!</h1>
          <p style="color:#fecaca;margin:8px 0 0">Your revision session is almost here</p>
        </div>

        <div style="padding:30px">
          <h2 style="color:#1a1a1a;margin-top:0">Hi ${userName}!</h2>
          <p style="color:#555">
            Your revision session starts at <strong>${revisionTime}</strong>.
            Open your notes and get ready!
          </p>

          <table style="width:100%;border-collapse:collapse;margin-top:20px">
            <tbody>${noteLinks}</tbody>
          </table>

          <div style="text-align:center;margin-top:30px">
            <a href="${appUrl}/revisions/today"
               style="background:#DC2626;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:bold">
              Start Revision Now
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};