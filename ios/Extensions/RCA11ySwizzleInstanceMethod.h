//
//  RCA11ySwizzleInstanceMethod.h
//  react-native-a11y
//
//  Created by Artur Kalach on 13/06/2026.
//

#ifndef RCA11ySwizzleInstanceMethod_h
#define RCA11ySwizzleInstanceMethod_h

#import <Foundation/Foundation.h>
#import <objc/runtime.h>

void RCA11ySwizzleInstanceMethod(Class swizzleClass, SEL originalSelector, SEL swizzledSelector);

#define RCA11Y_CONCAT_INNER(a, b) a##b
#define RCA11Y_CONCAT(a, b) RCA11Y_CONCAT_INNER(a, b)

#ifdef RCT_DYNAMIC_FRAMEWORKS

#define RCA11Y_INSTALL_SWIZZLES(registerFn)                                    \
  __attribute__((constructor))                                                 \
  static void RCA11Y_CONCAT(RCA11yInstall_, registerFn)(void) { registerFn(); }

#else

#define RCA11Y_INSTALL_SWIZZLES(registerFn)                                    \
  + (void)load {                                                               \
    static dispatch_once_t RCA11Y_CONCAT(once_, registerFn);                   \
    dispatch_once(&RCA11Y_CONCAT(once_, registerFn), ^{ registerFn(); });      \
  }

#endif

#endif /* RCA11ySwizzleInstanceMethod_h */
