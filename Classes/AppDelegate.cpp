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

// custom js binding
#include "jsb_fingerActions_auto.h"




USING_NS_CC;
using namespace CocosDenshion;


// multi screen
typedef struct tagResource
{
    cocos2d::CCSize size;
    char directory[100];
}Resource;

static Resource smallResource  =  { cocos2d::CCSizeMake(320, 480),   "iphone" };
static Resource mediumResource =  { cocos2d::CCSizeMake(768, 1024),  "ipad"   };
static Resource largeResource  =  { cocos2d::CCSizeMake(1536, 2048), "ipadhd" };
static cocos2d::CCSize designResolutionSize = cocos2d::CCSizeMake(320, 480);

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
    
    
// multi screen
    CCEGLView::sharedOpenGLView()->setDesignResolutionSize(designResolutionSize.width, designResolutionSize.height, kResolutionNoBorder);
    
  
    
    CCSize frameSize = CCEGLView::sharedOpenGLView()->getFrameSize();
    
    // turn off display FPS
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
    
    //fingerActions js binding
    sc->addRegisterCallback(register_all_fingerActions);
    

    sc->start();
    
    CCScriptEngineProtocol *pEngine = ScriptingCore::getInstance();
    CCScriptEngineManager::sharedManager()->setScriptEngine(pEngine);

    
    ScriptingCore::getInstance()->runScript("cocos2d-jsb.js");
    
    
    CCEGLView *pEGLView = CCEGLView::sharedOpenGLView();
    
    pDirector->setOpenGLView(pEGLView);
    CCSize frame_size = pEGLView->getFrameSize();
    std::vector<std::string> res_dir_orders;
    
    
    if(2048 == frame_size.height){
        CCLog("heheheheheheheheheheheh1");
        res_dir_orders.push_back("ipadhd");
        res_dir_orders.push_back("ipad");
        res_dir_orders.push_back("iphonehd5");
        res_dir_orders.push_back("iphonehd");
        res_dir_orders.push_back("iphone");
        
    }
    
    else if(1024 == frame_size.height)
    {
        CCLog("heheheheheheheheheheheh2");
        res_dir_orders.push_back("ipad");
        res_dir_orders.push_back("iphonehd5");
        res_dir_orders.push_back("iphonehd");
        res_dir_orders.push_back("iphone");
        
    }
    else if(1136 == frame_size.height)
    {
        CCLog("heheheheheheheheheheheh3");
        res_dir_orders.push_back("iphonehd5");
        res_dir_orders.push_back("iphonehd");
        res_dir_orders.push_back("iphone");
    }
    
    else if(960 == frame_size.height)
    {
        CCLog("heheheheheheheheheheheh4");
        res_dir_orders.push_back("iphonehd");
        res_dir_orders.push_back("iphone");
        
    }else{
        CCLog("heheheheheheheheheheheh5");
        res_dir_orders.push_back("iphone");
        
    }
    
    CCFileUtils::sharedFileUtils()->setSearchResolutionsOrder(res_dir_orders);
    
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
