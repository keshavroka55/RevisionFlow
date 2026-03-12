// src/services/email.service.js
import nodemailer from "nodemailer";
import { config } from "../config/config.js";
import { morningDigestTemplate, upcomingReminderTemplate } from "../templates/revision-email.js";
import { prisma } from "../config/db.js";

const transporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  secure: false,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD,
  },
});

transporter.verify((err) => {
  if (err) console.error("❌ Email transporter error:", err.message);
  else console.log("✅ Email transporter ready");
});

// ---------------------------------------------------------------------------
// Format time helper
// ---------------------------------------------------------------------------
const formatTime = (hour, minute) => {
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, "0");
  const ampm = hour < 12 ? "AM" : "PM";
  return `${h}:${m} ${ampm}`;
};

// ---------------------------------------------------------------------------
// Email 1 — Morning digest at 9 AM
// ---------------------------------------------------------------------------
export const sendMorningDigest = async ({ userId, userName, userEmail, schedules, hour, minute }) => {
  const revisionTime = formatTime(hour, minute);

  const html = morningDigestTemplate({
    userName,
    schedules,
    revisionTime,
    appUrl: config.CLIENT_URL,
  });

  try {
    await transporter.sendMail({
      from: config.EMAIL_FROM,
      to: userEmail,
      subject: `📚 You have ${schedules.length} revision(s) today at ${revisionTime}`,
      html,
    });

    await prisma.emailLog.create({
      data: {
        userId,
        type: "REVISION_REMINDER",
        status: "SENT",
        toEmail: userEmail,
        subject: `You have ${schedules.length} revision(s) today`,
        sentAt: new Date(),
      },
    });

    console.log(`✅ Morning digest sent to ${userEmail}`);
  } catch (err) {
    await prisma.emailLog.create({
      data: {
        userId,
        type: "REVISION_REMINDER",
        status: "FAILED",
        toEmail: userEmail,
        subject: "Morning digest",
        failedAt: new Date(),
        failureReason: err.message,
      },
    });
    throw err;
  }
};

// ---------------------------------------------------------------------------
// Email 2 — 15 min before revision time
// ---------------------------------------------------------------------------
export const sendUpcomingReminder = async ({ userId, userName, userEmail, schedules, hour, minute }) => {
  const revisionTime = formatTime(hour, minute);

  const html = upcomingReminderTemplate({
    userName,
    schedules,
    revisionTime,
    appUrl: config.CLIENT_URL,
  });

  try {
    await transporter.sendMail({
      from: config.EMAIL_FROM,
      to: userEmail,
      subject: `⏰ Your revision starts in 15 minutes — ${revisionTime}`,
      html,
    });

    await prisma.emailLog.create({
      data: {
        userId,
        type: "REVISION_REMINDER",
        status: "SENT",
        toEmail: userEmail,
        subject: "Revision starting in 15 minutes",
        sentAt: new Date(),
      },
    });

    console.log(`✅ 15-min reminder sent to ${userEmail}`);
  } catch (err) {
    console.error(`❌ Failed to send reminder to ${userEmail}:`, err.message);
    throw err;
  }
};