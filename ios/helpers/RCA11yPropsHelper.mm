//
//  RCA11yPropsHelper.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11yPropsHelper.h"
#include <string>

@implementation RCA11yPropsHelper


+ (BOOL)isPropChanged:(NSString *)prop stringValue:(std::string)stringValue {
  NSString *value = stringValue.empty() ? @"" : [NSString stringWithUTF8String:stringValue.c_str()];

  if(prop == nil && value.length == 0) {
    return false;
  }

  return (prop == nil || value.length == 0 || ![prop isEqualToString:value]);
}

+ (BOOL)isPropChanged:(NSNumber *)prop intValue:(int)intValue {
  if (prop == nil && intValue == -1) {
    return NO;
  }

  return (prop == nil || intValue == -1 || prop.intValue != intValue);
}



+ (NSString*)unwrapStringValue:(std::string)stringValue {
  NSString *value = stringValue.empty() ? nil : [NSString stringWithUTF8String:stringValue.c_str()];
  return value.length > 0 ? value : nil;
}

+ (NSNumber*)unwrapIntValue:(int)intValue {
  NSNumber* value = intValue == -1 ? nil : @(intValue);
  return value;
}




@end
