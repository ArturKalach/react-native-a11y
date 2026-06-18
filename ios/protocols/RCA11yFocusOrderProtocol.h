//
//  RCA11yFocusOrderProtocol.h
//  react-native-a11y
//

#ifndef RCA11yFocusOrderProtocol_h
#define RCA11yFocusOrderProtocol_h

#import <UIKit/UIKit.h>

@protocol RCA11yFocusOrderProtocol <NSObject>

@property (nonatomic, strong) NSString* orderGroup;
@property (nonatomic, strong) NSNumber* lockFocus;
@property (nonatomic, strong) NSNumber* orderPosition;
@property (nonatomic, strong) NSString* orderLeft;
@property (nonatomic, strong) NSString* orderRight;
@property (nonatomic, strong) NSString* orderUp;
@property (nonatomic, strong) NSString* orderDown;
@property (nonatomic, strong) NSString* orderForward;
@property (nonatomic, strong) NSString* orderBackward;
@property (nonatomic, strong) NSString* orderLast;
@property (nonatomic, strong) NSString* orderFirst;
@property (nonatomic, strong) NSString* orderId;

- (UIView *)getFocusTargetView;

@end

#endif /* RCA11yFocusOrderProtocol_h */
