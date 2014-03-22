/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package com.fingeractions.yellowduck;

import org.cocos2dx.lib.Cocos2dxActivity;
import com.fingeractions.libFingerActions.FingerActions;
import com.google.example.games.basegameutils.GameHelper;
import com.google.example.games.basegameutils.GameHelper.GameHelperListener;

import android.content.Intent;
import android.os.Bundle;

public class YellowDuck extends Cocos2dxActivity{
	
//	protected void onCreate(Bundle savedInstanceState){
//		super.onCreate(savedInstanceState);
//		
//		FingerActions.initLibrary(this);
//		FingerActions.addAdMob("portrait");
//	}
	
	GameHelper mHelper;

	@Override
	public void onCreate(Bundle savedInstanceState) {
	    // create game helper with all APIs (Games, Plus, AppState):
	    mHelper = new GameHelper(this, GameHelper.CLIENT_ALL);

	    super.onCreate(savedInstanceState);
		
		FingerActions.initLibrary(this);
		FingerActions.addAdMob("portrait");

	    GameHelperListener listener = new GameHelper.GameHelperListener() {
	        @Override
	        public void onSignInSucceeded() {
	            // handle sign-in succeess
	        }
	        @Override
	        public void onSignInFailed() {
	            // handle sign-in failure (e.g. show Sign In button)
	        }

	    };
	    mHelper.setup(listener);
	}
	
	@Override
	protected void onStart() {
	    super.onStart();
	    mHelper.onStart(this);
	}

	@Override
	protected void onStop() {
	    super.onStop();
	    mHelper.onStop();
	}

	@Override
	protected void onActivityResult(int request, int response, Intent data) {
	    super.onActivityResult(request, response, data);
	    mHelper.onActivityResult(request, response, data);
	}
	
    static {
        System.loadLibrary("cocos2djs");
    }
}
