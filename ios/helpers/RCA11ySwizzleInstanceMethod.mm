//
//  RCA11ySwizzleInstanceMethod.mm
//  react-native-a11y
//

#import "RCA11ySwizzleInstanceMethod.h"

void RCA11ySwizzleInstanceMethod(Class swizzleClass, SEL originalSelector, SEL swizzledSelector) {
    Method originalMethod = class_getInstanceMethod(swizzleClass, originalSelector);
    Method swizzledMethod = class_getInstanceMethod(swizzleClass, swizzledSelector);
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

void RCA11ySwizzleInstanceMethodIfPresent(Class swizzleClass, SEL originalSelector, SEL swizzledSelector) {
    // Only swizzle when a real IMP exists (directly or inherited): otherwise the
    // swizzle would install our method over a missing implementation and leave the
    // renamed selector pointing at nothing.
    if (class_getInstanceMethod(swizzleClass, originalSelector)) {
        RCA11ySwizzleInstanceMethod(swizzleClass, originalSelector, swizzledSelector);
    }
}
