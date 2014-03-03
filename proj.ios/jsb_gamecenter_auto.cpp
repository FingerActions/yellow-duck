//
//  jsb_gamecenter_auto.cpp
//  flappy
//
//  Created by haotian chang on 1/03/2014.
//
//

#include "jsb_gamecenter_auto.h"
#include "cocos2d.h"
#include "GameCenterBridge.h"
#include "cocos2d_specifics.hpp"

JSClass  *jsb_LsLeafsoar_class;
JSObject *jsb_LsLeafsoar_prototype;

JSBool js_ls_GameCenterBridge_pushscore(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSBool ok = JS_TRUE;
    jsval *argv = JS_ARGV(cx, vp);
    
	JSObject *obj = NULL;
    ls::GameCenterBridge* cobj = NULL;
	obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	cobj = (ls::GameCenterBridge *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
    if (argc == 2) {

        std::string score;
        std::string category;
        
        jsval_to_std_string(cx, argv[1], &category);
        jsval_to_std_string(cx, argv[0], &score);
        
        cobj->pushscore(score,category);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
        return ok;
    }
    
    JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_ls_GameCenterBridge_showleaderboard(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSBool ok = JS_TRUE;
    
	JSObject *obj = NULL;
    ls::GameCenterBridge* cobj = NULL;
	obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	cobj = (ls::GameCenterBridge *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
    if (argc == 0) {
    
        cobj->showleaderboard();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
        return ok;
    }
    
    JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}


//binding pushscenename of google analytics

JSBool js_ls_GameCenterBridge_pushscenename(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSBool ok = JS_TRUE;
    jsval *argv = JS_ARGV(cx, vp);
    
	JSObject *obj = NULL;
    ls::GameCenterBridge* cobj = NULL;
	obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	cobj = (ls::GameCenterBridge *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
    if (argc == 1) {
        
        std::string _scenename;
    
        jsval_to_std_string(cx, argv[0], &_scenename);
        cobj->pushscenename(_scenename);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
        return ok;
    }
    
    JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

//binding pusheventname of google analytics

JSBool js_ls_GameCenterBridge_pusheventname(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSBool ok = JS_TRUE;
    jsval *argv = JS_ARGV(cx, vp);
    
	JSObject *obj = NULL;
    ls::GameCenterBridge* cobj = NULL;
	obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	cobj = (ls::GameCenterBridge *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
    if (argc == 3) {
        //string eventcategory,string eventname,string eventlabel)
        std::string eventcategory;
        std::string eventname;
        std::string eventlabel;
        
        
        jsval_to_std_string(cx, argv[0], &eventcategory);
        jsval_to_std_string(cx, argv[1], &eventname);
        jsval_to_std_string(cx, argv[2], &eventlabel);
        
        cobj->pusheventname(eventcategory,eventname,eventlabel);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
        return ok;
    }
    
    JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

//show admob on top of the screen

JSBool js_ls_GameCenterBridge_showAddAtTop(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSBool ok = JS_TRUE;
    
	JSObject *obj = NULL;
    ls::GameCenterBridge* cobj = NULL;
	obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	cobj = (ls::GameCenterBridge *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
    if (argc == 0) {
        
        cobj->showAddAtTop();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
        return ok;
    }
    
    JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}


//show admob on bottom of the screen

JSBool js_ls_GameCenterBridge_showAddAtBottom(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSBool ok = JS_TRUE;
    
	JSObject *obj = NULL;
    ls::GameCenterBridge* cobj = NULL;
	obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	cobj = (ls::GameCenterBridge *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
    if (argc == 0) {
        
        cobj->showAddAtBottom();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
        return ok;
    }
    
    JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_ls_GameCenterBridge_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    cocos2d::CCLog("js ls lsleafsoar constructor ..");
	if (argc == 0) {
        
        ls::GameCenterBridge* cobj = new ls::GameCenterBridge();
        cocos2d::CCObject* _ccobj = dynamic_cast<cocos2d::CCObject*>(cobj);
        if (_ccobj){
            _ccobj->autorelease();
        }
        TypeTest<ls::GameCenterBridge> t;
        js_type_class_t *typeClass;
        uint32_t typeId = t.s_id();
		HASH_FIND_INT(_js_global_type_ht, &typeId, typeClass);
		assert(typeClass);
		JSObject *obj = JS_NewObject(cx, typeClass->jsclass, typeClass->proto, typeClass->parentProto);
		JS_SET_RVAL(cx, vp, OBJECT_TO_JSVAL(obj));
		// link the native object with the javascript object
		js_proxy_t* p = jsb_new_proxy(cobj, obj);
		JS_AddNamedObjectRoot(cx, &p->obj, "ls::GameCenterBridge");
        
		return JS_TRUE;
	}
    
	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}

JSBool js_ls_GameCenterBridge_create(JSContext *cx, uint32_t argc, jsval *vp)
{
    cocos2d::CCLog("js ls lsleafsoar create ..");
	if (argc == 0) {
        ls::GameCenterBridge* ret = ls::GameCenterBridge::create();
		jsval jsret;
		do {
            if (ret) {
                js_proxy_t *proxy = js_get_or_create_proxy<ls::GameCenterBridge>(cx, ret);
                jsret = OBJECT_TO_JSVAL(proxy->obj);
            } else {
                jsret = JSVAL_NULL;
            }
        } while (0);
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}


void js_ls_GameCenterBridge_finalize(JSFreeOp *fop, JSObject *obj) {
    //    CCLOGINFO("jsbindings: finalizing JS object %p (LsLeafsoar)", obj);
}

void js_register_ls_GameCenterBridge(JSContext *cx, JSObject *global) {
	jsb_LsLeafsoar_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_LsLeafsoar_class->name = "GameCenterBridge";
	jsb_LsLeafsoar_class->addProperty = JS_PropertyStub;
	jsb_LsLeafsoar_class->delProperty = JS_PropertyStub;
	jsb_LsLeafsoar_class->getProperty = JS_PropertyStub;
	jsb_LsLeafsoar_class->setProperty = JS_StrictPropertyStub;
	jsb_LsLeafsoar_class->enumerate = JS_EnumerateStub;
	jsb_LsLeafsoar_class->resolve = JS_ResolveStub;
	jsb_LsLeafsoar_class->convert = JS_ConvertStub;
	jsb_LsLeafsoar_class->finalize = js_ls_GameCenterBridge_finalize;
	jsb_LsLeafsoar_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);
    
	static JSPropertySpec properties[] = {
		{0, 0, 0, JSOP_NULLWRAPPER, JSOP_NULLWRAPPER}
	};
    
	static JSFunctionSpec funcs[] = {
		JS_FN("pushscore", js_ls_GameCenterBridge_pushscore, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("showleaderboard", js_ls_GameCenterBridge_showleaderboard, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("pushscenename", js_ls_GameCenterBridge_pushscenename, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("pusheventname", js_ls_GameCenterBridge_pusheventname, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("showAddAtTop", js_ls_GameCenterBridge_showAddAtTop, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("showAddAtBottom", js_ls_GameCenterBridge_showAddAtBottom, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
	};
    
	static JSFunctionSpec st_funcs[] = {
		JS_FN("create", js_ls_GameCenterBridge_create, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FS_END
	};
    
	jsb_LsLeafsoar_prototype = JS_InitClass(
                                            cx, global,
                                            NULL, // parent proto
                                            jsb_LsLeafsoar_class,
                                            js_ls_GameCenterBridge_constructor, 0, // constructor
                                            properties,
                                            funcs,
                                            NULL, // no static properties
                                            st_funcs);
	// make the class enumerable in the registered namespace
	JSBool found;
	JS_SetPropertyAttributes(cx, global, "ls", JSPROP_ENUMERATE | JSPROP_READONLY, &found);
    
	// add the proto and JSClass to the type->js info hash table
	TypeTest<ls::GameCenterBridge> t;
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	if (!p) {
		p = (js_type_class_t *)malloc(sizeof(js_type_class_t));
		p->type = typeId;
		p->jsclass = jsb_LsLeafsoar_class;
		p->proto = jsb_LsLeafsoar_prototype;
		p->parentProto = NULL;
		HASH_ADD_INT(_js_global_type_ht, type, p);
	}
}

JSBool ls_cocos2dx_retain(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *thisObj = JS_THIS_OBJECT(cx, vp);
	if (thisObj) {
		js_proxy_t *proxy = jsb_get_js_proxy(thisObj);
		if (proxy) {
			((CCObject *)proxy->ptr)->retain();
			return JS_TRUE;
		}
	}
    JS_ReportError(cx, "Invalid Native Object.");
	return JS_FALSE;
}

JSBool ls_cocos2dx_release(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *thisObj = JS_THIS_OBJECT(cx, vp);
	if (thisObj) {
		js_proxy_t *proxy = jsb_get_js_proxy(thisObj);
		if (proxy) {
			((CCObject *)proxy->ptr)->release();
			return JS_TRUE;
		}
	}
    JS_ReportError(cx, "Invalid Native Object.");
	return JS_FALSE;
}


void register_all_ls(JSContext* cx, JSObject* obj) {
	// first, try to get the ns
	jsval nsval;
	JSObject *ns;
	JS_GetProperty(cx, obj, "ls", &nsval);
	if (nsval == JSVAL_VOID) {
		ns = JS_NewObject(cx, NULL, NULL, NULL);
		nsval = OBJECT_TO_JSVAL(ns);
		JS_SetProperty(cx, obj, "ls", &nsval);
	} else {
		JS_ValueToObject(cx, nsval, &ns);
	}
	obj = ns;
	js_register_ls_GameCenterBridge(cx, obj);
    
    JS_DefineFunction(cx, jsb_LsLeafsoar_prototype, "retain", ls_cocos2dx_retain, 0, JSPROP_READONLY | JSPROP_PERMANENT);
	JS_DefineFunction(cx, jsb_LsLeafsoar_prototype, "release", ls_cocos2dx_release, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    
}