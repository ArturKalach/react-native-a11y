//
//  RCA11yFocusLinkObserver.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11yFocusLinkObserver.h"
#import "RCA11yOrderSubscriber.h"

@implementation RCA11yFocusLinkObserver {
  NSMutableDictionary<NSString *, UIView *> *_links;
  NSMutableDictionary<NSString *, NSMutableArray<RCA11yOrderSubscriber *> *> *_subscribers;
}

+ (instancetype)sharedManager {
  static RCA11yFocusLinkObserver *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[self alloc] init];
  });
  return sharedInstance;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    _links = [NSMutableDictionary dictionary];
    _subscribers = [NSMutableDictionary dictionary];
  }
  return self;
}

- (void)emitWithId:(NSString *)identifier link:(UIView *)link {
  if (!identifier || !link) {
    return;
  }
  _links[identifier] = link;
  [self emitLinkUpdatedForId:identifier link:link];
}

- (void)emitRemoveWithId:(NSString *)identifier {
  if (_links[identifier]) {
    [_links removeObjectForKey:identifier];
    [self emitLinkRemovedForId:identifier];
  }
}

- (RCA11yOrderSubscriber* )subscribe:(NSString *)identifier
          onLinkUpdated:(LinkUpdatedCallback)onLinkUpdated
          onLinkRemoved:(LinkRemovedCallback)onLinkRemoved {
  if (!identifier || (!onLinkUpdated && !onLinkRemoved)) {
    return nil;
  }

  if (!_subscribers[identifier]) {
    _subscribers[identifier] = [NSMutableArray array];
  }

  RCA11yOrderSubscriber *subscriber = [[RCA11yOrderSubscriber alloc] initWithId: identifier updatedCallback:onLinkUpdated
                                                                removedCallback:onLinkRemoved];
  [_subscribers[identifier] addObject:subscriber];

  if (onLinkUpdated && _links[identifier]) {
    onLinkUpdated(_links[identifier]);
  }

  return subscriber;
}

- (void)unsubscribeWithId:(NSString *)identifier
            onLinkUpdated:(LinkUpdatedCallback)onLinkUpdated
            onLinkRemoved:(LinkRemovedCallback)onLinkRemoved {
  if (!identifier || (!onLinkUpdated && !onLinkRemoved)) {
    return;
  }

  NSMutableArray<RCA11yOrderSubscriber *> *subscriberList = _subscribers[identifier];
  if (subscriberList) {
    [subscriberList filterUsingPredicate:[NSPredicate predicateWithBlock:^BOOL(RCA11yOrderSubscriber *subscriber, NSDictionary *bindings) {
      return !(subscriber.onLinkUpdated == onLinkUpdated && subscriber.onLinkRemoved == onLinkRemoved);
    }]];

    if (subscriberList.count == 0) {
      [_subscribers removeObjectForKey:identifier];
    }
  }
}

- (void)unsubscribe:(RCA11yOrderSubscriber *)subscriber {
  if (!subscriber || !subscriber.identifier) {
    return;
  }

  NSMutableArray<RCA11yOrderSubscriber *> *subscriberList = _subscribers[subscriber.identifier];
  if (subscriberList) {
    [subscriberList removeObject: subscriber];
    if (subscriberList.count == 0) {
      [_subscribers removeObjectForKey: subscriber.identifier];
    }
  }
}

#pragma mark - Private

- (void)emitLinkUpdatedForId:(NSString *)identifier link:(UIView *)link {
  NSArray<RCA11yOrderSubscriber *> *subscriberList = [_subscribers[identifier] copy];
  for (RCA11yOrderSubscriber *subscriber in subscriberList) {
    if (subscriber.onLinkUpdated) {
      subscriber.onLinkUpdated(link);
    }
  }
}

- (void)emitLinkRemovedForId:(NSString *)identifier {
  NSArray<RCA11yOrderSubscriber *> *subscriberList = [_subscribers[identifier] copy];
  for (RCA11yOrderSubscriber *subscriber in subscriberList) {
    if (subscriber.onLinkRemoved) {
      subscriber.onLinkRemoved();
    }
  }
}

@end
