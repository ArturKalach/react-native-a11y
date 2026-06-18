//
//  RCA11yGroupIdentifierDelegate.h
//  react-native-a11y
//

#ifndef RCA11yGroupIdentifierDelegate_h
#define RCA11yGroupIdentifierDelegate_h

#import <Foundation/Foundation.h>
#import "RCA11yGroupIdentifierProtocol.h"

@interface RCA11yGroupIdentifierDelegate : NSObject

- (instancetype _Nonnull)initWithView:(UIView<RCA11yGroupIdentifierProtocol> *_Nonnull)view;

@property (nonatomic, readonly, nonnull) NSString *focusGroupIdentifier;

@end

#endif /* RCA11yGroupIdentifierDelegate_h */
