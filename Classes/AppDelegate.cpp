#include "AppDelegate.h"

#include "cocos2d.h"
#include "SimpleAudioEngine.h"
#include "ScriptingCore.h"
#include "generated/jsb_cocos2dx_auto.hpp"
#include "generated/jsb_cocos2dx_extension_auto.hpp"
#include "generated/jsb_cocos2dx_studio_auto.hpp"
#include "jsb_cocos2dx_extension_manual.h"
#include "jsb_cocos2dx_studio_manual.h"
#include "cocos2d_specifics.hpp"
#include "js_bindings_chipmunk_registration.h"
#include "js_bindings_system_registration.h"
#include "js_bindings_ccbreader.h"
#include "jsb_opengl_registration.h"
#include "XMLHTTPRequest.h"
#include "jsb_websocket.h"
#include "jsb_gamecenter_auto.h"




USING_NS_CC;
using namespace CocosDenshion;



typedef struct tagResource
{
    cocos2d::CCSize size;
    char directory[100];
}Resource;

static Resource smallResource  =  { cocos2d::CCSizeMake(480, 320),   "iphone" };
static Resource mediumResource =  { cocos2d::CCSizeMake(1024, 768),  "ipad"   };
static Resource largeResource  =  { cocos2d::CCSizeMake(2048, 1536), "ipadhd" };
static cocos2d::CCSize designResolutionSize = cocos2d::CCSizeMake(480, 320);

AppDelegate::AppDelegate()
{
}

AppDelegate::~AppDelegate()
{
    CCScriptEngineManager::purgeSharedManager();
}

bool AppDelegate::applicationDidFinishLaunching()
{
    // initialize director
    CCDirector *pDirector = CCDirector::sharedDirector();
    pDirector->setOpenGLView(CCEGLView::sharedOpenGLView());
    
    

    CCEGLView::sharedOpenGLView()->setDesignResolutionSize(designResolutionSize.width, designResolutionSize.height, kResolutionNoBorder);
    CCSize frameSize = CCEGLView::sharedOpenGLView()->getFrameSize();
    
    
    // turn on display FPS
    pDirector->setDisplayStats(false);
    
    // set FPS. the default value is 1.0/60 if you don't call this
    pDirector->setAnimationInterval(1.0 / 60);
    
    ScriptingCore* sc = ScriptingCore::getInstance();
    sc->addRegisterCallback(register_all_cocos2dx);
    sc->addRegisterCallback(register_all_cocos2dx_extension);
    sc->addRegisterCallback(register_all_cocos2dx_extension_manual);
    sc->addRegisterCallback(register_cocos2dx_js_extensions);
    sc->addRegisterCallback(register_all_cocos2dx_studio);
    sc->addRegisterCallback(register_all_cocos2dx_studio_manual);
    sc->addRegisterCallback(register_CCBuilderReader);
    sc->addRegisterCallback(jsb_register_chipmunk);
    sc->addRegisterCallback(jsb_register_system);
    sc->addRegisterCallback(JSB_register_opengl);
    sc->addRegisterCallback(MinXmlHttpRequest::_js_register);
    sc->addRegisterCallback(register_jsb_websocket);
    sc->addRegisterCallback(register_all_ls);
    
    //sc->addRegisterCallback(register_all_ls);

    sc->start();
    
    CCScriptEngineProtocol *pEngine = ScriptingCore::getInstance();
    CCScriptEngineManager::sharedManager()->setScriptEngine(pEngine);

    
    ScriptingCore::getInstance()->runScript("cocos2d-jsb.js");
    
    
    CCEGLView *pEGLView = CCEGLView::sharedOpenGLView();
    
    pEGLView->setDesignResolutionSize(320, 480, kResolutionFixedHeight);
    
    /*
    pDirector->setOpenGLView(pEGLView);
    CCSize frame_size = pEGLView->getFrameSize();
    std::vector<std::string> res_dir_orders;
    
    if(1136 == frame_size.height)
    {
        
        res_dir_orders.push_back("res/iphonehd5");
        res_dir_orders.push_back("res/iphonehd");
        res_dir_orders.push_back("res/iphone");
        
    }else if(960 == frame_size.height)
    {
        
        res_dir_orders.push_back("/res/iphonehd");
        res_dir_orders.push_back("/res/iphone");
        
    }else{
        
        res_dir_orders.push_back("res/iphone");
        
    }
    
    CCFileUtils::sharedFileUtils()->setSearchResolutionsOrder(res_dir_orders);
    
    */
    
   
       
    return true;
}

void handle_signal(int signal) {
    static int internal_state = 0;
    ScriptingCore* sc = ScriptingCore::getInstance();
    // should start everything back
    CCDirector* director = CCDirector::sharedDirector();
    if (director->getRunningScene()) {
        director->popToRootScene();
    } else {
        CCPoolManager::sharedPoolManager()->finalize();
        if (internal_state == 0) {
            //sc->dumpRoot(NULL, 0, NULL);
            sc->start();
            internal_state = 1;
        } else {
            sc->runScript("hello.js");
            internal_state = 0;
        }
    }
}

// This function will be called when the app is inactive. When comes a phone call,it's be invoked too
void AppDelegate::applicationDidEnterBackground()
{
    CCDirector::sharedDirector()->stopAnimation();
    SimpleAudioEngine::sharedEngine()->pauseBackgroundMusic();
    SimpleAudioEngine::sharedEngine()->pauseAllEffects();
}

// this function will be called when the app is active again
void AppDelegate::applicationWillEnterForeground()
{
    CCDirector::sharedDirector()->startAnimation();
    SimpleAudioEngine::sharedEngine()->resumeBackgroundMusic();
    SimpleAudioEngine::sharedEngine()->resumeAllEffects();
}
