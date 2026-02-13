# Performance Fixes to Prevent App Crashes

## Critical Issues Found

### 1. **Memory Leaks from Excessive console.log**
- Found 100+ console.log statements throughout the app
- These accumulate in memory over time causing crashes
- **Action**: Remove or comment out all non-critical console.logs

### 2. **Missing Timeout Cleanup**
- `Home.tsx` and `RestaurantList.tsx` have setTimeout without clearTimeout
- **Fixed**: Added `return () => clearTimeout(delaySearch);` in Home.tsx

### 3. **Unlimited Thumbnail Cache Growth**
- NearbyPlaces, CityDetails, and NearestCities generate thumbnails without limit
- **Action Required**: Limit thumbnail cache to 50 items max
- Implement LRU (Least Recently Used) eviction

### 4. **LoadedImages State Growing Indefinitely**
- Every image load adds to state without cleanup
- **Action Required**: Limit to 100 items, keep only recent 50

### 5. **Video Memory Leaks**
- Video components may not release memory properly
- **Action**: Ensure Video components are properly unmounted

## Immediate Actions to Take

### 1. Remove Console Logs (Critical)
Search and remove/comment these in production:
```bash
# In all files under src/
- console.log
- console.warn (keep console.error for critical issues)
```

### 2. Add Cleanup Functions
Every useEffect with setTimeout/setInterval needs cleanup:
```javascript
useEffect(() => {
  const timer = setTimeout(() => {...}, delay);
  return () => clearTimeout(timer); // ADD THIS
}, [deps]);
```

### 3. Limit State Object Growth
```javascript
// For thumbnails
setThumbnails(prev => {
  const keys = Object.keys(prev);
  if (keys.length >= 50) {
    const { [keys[0]]: removed, ...rest } = prev;
    return { ...rest, [newKey]: newValue };
  }
  return { ...prev, [newKey]: newValue };
});
```

### 4. Clear Video Resources
```javascript
// In video modals, add cleanup
useEffect(() => {
  return () => {
    setSelectedVideo(null);
    setVideoModalVisible(false);
  };
}, []);
```

### 5. Optimize Image Loading
- Use FastImage with proper cache limits
- Clear FastImage cache periodically:
```javascript
import FastImage from 'react-native-fast-image';

// Call this when memory is low
FastImage.clearMemoryCache();
FastImage.clearDiskCache();
```

## Files That Need Immediate Attention

1. **NearbyPlaces.tsx** - Thumbnail generation, loadedImages state
2. **Home.tsx** - Fixed timeout cleanup ✓
3. **CityDetails.tsx** - Multiple console.logs, thumbnail generation
4. **RestaurantList.tsx** - Timeout cleanup needed
5. **Map.tsx** - 15+ console.logs
6. **UserProfile.tsx** - 7 console.logs

## Testing Recommendations

1. Use React Native Debugger memory profiler
2. Test app for 15+ minutes continuously
3. Monitor memory usage in Xcode/Android Studio
4. Check for memory warnings in logs

## Production Build Settings

Add to package.json scripts:
```json
"build:production": "react-native bundle --dev false --minify true"
```

This will automatically remove console statements in production.
