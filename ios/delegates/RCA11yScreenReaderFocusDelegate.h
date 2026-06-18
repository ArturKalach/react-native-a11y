//
//  RCA11yScreenReaderFocusDelegate.h
//  react-native-a11y
//

#ifndef RCA11yScreenReaderFocusDelegate_h
#define RCA11yScreenReaderFocusDelegate_h

#import <Foundation/Foundation.h>

@protocol RCA11yScreenReaderFocusDelegate <NSObject>

- (void)onScreenReaderFocusChanged:(BOOL)focused;

@end

#endif /* RCA11yScreenReaderFocusDelegate_h */
