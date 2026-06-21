//
//  RCA11yCustomFocusEffectProtocol.h
//  react-native-a11y
//

#ifndef RCA11yCustomFocusEffectProtocol_h
#define RCA11yCustomFocusEffectProtocol_h

#import <UIKit/UIKit.h>

@protocol RCA11yCustomFocusEffectProtocol <NSObject>
- (UIFocusEffect*)customFocusEffect API_AVAILABLE(ios(15.0));
@end

#endif /* RCA11yCustomFocusEffectProtocol_h */
