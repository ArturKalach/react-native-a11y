//
//  RCA11ySRGroupChildrenView.mm
//  react-native-a11y
//

#import "RCA11ySRGroupChildrenView.h"

@implementation RCA11ySRGroupChildrenView

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _groupChildrenMode = -1;
  }
  return self;
}

- (BOOL)shouldGroupAccessibilityChildren {
  if (_groupChildrenMode == -1) {
    return [super shouldGroupAccessibilityChildren];
  }
  return (BOOL)_groupChildrenMode;
}

@end
