//
//  RCA11yPropsHelper.h
//  react-native-a11y
//

#ifndef RCA11yPropsHelper_h
#define RCA11yPropsHelper_h

#import <Foundation/Foundation.h>
#include <string>

@interface RCA11yPropsHelper : NSObject

+ (BOOL)isPropChanged:(NSString *)prop stringValue:(std::string)stringValue;
+ (BOOL)isPropChanged:(NSNumber *)prop intValue:(int)intValue;
+ (NSString*)unwrapStringValue:(std::string)stringValue;
+ (NSNumber*)unwrapIntValue:(int)intValue;

@end


#endif /* RCA11yPropsHelper_h */
