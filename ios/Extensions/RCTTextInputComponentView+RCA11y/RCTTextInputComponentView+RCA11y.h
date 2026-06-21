//
//  RCTTextInputComponentView+RCA11y.h
//  react-native-a11y
//

#ifndef RCTTextInputComponentView_RCA11y_h
#define RCTTextInputComponentView_RCA11y_h
#import <React/RCTBackedTextInputViewProtocol.h>
#import <React/RCTTextInputComponentView.h>

@interface RCTTextInputComponentView (RCA11y)

@property (nonatomic, readonly) UIView* rca11yBackedTextInputView;

@end

#endif /* RCTTextInputComponentView_RCA11y_h */
