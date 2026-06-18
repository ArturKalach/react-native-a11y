//
//  RCA11yOrderModule.mm
//  react-native-a11y
//
//  Faithful port of the legacy 0.7 `RCA11yModule setA11yOrder:node:`. Resolves
//  the ordered child view tags (and the optional container tag) and sets the
//  container's `accessibilityElements`, posting a screen-changed notification so
//  VoiceOver re-reads the new sequence.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>
#import "RCA11yOrderModule.h"
#import "RCA11yViewResolver.h"

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;
#endif

@implementation RCA11yOrderModule

// Cross-arch view lookup — see RCA11yViewResolver.h.
@synthesize viewRegistry_DEPRECATED = _viewRegistry;
@synthesize bridge = _bridge;

+ (BOOL)requiresMainQueueSetup { return YES; }

RCT_EXPORT_MODULE(A11yOrderModule);

// Shared impl for both architectures. `containerTag <= 0` means "no container".
- (void)_applyOrder:(NSArray *)viewTags containerTag:(double)containerTag {
    __weak RCA11yOrderModule *weakSelf = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        RCA11yOrderModule *strongSelf = weakSelf;
        if (strongSelf == nil) {
            return;
        }
        RCTViewRegistry *registry = strongSelf.viewRegistry_DEPRECATED;
        RCTBridge *bridge = strongSelf.bridge;

        UIView *container = nil;
        if (containerTag > 0) {
            container = RCA11yResolveView(@((NSInteger)containerTag), registry, bridge);
            if (container != nil) {
                UIAccessibilityPostNotification(UIAccessibilityScreenChangedNotification, container);
            }
        }

        NSMutableArray<UIView *> *views = [NSMutableArray arrayWithCapacity:viewTags.count];
        for (id obj in viewTags) {
            if (![obj isKindOfClass:[NSNumber class]]) {
                continue;
            }
            UIView *view = RCA11yResolveView((NSNumber *)obj, registry, bridge);
            if (view != nil) {
                [views addObject:view];
            }
        }

        if (container != nil) {
            [container setAccessibilityElements:views.count > 0 ? views : nil];
        }
    });
}

#ifdef RCT_NEW_ARCH_ENABLED

- (void)setA11yOrder:(NSArray *)viewTags containerTag:(double)containerTag {
    [self _applyOrder:viewTags containerTag:containerTag];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeA11yOrderModuleSpecJSI>(params);
}

#else

RCT_EXPORT_METHOD(setA11yOrder:(NSArray *)viewTags containerTag:(double)containerTag) {
    [self _applyOrder:viewTags containerTag:containerTag];
}

#endif // RCT_NEW_ARCH_ENABLED

@end
