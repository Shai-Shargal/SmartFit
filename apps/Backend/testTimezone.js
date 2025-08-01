// Test script to verify timezone functionality
function getTodayInTimezone(timezone = "UTC") {
  const now = new Date();
  const userDate = new Date(
    now.toLocaleString("en-US", { timeZone: timezone })
  );
  userDate.setHours(0, 0, 0, 0);
  return userDate;
}

// Test different timezones
const timezones = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Asia/Jerusalem", // Add user's timezone
];

console.log("Testing timezone functionality:");
console.log("Current server time:", new Date().toISOString());
console.log("");

timezones.forEach((timezone) => {
  const today = getTodayInTimezone(timezone);
  console.log(`${timezone}:`);
  console.log(`  Date: ${today.toDateString()}`);
  console.log(`  ISO: ${today.toISOString()}`);
  console.log(`  Local: ${today.toLocaleDateString()}`);
  console.log("");
});

// Test specific case - if it's August 2nd in user's timezone but August 1st in UTC
const testDate = new Date("2025-08-02T00:30:00.000Z"); // August 2nd 00:30 UTC
console.log("Testing edge case:");
console.log("Input time (UTC):", testDate.toISOString());

// Simulate user in a timezone where it's still August 1st
const userTimezone = "America/New_York"; // UTC-5
const userDate = new Date(
  testDate.toLocaleString("en-US", { timeZone: userTimezone })
);
userDate.setHours(0, 0, 0, 0);
console.log(`User timezone (${userTimezone}):`, userDate.toDateString());
console.log(`User timezone ISO:`, userDate.toISOString());

// Test Asia/Jerusalem specifically
console.log("\nTesting Asia/Jerusalem timezone:");
const jerusalemDate = getTodayInTimezone("Asia/Jerusalem");
console.log(`Asia/Jerusalem date: ${jerusalemDate.toDateString()}`);
console.log(`Asia/Jerusalem ISO: ${jerusalemDate.toISOString()}`);
console.log(
  `Current time in Jerusalem: ${new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jerusalem",
  })}`
);
