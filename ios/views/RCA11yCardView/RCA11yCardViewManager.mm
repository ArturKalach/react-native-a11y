//
//  RCA11yCardViewManager.mm
//  react-native-a11y
//

#import "RCA11yCardView.h"
#import "RCA11yCardViewManager.h"

@implementation RCA11yCardViewManager

RCT_EXPORT_MODULE(RCA11yCard)

- (UIView *)view {
  return [[RCA11yCardView alloc] init];
}

@end
