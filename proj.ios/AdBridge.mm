//
//  AdBridge.mm
//  flappy
//
//  Created by haotian chang on 27/02/2014.
//
//

#include "AdBridge.h"
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
#include "MyAdManager.h"
#endif

void ls::AdBridge::showAdAtTop(){
    
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    
    cout<<"hehe +++++++++++++++++++++++++"<<endl;
    
    [MyAdManager showAddAtTop];
    
    
#endif
    
}
void ls::AdBridge::showAdAtBottom(){
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    [MyAdManager showAddAtBottom];
#endif
}

bool ls::AdBridge::init(){
    bool bRef = false;
    do {
        cocos2d::CCLog("leafsoar init ...");
        bRef = true;
    } while (0);
    return bRef;
}