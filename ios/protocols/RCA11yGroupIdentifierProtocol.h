//
//  RCA11yGroupIdentifierProtocol.h
//  react-native-a11y
//

#ifndef RCA11yGroupIdentifierProtocol_h
#define RCA11yGroupIdentifierProtocol_h

#import <UIKit/UIKit.h>

@protocol RCA11yGroupIdentifierProtocol <NSObject>
- (NSString*) customGroupId;
- (UIView*) getFocusTargetView;
@end

#endif /* RCA11yGroupIdentifierProtocol_h */
