# HealthKit Integration Setup Guide

This guide explains how to set up HealthKit integration for the SmartFit app to fetch real fitness data from your iPhone's Health app.

## Overview

The HealthKit integration allows the SmartFit app to:

- Request permission to access your Health data
- Fetch today's fitness metrics (steps, calories burned, active minutes, etc.)
- Sync this data with the backend database
- Display real-time progress on the main screen

## Prerequisites

1. **iOS Device**: HealthKit is only available on iOS devices
2. **Apple Developer Account**: Required for HealthKit capabilities
3. **Xcode**: Latest version recommended
4. **React Native Development Environment**: Properly configured

## Setup Steps

### 1. Backend Database Setup

The database has been updated with a new `DailyFitnessData` model. Run the migration:

```bash
cd apps/Backend
npx prisma migrate dev --name add_daily_fitness_data
```

### 2. iOS Project Configuration

#### A. Add HealthKit Capability

1. Open your iOS project in Xcode
2. Select your project target
3. Go to "Signing & Capabilities"
4. Click "+ Capability"
5. Add "HealthKit"

#### B. Update Info.plist

The `Info.plist` file has been created with the necessary permissions:

- `NSHealthShareUsageDescription`: Permission to read health data
- `NSHealthUpdateUsageDescription`: Permission to write health data

#### C. Add Entitlements File

The `SmartFit.entitlements` file has been created with HealthKit access.

### 3. Native Module Files

The following files have been created:

- `HealthKitManager.swift`: Swift implementation for HealthKit data fetching
- `HealthKitManager.m`: Objective-C bridge for React Native
- `healthKitService.js`: JavaScript service for HealthKit integration

### 4. Frontend Integration

The MainScreen has been updated to include:

- HealthKit sync button (iOS only)
- Real fitness data display
- Progress tracking with actual metrics

## Usage

### For Users

1. **First Time Setup**:

   - Open the SmartFit app on your iPhone
   - Tap "Sync HealthKit Data" button
   - Grant permission when prompted
   - Your fitness data will be synced

2. **Regular Usage**:
   - Pull to refresh or tap sync button to update data
   - View your daily progress in real-time
   - Data is automatically fetched from your Health app

### For Developers

#### Testing HealthKit Data

1. **Simulator Testing**:

   - HealthKit doesn't work in iOS Simulator
   - Use a physical iOS device for testing

2. **Manual Data Entry**:
   - Add fitness data to your iPhone's Health app
   - Use the Health app to manually enter steps, workouts, etc.
   - Sync with SmartFit app

#### API Endpoints

The backend provides these endpoints:

- `GET /api/fitness/today/:userId`: Get today's fitness data
- `POST /api/fitness/update/:userId`: Update fitness data
- `GET /api/fitness/range/:userId`: Get data for a date range

## Data Flow

1. **User taps "Sync HealthKit Data"**
2. **App requests HealthKit permissions**
3. **HealthKit returns today's fitness data**
4. **App sends data to backend API**
5. **Backend stores data in database**
6. **App displays updated progress**

## Supported Metrics

The app fetches these metrics from HealthKit:

- **Steps**: Daily step count
- **Calories Burned**: Active calories burned
- **Active Minutes**: Apple's exercise minutes
- **Distance**: Walking/running distance in km
- **Floors Climbed**: Floors climbed
- **Heart Rate**: Average heart rate (if available)
- **Sleep Hours**: Sleep duration (if available)

## Troubleshooting

### Common Issues

1. **"HealthKit is not available"**:

   - Ensure you're testing on a physical iOS device
   - Check that HealthKit capability is added in Xcode

2. **Permission denied**:

   - Go to iPhone Settings > Privacy & Security > Health
   - Enable permissions for SmartFit app

3. **No data showing**:

   - Check that your Health app has data for today
   - Try manually adding some fitness data to Health app
   - Ensure the sync button is tapped

4. **Build errors**:
   - Clean and rebuild the project
   - Ensure all native files are properly linked
   - Check that entitlements file is included in build

### Debug Steps

1. **Check HealthKit availability**:

   ```javascript
   console.log("HealthKit available:", healthKitService.isHealthKitAvailable());
   ```

2. **Test permissions**:

   ```javascript
   try {
     await healthKitService.requestPermissions();
     console.log("Permissions granted");
   } catch (error) {
     console.error("Permission error:", error);
   }
   ```

3. **Test data fetching**:
   ```javascript
   try {
     const data = await healthKitService.getTodayFitnessData();
     console.log("HealthKit data:", data);
   } catch (error) {
     console.error("Data fetch error:", error);
   }
   ```

## Security & Privacy

- HealthKit data is only fetched when user explicitly syncs
- Data is stored securely in the backend database
- No health data is shared with third parties
- Users can revoke permissions at any time

## Future Enhancements

Potential improvements:

- Background sync capabilities
- Historical data analysis
- Custom fitness goals
- Workout type detection
- Integration with other fitness apps

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Verify all setup steps are completed
3. Test on a physical iOS device
4. Check console logs for error messages
