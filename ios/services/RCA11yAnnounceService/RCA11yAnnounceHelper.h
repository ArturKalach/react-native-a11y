//
//  RCA11yAnnounceHelper.h
//  react-native-a11y
//

#ifndef RCA11yAnnounceHelper_h
#define RCA11yAnnounceHelper_h

@interface RCA11yAnnounceHelper: NSObject

+ (void)announce: (NSString *)announcement;
+ (void)announceWithList: (NSArray<NSString *> *)list;

@end


#endif /* RCA11yAnnounceHelper_h */
