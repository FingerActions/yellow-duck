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
#endif

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



bool ls::GameCenterBridge::init(){
    bool bRef = false;
    do {
        cocos2d::CCLog("gamecenter init ...");
        bRef = true;
    } while (0);
    return bRef;
}
