//
//  RCA11yOrderSubscriber.h
//  react-native-a11y
//

#ifndef RCA11yOrderSubscriber_h
#define RCA11yOrderSubscriber_h

#import <UIKit/UIKit.h>

typedef void (^LinkUpdatedCallback)(UIView *link);
typedef void (^LinkRemovedCallback)(void);

@interface RCA11yOrderSubscriber : NSObject

@property (nonatomic, weak) NSString* identifier;
@property (nonatomic, strong) LinkUpdatedCallback onLinkUpdated;
@property (nonatomic, strong) LinkRemovedCallback onLinkRemoved;

- (instancetype)initWithId:(NSString*)identifier updatedCallback:(LinkUpdatedCallback)onLinkUpdated
                        removedCallback:(LinkRemovedCallback)onLinkRemoved;

@end

#endif /* RCA11yOrderSubscriber_h */
