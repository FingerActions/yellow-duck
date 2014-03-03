//
//  GameCenterBridage.mm
//  flappy
//
//  Created by haotian chang on 1/03/2014.
//
//

#include "GameCenterBridge.h"
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
#include "MyGameCenterManager.h"

#import "GADBannerView.h"
#import "RootViewController.h"

#import "GAI.h"
#import "GAIDictionaryBuilder.h"
#import "GAIFields.h"


#endif

static id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:@"UA-48535423-1"];


void ls::GameCenterBridge::pushscore(string score,string cat){
    
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    
    cout<<"hehe +++++++++++++++++++++++++"<<endl;
    
    NSString* result = [NSString stringWithUTF8String:cat.c_str() ];
    
    NSString* s = [NSString stringWithUTF8String:score.c_str() ];
    
    int64_t i = [s longLongValue];
    
    [MyGameCenterManager reportScore:(i) forCategory:(NSString *) result];
    
    
#endif
    
}



void ls::GameCenterBridge::showleaderboard(){
    
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    
    
    [MyGameCenterManager showLeaderboard];
    
    
#endif
    
}


void ls::GameCenterBridge::pushscenename(string scene){
    
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    
    // Initialize tracker.
    // id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:@"UA-48535423-1"];
    
    
    NSString* nameofscene = [NSString stringWithUTF8String:scene.c_str() ];
    
    NSDictionary *params = [NSDictionary dictionaryWithObjectsAndKeys:
                            @"appview", kGAIHitType, nameofscene, kGAIScreenName, nil];
    [tracker send:params];
    
    
#endif
    
}

void ls::GameCenterBridge::pusheventname(string eventcategory,string eventname,string eventlabel){
    
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    
    // Initialize tracker.
    // id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:@"UA-48535423-1"];
    
    
    NSString* _eventlabel = [NSString stringWithUTF8String:eventlabel.c_str() ];
    NSString* _eventname = [NSString stringWithUTF8String:eventname.c_str() ];
    NSString* _eventcategory = [NSString stringWithUTF8String:eventcategory.c_str() ];
    
    NSLog(@"I am sending");
    NSLog(_eventcategory,_eventname,_eventlabel);
    
    [tracker send:[[GAIDictionaryBuilder createEventWithCategory:_eventcategory     // Event category (required)
                                                          action:_eventname  // Event action (required)
                                                           label:_eventlabel         // Event label
                                                           value:nil] build]];    // Event value
  
    
#endif
    
}


void ls::GameCenterBridge::showAddAtTop(){
    
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    
    
    [MyGameCenterManager showAddAtTop];
    
    
#endif
    
}

void ls::GameCenterBridge::showAddAtBottom(){
    
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    
    
    [MyGameCenterManager showAddAtBottom];
    
    
#endif
    
}

bool ls::GameCenterBridge::init(){
    bool bRef = false;
    do {
        cocos2d::CCLog("gamecenter init ...");
        bRef = true;
    } while (0);
    return bRef;
}
