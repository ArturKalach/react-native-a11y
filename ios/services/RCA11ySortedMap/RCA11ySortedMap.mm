//
//  RCA11ySortedMap.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11ySortedMap.h"

@implementation RCA11ySortedMap {
  NSMapTable *_dictionary;
  NSMutableArray<NSNumber *> *_sortedKeys;
  NSMutableArray *_cachedValues;
  BOOL _isDirty;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    _dictionary = [NSMapTable strongToWeakObjectsMapTable];
    _sortedKeys = [NSMutableArray array];
    _cachedValues = [NSMutableArray array];
    _isDirty = YES;
  }
  return self;
}

- (void)updateSortedKey:(NSNumber *)position {
  NSRange range = NSMakeRange(0, _sortedKeys.count);
  NSUInteger insertIndex = [_sortedKeys indexOfObject:position
                                        inSortedRange:range
                                              options:NSBinarySearchingInsertionIndex
                                      usingComparator:^NSComparisonResult(NSNumber *a, NSNumber *b) {
    return [a compare:b];
  }];
  [_sortedKeys insertObject:position atIndex:insertIndex];
}

- (void)put:(NSNumber *)position withObject:(NSObject *)obj {
  _isDirty = YES;
  if ([_dictionary objectForKey:position] == nil) {
    [self updateSortedKey:position];
  }
  [_dictionary setObject:obj forKey:position];
}

- (void)remove:(NSNumber *)position {
  _isDirty = YES;
  NSUInteger index = [_sortedKeys indexOfObject:position];
  if (index != NSNotFound) {
    [_sortedKeys removeObjectAtIndex:index];
  }
  [_dictionary removeObjectForKey:position];
}

- (void)remove:(NSNumber *)position withObject:(NSObject *)obj {
  if ([_dictionary objectForKey:position] == obj) {
    _isDirty = YES;
    NSUInteger index = [_sortedKeys indexOfObject:position];
    if (index != NSNotFound) {
      [_sortedKeys removeObjectAtIndex:index];
    }
    [_dictionary removeObjectForKey:position];
  }
}

- (void)update:(NSNumber *)lastPosition withPosition:(NSNumber *)position withObject:(NSObject *)obj {
  [self remove:lastPosition withObject:obj];
  [self put:position withObject:obj];
}

- (void)clear {
  _isDirty = YES;
  [_dictionary removeAllObjects];
  [_sortedKeys removeAllObjects];
  [_cachedValues removeAllObjects];
}

- (NSArray *)getValues {
  if (_isDirty) {
    [_cachedValues removeAllObjects];
    for (NSNumber *key in _sortedKeys) {
      NSObject *obj = [_dictionary objectForKey:key];
      if (obj) { [_cachedValues addObject:obj]; }
    }
    _isDirty = NO;
  }
  return [NSArray arrayWithArray:_cachedValues];
}

- (BOOL)isEmpty {
  return _dictionary.count == 0;
}

@end
