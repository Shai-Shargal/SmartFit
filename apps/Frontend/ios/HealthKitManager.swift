import Foundation
import HealthKit

@objc(HealthKitManager)
class HealthKitManager: NSObject {
  
  private let healthStore = HKHealthStore()
  
  @objc
  func requestHealthKitPermissions(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // Check if HealthKit is available
    guard HKHealthStore.isHealthDataAvailable() else {
      reject("ERROR", "HealthKit is not available on this device", nil)
      return
    }
    
    // Define the types of data we want to read
    let typesToRead: Set<HKObjectType> = [
      HKObjectType.quantityType(forIdentifier: .stepCount)!,
      HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
      HKObjectType.quantityType(forIdentifier: .appleExerciseTime)!,
      HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning)!,
      HKObjectType.quantityType(forIdentifier: .flightsClimbed)!,
      HKObjectType.quantityType(forIdentifier: .heartRate)!,
      HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
    ]
    
    // Request authorization
    healthStore.requestAuthorization(toShare: nil, read: typesToRead) { success, error in
      DispatchQueue.main.async {
        if success {
          resolve(true)
        } else {
          reject("ERROR", "Failed to get HealthKit permissions: \(error?.localizedDescription ?? "Unknown error")", error)
        }
      }
    }
  }
  
  @objc
  func getTodayFitnessData(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // Check if HealthKit is available
    guard HKHealthStore.isHealthDataAvailable() else {
      reject("ERROR", "HealthKit is not available on this device", nil)
      return
    }
    
    let calendar = Calendar.current
    let now = Date()
    let startOfDay = calendar.startOfDay(for: now)
    let endOfDay = calendar.date(byAdding: .day, value: 1, to: startOfDay)!
    
    let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: endOfDay, options: .strictStartDate)
    
    var fitnessData: [String: Any] = [
      "steps": 0,
      "caloriesBurned": 0,
      "activeMinutes": 0,
      "distance": 0.0,
      "floorsClimbed": 0,
      "heartRate": 0,
      "sleepHours": 0.0
    ]
    
    let group = DispatchGroup()
    
    // Get step count
    group.enter()
    getStepCount(predicate: predicate) { steps in
      fitnessData["steps"] = steps
      group.leave()
    }
    
    // Get calories burned
    group.enter()
    getCaloriesBurned(predicate: predicate) { calories in
      fitnessData["caloriesBurned"] = calories
      group.leave()
    }
    
    // Get active minutes
    group.enter()
    getActiveMinutes(predicate: predicate) { minutes in
      fitnessData["activeMinutes"] = minutes
      group.leave()
    }
    
    // Get distance
    group.enter()
    getDistance(predicate: predicate) { distance in
      fitnessData["distance"] = distance
      group.leave()
    }
    
    // Get floors climbed
    group.enter()
    getFloorsClimbed(predicate: predicate) { floors in
      fitnessData["floorsClimbed"] = floors
      group.leave()
    }
    
    // Get heart rate
    group.enter()
    getHeartRate(predicate: predicate) { heartRate in
      fitnessData["heartRate"] = heartRate
      group.leave()
    }
    
    // Get sleep hours
    group.enter()
    getSleepHours(predicate: predicate) { sleepHours in
      fitnessData["sleepHours"] = sleepHours
      group.leave()
    }
    
    group.notify(queue: .main) {
      resolve(fitnessData)
    }
  }
  
  private func getStepCount(predicate: NSPredicate, completion: @escaping (Int) -> Void) {
    guard let stepType = HKQuantityType.quantityType(forIdentifier: .stepCount) else {
      completion(0)
      return
    }
    
    let query = HKStatisticsQuery(quantityType: stepType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
      let steps = result?.sumQuantity()?.doubleValue(for: HKUnit.count()) ?? 0
      completion(Int(steps))
    }
    
    healthStore.execute(query)
  }
  
  private func getCaloriesBurned(predicate: NSPredicate, completion: @escaping (Int) -> Void) {
    guard let calorieType = HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned) else {
      completion(0)
      return
    }
    
    let query = HKStatisticsQuery(quantityType: calorieType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
      let calories = result?.sumQuantity()?.doubleValue(for: HKUnit.kilocalorie()) ?? 0
      completion(Int(calories))
    }
    
    healthStore.execute(query)
  }
  
  private func getActiveMinutes(predicate: NSPredicate, completion: @escaping (Int) -> Void) {
    guard let exerciseType = HKQuantityType.quantityType(forIdentifier: .appleExerciseTime) else {
      completion(0)
      return
    }
    
    let query = HKStatisticsQuery(quantityType: exerciseType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
      let minutes = result?.sumQuantity()?.doubleValue(for: HKUnit.minute()) ?? 0
      completion(Int(minutes))
    }
    
    healthStore.execute(query)
  }
  
  private func getDistance(predicate: NSPredicate, completion: @escaping (Double) -> Void) {
    guard let distanceType = HKQuantityType.quantityType(forIdentifier: .distanceWalkingRunning) else {
      completion(0.0)
      return
    }
    
    let query = HKStatisticsQuery(quantityType: distanceType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
      let distance = result?.sumQuantity()?.doubleValue(for: HKUnit.meter()) ?? 0
      completion(distance / 1000) // Convert to kilometers
    }
    
    healthStore.execute(query)
  }
  
  private func getFloorsClimbed(predicate: NSPredicate, completion: @escaping (Int) -> Void) {
    guard let floorType = HKQuantityType.quantityType(forIdentifier: .flightsClimbed) else {
      completion(0)
      return
    }
    
    let query = HKStatisticsQuery(quantityType: floorType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
      let floors = result?.sumQuantity()?.doubleValue(for: HKUnit.count()) ?? 0
      completion(Int(floors))
    }
    
    healthStore.execute(query)
  }
  
  private func getHeartRate(predicate: NSPredicate, completion: @escaping (Int) -> Void) {
    guard let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate) else {
      completion(0)
      return
    }
    
    let query = HKStatisticsQuery(quantityType: heartRateType, quantitySamplePredicate: predicate, options: .discreteAverage) { _, result, _ in
      let heartRate = result?.averageQuantity()?.doubleValue(for: HKUnit(from: "count/min")) ?? 0
      completion(Int(heartRate))
    }
    
    healthStore.execute(query)
  }
  
  private func getSleepHours(predicate: NSPredicate, completion: @escaping (Double) -> Void) {
    guard let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else {
      completion(0.0)
      return
    }
    
    let query = HKSampleQuery(sampleType: sleepType, predicate: predicate, limit: HKQueryObjectLimitNone, sortDescriptors: nil) { _, samples, _ in
      var totalSleepTime: TimeInterval = 0
      
      if let sleepSamples = samples as? [HKCategorySample] {
        for sample in sleepSamples {
          if sample.value == HKCategoryValueSleepAnalysis.inBed.rawValue || sample.value == HKCategoryValueSleepAnalysis.asleep.rawValue {
            totalSleepTime += sample.endDate.timeIntervalSince(sample.startDate)
          }
        }
      }
      
      let sleepHours = totalSleepTime / 3600 // Convert seconds to hours
      completion(sleepHours)
    }
    
    healthStore.execute(query)
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
} 