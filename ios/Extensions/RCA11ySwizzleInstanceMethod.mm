//
//  RCA11ySwizzleInstanceMethod.mm
//  react-native-a11y
//
//  Created by Artur Kalach on 13/06/2026.
//

#import "RCA11ySwizzleInstanceMethod.h"

void RCA11ySwizzleInstanceMethod(Class swizzleClass, SEL originalSelector, SEL swizzledSelector) {
  Method originalMethod = class_getInstanceMethod(swizzleClass, originalSelector);
  Method swizzledMethod = class_getInstanceMethod(swizzleClass, swizzledSelector);

  if (!originalMethod || !swizzledMethod) {
    return;
  }

  BOOL didAddMethod = class_addMethod(swizzleClass,
                                      originalSelector,
                                      method_getImplementation(swizzledMethod),
                                      method_getTypeEncoding(swizzledMethod));

  if (didAddMethod) {
    class_replaceMethod(swizzleClass,
                        swizzledSelector,
                        method_getImplementation(originalMethod),
                        method_getTypeEncoding(originalMethod));
  } else {
    method_exchangeImplementations(originalMethod, swizzledMethod);
  }
}
