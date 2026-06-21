//
//  RCA11yViewManager.h
//  react-native-a11y
//
//  Old-architecture view manager for the merged A11yView (registered as "RCA11yView").
//  On the New Architecture the Fabric component is registered via RCA11yViewCls();
//  this manager provides the legacy view config + command path.
//

#ifndef RCA11yViewManager_h
#define RCA11yViewManager_h

#import <React/RCTViewManager.h>

#define RCA11yK_SIMPLE_PROP(propName, propType, viewClass) \
RCT_CUSTOM_VIEW_PROPERTY(propName, propType, viewClass) \
{ \
    propType *value = json ? [RCTConvert propType:json] : nil; \
    view.propName = value; \
}

@interface RCA11yViewManager : RCTViewManager
@end

#endif /* RCA11yViewManager_h */
