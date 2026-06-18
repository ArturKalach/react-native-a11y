//
//  RCA11yViewGroupIdentifierBase.h
//  react-native-a11y
//
//  Keyboard focus-group identifier (ported from EK RNCEKVViewGroupIdentifierBase).
//

#ifndef RCA11yViewGroupIdentifierBase_h
#define RCA11yViewGroupIdentifierBase_h

#import "RCA11yKeyboardHaloBase.h"
#import "RCA11yGroupIdentifierProtocol.h"
#import "RCA11yCustomGroupIdProtocol.h"

@interface RCA11yViewGroupIdentifierBase : RCA11yKeyboardHaloBase<RCA11yGroupIdentifierProtocol, RCA11yCustomGroupIdProtocol>

@property (nonatomic, strong, nullable) NSString *customGroupId;

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateGroupIdentifierProps:(const RCA11y::GroupIdentifierProps &)oldProps
                     newProps:(const RCA11y::GroupIdentifierProps &)newProps;
#endif

@end


#endif /* RCA11yViewGroupIdentifierBase_h */
