//
//  RCA11yFocusChangeListener.h
//  react-native-a11y
//

#ifndef RCA11yFocusChangeListener_h
#define RCA11yFocusChangeListener_h

#import <Foundation/Foundation.h>

@protocol RCA11yFocusChangeListenerDelegate <NSObject>
- (void)voiceOverFocusChanged:(id)focusedElement;
@end

@interface RCA11yFocusChangeListener : NSObject

- (instancetype)initWithDelegate:(id<RCA11yFocusChangeListenerDelegate>)delegate;
- (void)startListening;
- (void)stopListening;

@end

#endif /* RCA11yFocusChangeListener_h */
