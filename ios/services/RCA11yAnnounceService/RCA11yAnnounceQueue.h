//
//  RCA11yAnnounceQueue.h
//  react-native-a11y
//

#ifndef RCA11yAnnounceQueue_h
#define RCA11yAnnounceQueue_h

#import <Foundation/Foundation.h>

@interface RCA11yAnnounceQueue: NSObject

@property (nonatomic, assign, readonly) BOOL isEmpty;
@property (nonatomic, strong, readonly) NSArray<NSString *> *list;

- (void)add:(NSString *)message;
- (void)clear;

@end


#endif /* RCA11yAnnounceQueue_h */
