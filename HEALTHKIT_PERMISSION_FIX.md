# HealthKit Permission Fix Guide

## Problem

You're getting this error:

```
ERROR Error requesting HealthKit permissions: [TypeError: Cannot read property 'requestHealthKitPermissions' of null]
```

This means the native HealthKit module isn't properly linked to your React Native app.

## Solution: Step-by-Step Fix

### Step 1: Check Current Setup

First, let's verify what you have:

```bash
cd apps/Frontend
ls ios/
```

You should see:

- `HealthKitManager.swift`
- `HealthKitManager.m`
- `SmartFit.entitlements`
- `Info.plist`

### Step 2: Open Xcode and Add HealthKit Capability

1. **Open Xcode**:

   ```bash
   cd apps/Frontend/ios
   open SmartFit.xcworkspace
   ```

2. **Select your project**:

   - Click on "SmartFit" in the left sidebar
   - Select the "SmartFit" target (not the project)

3. **Add HealthKit capability**:

   - Click "Signing & Capabilities" tab
   - Click the "+" button (top left)
   - Search for "HealthKit"
   - Click "HealthKit" to add it

4. **Verify entitlements**:
   - You should see "HealthKit" in the capabilities list
   - Make sure `SmartFit.entitlements` file is selected

### Step 3: Check Info.plist Permissions

Open `apps/Frontend/ios/Info.plist` and verify these entries exist:

```xml
<key>NSHealthShareUsageDescription</key>
<string>This app needs access to your health data to display your fitness progress and sync with your fitness tracking.</string>
<key>NSHealthUpdateUsageDescription</key>
<string>This app needs permission to update your health data to sync your fitness activities.</string>
```

### Step 4: Check Entitlements File

Open `apps/Frontend/ios/SmartFit.entitlements` and verify it contains:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.healthkit</key>
    <true/>
    <key>com.apple.developer.healthkit.access</key>
    <array/>
</dict>
</plist>
```

### Step 5: Clean and Rebuild

**IMPORTANT**: You must rebuild the app after adding HealthKit capability.

1. **Stop any running processes**:

   ```bash
   # Press Ctrl+C to stop any running Metro bundler
   ```

2. **Clean the build**:

   ```bash
   cd apps/Frontend
   npx expo run:ios --clear
   ```

3. **Rebuild the app**:
   ```bash
   npx expo run:ios
   ```

### Step 6: Test on Physical Device

**CRITICAL**: HealthKit only works on physical iOS devices, not the simulator.

1. **Connect your iPhone** to your computer
2. **Trust the developer certificate** on your iPhone if prompted
3. **Install the app** on your iPhone

### Step 7: Test Permissions

1. **Open the app** on your iPhone
2. **Tap "Sync HealthKit"** button
3. **You should see a permission dialog** asking to access Health data
4. **Grant permission** when prompted

## Troubleshooting

### If you still get the null error:

1. **Check if HealthKit capability is added**:

   - Open Xcode
   - Go to Signing & Capabilities
   - Verify "HealthKit" appears in the list

2. **Verify native files are linked**:

   ```bash
   cd apps/Frontend/ios
   ls -la HealthKitManager.*
   ```

   Should show both `.swift` and `.m` files

3. **Clean and rebuild again**:
   ```bash
   cd apps/Frontend
   rm -rf ios/build
   npx expo run:ios --clear
   ```

### If permission dialog doesn't appear:

1. **Check device settings**:

   - Go to iPhone Settings > Privacy & Security > Health
   - Make sure SmartFit app has permission

2. **Reinstall the app**:
   - Delete the app from your iPhone
   - Rebuild and reinstall

### If you're using Expo:

If you're using Expo managed workflow, you might need to eject to bare workflow for HealthKit:

```bash
cd apps/Frontend
npx expo eject
```

## Expected Results

After following these steps:

1. **Permission Dialog**: You'll see a popup asking to access Health data
2. **Real Data**: The app will read actual steps, calories, etc. from your iPhone's Fitness app
3. **No More Null Error**: The `requestHealthKitPermissions` function will work

## Test the Fix

1. **Add test data** to your iPhone's Health app:

   - Open Health app
   - Add some steps or workout data
   - Make sure it's for today's date

2. **Sync in SmartFit**:
   - Tap "Sync HealthKit" button
   - Grant permissions
   - Check that real data appears

## Common Issues

| Issue                    | Solution                                          |
| ------------------------ | ------------------------------------------------- |
| Still getting null error | Rebuild the app after adding HealthKit capability |
| No permission dialog     | Check that HealthKit capability is added in Xcode |
| HealthKit not available  | Test on physical device (not simulator)           |
| Build fails              | Clean build folder and try again                  |

## Next Steps

Once permissions work:

1. **Add fitness data** to your Health app
2. **Sync with SmartFit** app
3. **Verify real data** appears in the app
4. **Check timezone sync** - data should match your local time

## Support

If you still have issues:

1. Check that all files exist in the correct locations
2. Verify HealthKit capability is added in Xcode
3. Make sure you're testing on a physical device
4. Clean and rebuild the app completely
