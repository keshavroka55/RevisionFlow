// Load .env file
import "dotenv/config";

// Print full variable
console.log("DATABASE_URL:", process.env.DATABASE_URL);

// Extra clarity check
if (!process.env.DATABASE_URL) {
  console.log("❌ DATABASE_URL is NOT loaded");
} else {
  console.log("✅ DATABASE_URL loaded successfully");
}
