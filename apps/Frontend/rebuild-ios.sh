#!/bin/bash

echo "🔧 Rebuilding iOS app with HealthKit capabilities..."

# Navigate to frontend directory
cd "$(dirname "$0")"

echo "📱 Cleaning previous build..."
npx expo run:ios --clear

echo "🏗️ Building iOS app with HealthKit..."
npx expo run:ios

echo "✅ Build complete!"
echo ""
echo "📋 Next steps:"
echo "1. Open the app on your iPhone"
echo "2. Tap 'Sync HealthKit' button"
echo "3. Grant permissions when prompted"
echo "4. Add some fitness data to your Health app"
echo "5. Sync again to see real data" 