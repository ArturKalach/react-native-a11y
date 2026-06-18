//
//  RCA11yKeyboardKeyPressHandler.h
//  react-native-a11y
//

#ifndef RCA11yKeyboardKeyPressHandler_h
#define RCA11yKeyboardKeyPressHandler_h

@interface RCA11yKeyboardKeyPressHandler:NSObject {
    NSMutableDictionary* _keyPressedTimestamps;
}

-(NSDictionary*) getKeyPressEventInfo:(NSSet<UIPress *> *)presses
                            withEvent:(UIPressesEvent *)event;

-(NSDictionary*) actionDownHandler:(NSSet<UIPress *> *)presses
                         withEvent:(UIPressesEvent *)event;

-(NSDictionary*) actionUpHandler:(NSSet<UIPress *> *)presses
                       withEvent:(UIPressesEvent *)event;

@end

#endif /* RCA11yKeyboardKeyPressHandler_h */
