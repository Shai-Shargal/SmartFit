const fs = require("fs");
const path = require("path");

console.log("🔍 Checking HealthKit Setup...\n");

const iosPath = path.join(__dirname, "ios");
const requiredFiles = [
  "HealthKitManager.swift",
  "HealthKitManager.m",
  "SmartFit.entitlements",
  "Info.plist",
];

console.log("📁 Checking required files:");
let allFilesExist = true;

requiredFiles.forEach((file) => {
  const filePath = path.join(iosPath, file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? "✅" : "❌"} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log("\n📋 Checking Info.plist permissions...");
const infoPlistPath = path.join(iosPath, "Info.plist");
if (fs.existsSync(infoPlistPath)) {
  const content = fs.readFileSync(infoPlistPath, "utf8");
  const hasHealthShare = content.includes("NSHealthShareUsageDescription");
  const hasHealthUpdate = content.includes("NSHealthUpdateUsageDescription");

  console.log(
    `  ${hasHealthShare ? "✅" : "❌"} NSHealthShareUsageDescription`
  );
  console.log(
    `  ${hasHealthUpdate ? "✅" : "❌"} NSHealthUpdateUsageDescription`
  );
} else {
  console.log("  ❌ Info.plist not found");
}

console.log("\n🔧 Checking entitlements...");
const entitlementsPath = path.join(iosPath, "SmartFit.entitlements");
if (fs.existsSync(entitlementsPath)) {
  const content = fs.readFileSync(entitlementsPath, "utf8");
  const hasHealthKit = content.includes("com.apple.developer.healthkit");

  console.log(`  ${hasHealthKit ? "✅" : "❌"} HealthKit entitlements`);
} else {
  console.log("  ❌ SmartFit.entitlements not found");
}

console.log("\n📱 Next Steps:");
if (allFilesExist) {
  console.log("✅ All files exist! Now you need to:");
  console.log("1. Open Xcode: cd ios && open SmartFit.xcworkspace");
  console.log("2. Add HealthKit capability in Signing & Capabilities");
  console.log("3. Rebuild: npx expo run:ios --clear");
  console.log("4. Test on physical device (not simulator)");
} else {
  console.log("❌ Some files are missing. Please check the setup.");
}

console.log("\n💡 Remember: HealthKit only works on physical iOS devices!");
