//
//  RCA11ySpeechAttributes.mm
//  react-native-a11y
//

#import "RCA11ySpeechAttributes.h"

@implementation RCA11ySpeechAttributes

+ (NSAttributedString *)attributedStringFor:(NSString *)message
                                    options:(NSDictionary *)options
{
    NSMutableDictionary<NSAttributedStringKey, id> *attrs = [NSMutableDictionary new];

    BOOL shouldQueue = options[@"queue"] ? [options[@"queue"] boolValue] : YES;

    if (@available(iOS 11.0, *)) {
        attrs[UIAccessibilitySpeechAttributeQueueAnnouncement] = @(shouldQueue);
    }

    if (@available(iOS 17.0, *)) {
        NSString *priority = options[@"priority"] ?: @"default";
        UIAccessibilityPriority nativePriority = UIAccessibilityPriorityDefault;
        if ([priority isEqualToString:@"low"])
            nativePriority = UIAccessibilityPriorityLow;
        else if ([priority isEqualToString:@"high"])
            nativePriority = UIAccessibilityPriorityHigh;
        attrs[UIAccessibilitySpeechAttributeAnnouncementPriority] = nativePriority;
    }

    id langVal = options[@"language"];
    if ([langVal isKindOfClass:[NSString class]]) {
        attrs[UIAccessibilitySpeechAttributeLanguage] = langVal;
    }

    // Pitch only written when it deviates from default 1.0.
    id pitchVal = options[@"pitch"];
    if (pitchVal && ![pitchVal isEqual:[NSNull null]]) {
        CGFloat raw = [pitchVal floatValue];
        if (fabs(raw - 1.0f) > 0.001f) {
            attrs[UIAccessibilitySpeechAttributePitch] = @(MAX(0.0f, MIN(2.0f, raw)));
        }
    }

    if (@available(iOS 13.0, *)) {
        if ([options[@"spellOut"] boolValue]) {
            attrs[UIAccessibilitySpeechAttributeSpellOut] = @YES;
        }
    }

    if (@available(iOS 11.0, *)) {
        if ([options[@"punctuation"] boolValue]) {
            attrs[UIAccessibilitySpeechAttributePunctuation] = @YES;
        }
        id ipaVal = options[@"ipaNotation"];
        if ([ipaVal isKindOfClass:[NSString class]]) {
            attrs[UIAccessibilitySpeechAttributeIPANotation] = ipaVal;
        }
    }

    return [[NSAttributedString alloc] initWithString:message attributes:attrs];
}

@end
