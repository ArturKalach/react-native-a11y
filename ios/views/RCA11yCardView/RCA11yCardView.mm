//
//  RCA11yCardView.mm
//  react-native-a11y
//

#import "RCA11yCardView.h"

#ifdef RCT_NEW_ARCH_ENABLED

#import <react/renderer/components/RNA11ySpec/ComponentDescriptors.h>
#import <react/renderer/components/RNA11ySpec/RCTComponentViewHelpers.h>
#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

#endif

@implementation RCA11yCardView {
  UIFocusGuide *_contentFocusGuide;
  NSString *_overlayFocusGroupIdentifier;
  NSString *_contentFocusGroupIdentifier;
}

- (nullable NSArray *)accessibilityElements {
  return self.subviews;
}

- (void)willRemoveSubview:(UIView *)subview {
  [super willRemoveSubview:subview];
  if (@available(iOS 15.0, *)) {
    NSString *identifier = subview.focusGroupIdentifier;
    if ([identifier isEqualToString:_overlayFocusGroupIdentifier] ||
        [identifier isEqualToString:_contentFocusGroupIdentifier]) {
      subview.focusGroupIdentifier = nil;
    }
  }
}

- (void)assignFocusGroupIdentifierToChild:(UIView *)child atIndex:(NSInteger)index {
  if (@available(iOS 15.0, *)) {
    if (!_overlayFocusGroupIdentifier) {
      _overlayFocusGroupIdentifier =
          [NSString stringWithFormat:@"RCA11yCard-%p-overlay", self];
      _contentFocusGroupIdentifier =
          [NSString stringWithFormat:@"RCA11yCard-%p-content", self];
    }
    if (index == 0) {
      child.focusGroupIdentifier = _overlayFocusGroupIdentifier;
    } else if (index == 1) {
      child.focusGroupIdentifier = _contentFocusGroupIdentifier;
    }
  }
}

#ifdef RCT_NEW_ARCH_ENABLED

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                          index:(NSInteger)index {
  [super mountChildComponentView:childComponentView index:index];
  [self assignFocusGroupIdentifierToChild:childComponentView atIndex:index];
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<RCA11yCardComponentDescriptor>();
}

Class<RCTComponentViewProtocol> RCA11yCardCls(void) {
  return RCA11yCardView.class;
}

#else

- (void)didAddSubview:(UIView *)subview {
  [super didAddSubview:subview];
  NSUInteger index = [self.subviews indexOfObject:subview];
  if (index != NSNotFound) {
    [self assignFocusGroupIdentifierToChild:subview atIndex:(NSInteger)index];
  }
}

#endif

@end
