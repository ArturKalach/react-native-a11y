//
//  RCA11yViewResolver.h
//  react-native-a11y
//
//  Cross-architecture React-tag → UIView resolution for the imperative legacy
//  modules. A single `bridge.uiManager viewForReactTag:` is not enough:
//    • Paper (old arch)        → RCTViewRegistry (bridge.uiManager)
//    • bridgeless new arch      → RCTViewRegistry (component-view provider)
//    • bridgeful  new arch      → surfacePresenter (provider is NOT installed)
//  so we chain the registry and then the surface presenter.
//

#ifndef RCA11yViewResolver_h
#define RCA11yViewResolver_h

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTSurfacePresenterStub.h>

static inline UIView *_Nullable RCA11yResolveView(
    NSNumber *_Nullable tag,
    RCTViewRegistry *_Nullable registry,
    RCTBridge *_Nullable bridge) {
  if (tag == nil) {
    return nil;
  }

  UIView *view = [registry viewForReactTag:tag];

  // bridgeful Fabric: the registry has no component-view provider, so fall back
  // to the surface presenter (nil/Paper presenter safely returns nil).
  if (view == nil && bridge != nil) {
    view = [bridge.surfacePresenter
        findComponentViewWithTag_DO_NOT_USE_DEPRECATED:tag.integerValue];
  }

  return view;
}

#endif /* RCA11yViewResolver_h */
