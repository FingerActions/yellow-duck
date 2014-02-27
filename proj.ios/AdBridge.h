//
//  AdBridge.h
//  flappy
//
//  Created by haotian chang on 27/02/2014.
//
//

#ifndef __flappy__AdBridge__
#define __flappy__AdBridge__

#include "cocos2d.h"
#include "ScriptingCore.h"



namespace ls{
    
    

class AdBridge: public cocos2d::CCObject{
    
public:
    static cocos2d::CCScene* scene();
    virtual bool init();
    CREATE_FUNC(AdBridge);
    
    void showAdAtTop();
    void showAdAtBottom();
};
    
    
}
#endif /* defined(__flappy__AdBridge__) */
