//
//  RCA11ySwizzleInstanceMethod.h
//  react-native-a11y
//
//  Single swizzle utility for the merged package — unifies react-native-a11y-order's
//  RNAOSwizzleInstanceMethod/RNAOSwizzleInstall and react-native-external-keyboard's
//  RNCEKVSwizzleInstanceMethod/RNCEKVSwizzlingHelper into one global function +
//  install macro, so there is exactly one definition (no duplicate symbols, no two
//  swizzle paths fighting over the same RN/UIKit methods).
//

#ifndef RCA11ySwizzleInstanceMethod_h
#define RCA11ySwizzleInstanceMethod_h

#import <Foundation/Foundation.h>
#import <objc/runtime.h>

void RCA11ySwizzleInstanceMethod(Class swizzleClass, SEL originalSelector, SEL swizzledSelector);

#define RCA11y_CONCAT_INNER(a, b) a##b
#define RCA11y_CONCAT(a, b) RCA11y_CONCAT_INNER(a, b)

#ifdef RCT_DYNAMIC_FRAMEWORKS

#define RCA11y_INSTALL_SWIZZLES(registerFn)                                    \
  __attribute__((constructor))                                                 \
  static void RCA11y_CONCAT(RCA11yInstall_, registerFn)(void) { registerFn(); }

#else

#define RCA11y_INSTALL_SWIZZLES(registerFn)                                    \
  + (void)load {                                                               \
    static dispatch_once_t RCA11y_CONCAT(once_, registerFn);                   \
    dispatch_once(&RCA11y_CONCAT(once_, registerFn), ^{ registerFn(); });      \
  }

#endif

#endif /* RCA11ySwizzleInstanceMethod_h */
