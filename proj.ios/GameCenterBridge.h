//
//  GameCenterBridage.h
//  flappy
//
//  Created by haotian chang on 1/03/2014.
//
//

#ifndef __flappy__GameCenterBridge__
#define __flappy__GameCenterBridge__

#include "cocos2d.h"
#include "ScriptingCore.h"



namespace ls{
    
    
    class GameCenterBridge: public cocos2d::CCObject{
        
    public:
        
        static cocos2d::CCScene* scene();
        virtual bool init();
        
        CREATE_FUNC(GameCenterBridge);
        
        void pushscore(string score, string category);
        
    };

}
#endif /* defined(__flappy__GameCenterBridage__) */
