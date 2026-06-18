//
//  RCA11yFocusChangeListener.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>

#import "RCA11yFocusChangeListener.h"
#import <UIKit/UIKit.h>

@interface RCA11yFocusChangeListener ()
@property (nonatomic, weak) id<RCA11yFocusChangeListenerDelegate> delegate;
@end

@implementation RCA11yFocusChangeListener

- (instancetype)initWithDelegate:(id<RCA11yFocusChangeListenerDelegate>)delegate {
    self = [super init];
    if (self) {
        _delegate = delegate;
    }
    return self;
}

- (void)startListening {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onFocusChangeHandler:)
                                                 name:UIAccessibilityElementFocusedNotification
                                               object:nil];
}

- (void)stopListening {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)onFocusChangeHandler:(NSNotification *)notification {
    id focusedElement = notification.userInfo[UIAccessibilityFocusedElementKey];
    [self.delegate voiceOverFocusChanged:focusedElement];
}

- (void)dealloc {
    [self stopListening];
}

@end
