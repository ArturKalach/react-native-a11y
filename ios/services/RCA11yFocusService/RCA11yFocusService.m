//
//  RCA11yFocusService.m
//  react-native-a11y
//

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import "RCA11yFocusService.h"

@interface RCA11yFocusService ()
@property (nonatomic, weak) UIView *lastFocusedView;
@property (nonatomic, strong) NSHashTable<UIView<RCA11yFocusServiceSubscriber> *> *subscribers;
@end

@implementation RCA11yFocusService

+ (instancetype)sharedService {
  static RCA11yFocusService *service = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    service = [[RCA11yFocusService alloc] init];
  });
  return service;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    _subscribers = [NSHashTable weakObjectsHashTable];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(accessibilityElementFocused:)
                                                 name:UIAccessibilityElementFocusedNotification
                                               object:nil];
  }
  return self;
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)subscribe:(UIView<RCA11yFocusServiceSubscriber> *)subscriber {
  @synchronized (self) {
    [self.subscribers addObject:subscriber];
  }
}

- (void)unsubscribe:(UIView<RCA11yFocusServiceSubscriber> *)subscriber {
  @synchronized (self) {
    [self.subscribers removeObject:subscriber];
  }
}

- (void)accessibilityElementFocused:(NSNotification *)notification {
  @try {
    id focusedElement = notification.userInfo[UIAccessibilityFocusedElementKey];
    if ([focusedElement isKindOfClass:[UIAccessibilityElement class]]) {
      focusedElement = ((UIAccessibilityElement *)focusedElement).accessibilityContainer;
    }
    if (![focusedElement isKindOfClass:[UIView class]]) {
      return;
    }
    if (self.lastFocusedView && self.lastFocusedView != focusedElement) {
      for (UIView<RCA11yFocusServiceSubscriber> *subscriber in self.subscribers) {
        if ([self.lastFocusedView isDescendantOfView:subscriber]) {
          [subscriber accessibilityElementDidUnfocused:self.lastFocusedView];
        }
      }
    }
    self.lastFocusedView = focusedElement;
    for (UIView<RCA11yFocusServiceSubscriber> *subscriber in self.subscribers) {
      if ([focusedElement isDescendantOfView:subscriber]) {
        [subscriber accessibilityElementDidBecomeFocused:focusedElement];
      }
    }
  }
  @catch (NSException *exception) {
    self.lastFocusedView = nil;
  }
}


@end
