//
//  RCA11yAnnounceHelper.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RCA11yAnnounceHelper.h"

@implementation RCA11yAnnounceHelper

+ (void)announce:(NSString *)announcement {
  NSDictionary *attributes = @{ UIAccessibilitySpeechAttributeQueueAnnouncement : @YES };

  NSAttributedString *attributedAnnouncement = [[NSAttributedString alloc] initWithString:announcement attributes:attributes];

  UIAccessibilityPostNotification(UIAccessibilityAnnouncementNotification, attributedAnnouncement);
}

+ (void)announceWithList: (NSArray<NSString *> *)list {
  for (NSString *announcement in list) {
    [self announce: announcement];
  }
}


@end
