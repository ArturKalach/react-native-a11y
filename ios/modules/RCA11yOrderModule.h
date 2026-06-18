//
//  RCA11yOrderModule.h
//  react-native-a11y
//
//  Imperative screen-reader order module — backs the legacy
//  `Legacy.useFocusOrder` / `Legacy.useDynamicFocusOrder` hooks.
//

#ifndef RCA11yOrderModule_h
#define RCA11yOrderModule_h

#import <Foundation/Foundation.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNA11ySpec/RNA11ySpec.h>

@interface RCA11yOrderModule : NSObject <NativeA11yOrderModuleSpec>

#else

#import <React/RCTBridgeModule.h>

@interface RCA11yOrderModule : NSObject <RCTBridgeModule>

- (void)setA11yOrder:(NSArray *)viewTags containerTag:(double)containerTag;

#endif

@end

#endif /* RCA11yOrderModule_h */
