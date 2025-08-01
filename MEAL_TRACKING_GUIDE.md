# Meal Tracking System Guide

## 🍽️ Overview

The SmartFit meal tracking system allows users to:

- **Track meals by date** - Add meals for specific dates (past and present)
- **Categorize meals** - Breakfast, Lunch, Dinner, and Snacks
- **Automatic calorie estimation** - AI-powered calorie calculation from food names
- **Manual nutrition input** - Optional protein, carbs, and fat tracking
- **Daily summaries** - Automatic calculation of daily nutrition totals
- **Calendar navigation** - Browse and manage meals across different dates
- **Timezone support** - Respects user's local timezone

## 📊 Database Schema

### Meal Model

```sql
model Meal {
  id        Int      @id @default(autoincrement())
  userId    Int      @map("user_id")
  name      String
  calories  Int?
  protein   Decimal? @db.Decimal(5, 2)
  carbs     Decimal? @db.Decimal(5, 2)
  fat       Decimal? @db.Decimal(5, 2)
  mealType  String   @map("meal_type") // breakfast, lunch, dinner, snack
  date      DateTime @db.Date
  notes     String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
}
```

### DailyMealSummary Model

```sql
model DailyMealSummary {
  id              Int      @id @default(autoincrement())
  userId          Int      @map("user_id")
  date            DateTime @db.Date
  totalCalories   Int?     @map("total_calories")
  totalProtein    Decimal? @db.Decimal(8, 2) @map("total_protein")
  totalCarbs      Decimal? @db.Decimal(8, 2) @map("total_carbs")
  totalFat        Decimal? @db.Decimal(8, 2) @map("total_fat")
  breakfastCalories Int?   @map("breakfast_calories")
  lunchCalories     Int?   @map("lunch_calories")
  dinnerCalories    Int?   @map("dinner_calories")
  snackCalories     Int?   @map("snack_calories")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
}
```

## 🔧 Backend API Endpoints

### Add Meal

```http
POST /meals/add/:userId
Content-Type: application/json

{
  "name": "Grilled Chicken Salad",
  "mealType": "lunch",
  "date": "2025-08-02",
  "calories": 350,
  "protein": 25.5,
  "carbs": 15.2,
  "fat": 12.8,
  "notes": "Added extra vegetables"
}
```

### Get Today's Meals

```http
GET /meals/today/:userId?timezone=Asia/Jerusalem
```

### Get Meals by Date

```http
GET /meals/date/:userId/2025-08-02?timezone=Asia/Jerusalem
```

### Get Meals by Date Range

```http
GET /meals/range/:userId?startDate=2025-08-01&endDate=2025-08-07&timezone=Asia/Jerusalem
```

### Delete Meal

```http
DELETE /meals/:mealId?timezone=Asia/Jerusalem
```

## 🎯 Key Features

### 1. **Date-Based Tracking**

- ✅ **Past dates** - Can add meals for any past date
- ✅ **Present date** - Can add meals for today
- ❌ **Future dates** - Cannot add meals for future dates
- ✅ **Timezone aware** - Respects user's local timezone

### 2. **Meal Categories**

- 🍳 **Breakfast** - Morning meals (sunny icon)
- 🍽️ **Lunch** - Midday meals (restaurant icon)
- 🌙 **Dinner** - Evening meals (moon icon)
- ☕ **Snack** - Between-meal snacks (cafe icon)

### 3. **Automatic Calorie Estimation**

The system uses AI to estimate calories from food names:

| Food Category         | Estimated Calories |
| --------------------- | ------------------ |
| Apple, Banana, Orange | 80 cal             |
| Chicken Breast        | 165 cal            |
| Rice, Pasta           | 130 cal            |
| Salad, Vegetables     | 50 cal             |
| Bread, Toast          | 80 cal             |
| Eggs                  | 70 cal             |
| Milk, Yogurt          | 120 cal            |
| Fish, Salmon          | 200 cal            |
| Beef, Steak           | 250 cal            |
| Pizza                 | 300 cal            |
| Burger                | 350 cal            |
| Coffee, Tea           | 5 cal              |
| Water                 | 0 cal              |
| Unknown foods         | 150 cal (default)  |

### 4. **Manual Nutrition Input**

Users can optionally specify:

- **Calories** - Override automatic estimation
- **Protein** - Grams of protein
- **Carbs** - Grams of carbohydrates
- **Fat** - Grams of fat
- **Notes** - Additional information about the meal

### 5. **Daily Summaries**

Automatic calculation of daily totals:

- **Total Calories** - Sum of all meals
- **Total Protein** - Sum of protein from all meals
- **Total Carbs** - Sum of carbs from all meals
- **Total Fat** - Sum of fat from all meals
- **Meal Type Breakdown** - Calories per meal type

## 📱 Frontend Features

### 1. **Calendar Navigation**

- **Date selector** - Navigate between dates
- **Today indicator** - Shows "Today" label for current date
- **Future date restriction** - Cannot add meals for future dates
- **Previous/Next buttons** - Easy date navigation

### 2. **Meal Management**

- **Add meals** - Floating + button opens add modal
- **Delete meals** - Trash icon on each meal
- **Edit meals** - Coming soon
- **View meal details** - Expandable meal cards

### 3. **Visual Design**

- **Color-coded meal types**:
  - Breakfast: Yellow (#fbbf24)
  - Lunch: Green (#10b981)
  - Dinner: Purple (#8b5cf6)
  - Snack: Orange (#f59e0b)
- **Dark theme** - Black background with red accents
- **Responsive design** - Works on all screen sizes

### 4. **User Experience**

- **Empty states** - Helpful messages when no meals
- **Loading states** - Visual feedback during operations
- **Error handling** - User-friendly error messages
- **Success feedback** - Confirmation messages

## 🧪 Testing

### Test the System

```bash
cd apps/Frontend
node test-meal-tracking.js
```

This will test:

- ✅ Timezone detection
- ✅ Date calculations
- ✅ Meal type options
- ✅ Calorie estimation
- ✅ Date validation

### Manual Testing Steps

1. **Start the backend**:

   ```bash
   cd apps/Backend
   npm start
   ```

2. **Start the frontend**:

   ```bash
   cd apps/Frontend
   npx expo start
   ```

3. **Test meal tracking**:
   - Open the app
   - Navigate to "Track Meal"
   - Try adding meals for different dates
   - Test different meal types
   - Verify calorie calculations
   - Check daily summaries

## 🔮 Future Enhancements

### Planned Features

- **Meal editing** - Edit existing meals
- **Meal templates** - Save common meals
- **Barcode scanning** - Scan food packages
- **Photo recognition** - AI food recognition from photos
- **Recipe import** - Import recipes from URLs
- **Nutrition goals** - Set daily nutrition targets
- **Progress tracking** - Track nutrition over time
- **Export data** - Export meal data to CSV/PDF

### AI Integration

- **Enhanced calorie estimation** - More accurate AI models
- **Food recognition** - Identify foods from photos
- **Nutritional analysis** - Detailed nutritional breakdown
- **Dietary recommendations** - AI-powered meal suggestions
- **Trend analysis** - Identify eating patterns

## 🎉 Summary

The meal tracking system provides:

- ✅ **Complete meal management** - Add, view, delete meals
- ✅ **Date-based organization** - Track meals by specific dates
- ✅ **Automatic calculations** - AI-powered calorie estimation
- ✅ **Manual override** - Custom nutrition input
- ✅ **Daily summaries** - Automatic nutrition totals
- ✅ **Timezone support** - Respects user's local time
- ✅ **Beautiful UI** - Modern, intuitive interface
- ✅ **Future-ready** - Easy to extend with new features

The system is now ready for use and can be easily extended with AI features in the future!
