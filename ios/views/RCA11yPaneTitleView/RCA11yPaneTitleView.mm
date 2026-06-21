//
//  RCA11yPaneTitleView.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>

#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import "RCA11yPaneTitleView.h"
#import "UIViewController+RCA11y.h"
#import "RCA11yAnnounceService.h"
#import "RCA11ySpeechAttributes.h"

#ifdef RCT_NEW_ARCH_ENABLED

#include <string>
#import <react/renderer/components/RNA11ySpec/ComponentDescriptors.h>
#import <react/renderer/components/RNA11ySpec/EventEmitters.h>
#import <react/renderer/components/RNA11ySpec/Props.h>
#import <react/renderer/components/RNA11ySpec/RCTComponentViewHelpers.h>
#import "RCA11yPropsHelper.h"
#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RCA11yPaneTitleView () <RCTA11yPaneTitleViewProtocol>

@end

#endif



@implementation RCA11yPaneTitleView {
  BOOL _announced;
}


#ifdef RCT_NEW_ARCH_ENABLED
- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _title = nil;
  _detachMessage = nil;
  _withFocusRestore = NO;
  _announced = NO;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RCA11yPaneTitleComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RCA11yPaneTitleProps>();
    _props = defaultProps;
    _announced = NO;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<RCA11yPaneTitleProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<RCA11yPaneTitleProps const>(props);
  [super updateProps:props oldProps:oldProps];

  // NOTE: the merged spec adds `type` (0 activity · 1 pane · 2 announce); on iOS the
  // behavior is uniform (announce title / detach message), so `type` is unused here.

  if ([RCA11yPropsHelper isPropChanged: _title stringValue: newViewProps.title]) {
    [self setTitle: [RCA11yPropsHelper unwrapStringValue: newViewProps.title]];
  }

  if ([RCA11yPropsHelper isPropChanged: _detachMessage stringValue: newViewProps.detachMessage]) {
    [self setDetachMessage: [RCA11yPropsHelper unwrapStringValue: newViewProps.detachMessage]];
  }

  if (_withFocusRestore != newViewProps.withFocusRestore) {
    [self setWithFocusRestore: newViewProps.withFocusRestore];
  }
}

Class<RCTComponentViewProtocol> RCA11yPaneTitleCls(void)
{
  return RCA11yPaneTitleView.class;
}

#endif



- (void)didMoveToWindow {
  [super didMoveToWindow];


  if(self.window && !_announced) {
    _announced = YES;
    [self _announce:_title];
  }
  if(!self.window && _announced && _detachMessage) {
    [self _announce:_detachMessage];
  }

  if (self.window) {
    if(self.withFocusRestore) {
      UIViewController* viewController = self.reactViewController;
      [viewController setRca11yFocusRestore: true];
    }
  }
}

- (void)_announce:(NSString *)message {
  if (@available(iOS 17.0, *)) {
    NSAttributedString *attrStr = [RCA11ySpeechAttributes attributedStringFor:message
                                                                      options:@{ @"priority": @"high", @"queue": @NO }];
    UIAccessibilityPostNotification(UIAccessibilityAnnouncementNotification, attrStr);
  } else {
    [[RCA11yAnnounceService shared] announce:message];
  }
}

@end
