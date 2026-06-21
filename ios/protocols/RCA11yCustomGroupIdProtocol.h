//
//  RCA11yCustomGroupIdProtocol.h
//  react-native-a11y
//
//  (Fixes the upstream "Groud" typo in RNCEKVCustomGroudIdProtocol.)
//

#ifndef RCA11yCustomGroupIdProtocol_h
#define RCA11yCustomGroupIdProtocol_h

#import <Foundation/Foundation.h>

@protocol RCA11yCustomGroupIdProtocol <NSObject>
- (NSString*)customGroupIdentifier;
@end

#endif /* RCA11yCustomGroupIdProtocol_h */
