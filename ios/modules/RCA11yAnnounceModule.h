//
//  RCA11yAnnounceModule.h
//  react-native-a11y
//

#ifndef RCA11yAnnounceModule_h
#define RCA11yAnnounceModule_h

#import <Foundation/Foundation.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNA11ySpec/RNA11ySpec.h>

@interface RCA11yAnnounceModule : NSObject <NativeRCA11yAnnounceModuleSpec>

#else

#import <React/RCTBridgeModule.h>

@interface RCA11yAnnounceModule : NSObject <RCTBridgeModule>

- (void)announce:(NSString *)message
         options:(NSDictionary *)options
         resolve:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject;

- (void)cancel:(NSString *)announcementId
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject;

- (void)cancelAll:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject;

#endif

@end

#endif /* RCA11yAnnounceModule_h */
