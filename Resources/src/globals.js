//////////////////////////////////////////////////////////////////////
//FINGERACTIONS GAMES PROPRIETARY INFORMATION
//
// This software is supplied under the terms of a license agreement or
// non-disclosure agreement with FINGERACTIONS Games and may not
// be copied or disclosed except in accordance with the terms of that
// agreement.
//
//      Copyright (c) 2014 FINGERACTIONS GAMES
//      All Rights Reserved.
//
//
/////////////////////////////////////////////////////////////////////


//global const variables
//design pixel is according to non-retina iphone 5
var SCALE_FACTOR = 5;
var DECORATION_SCALE_FACTOR = 2.5;
var BACKGROUND_SCALE_FACTOR = 1.387;
var WALL_HEIGHT = [-10, -20, -30, -40, -50, -60, -70, -80, -90, -100, -110, -120, -130, -140, -150, -160, -170, -180, -190, -200];
var WALL_EXTRA_DISTANCE = 20;
var GRAVITY = 0.3 * SCALE_FACTOR;
var JUMP_VELOCITY = 7 * SCALE_FACTOR;
var MAX_NUM_BUBBLES = 5;
var MAX_NUM_WALLS = 6;
var WALL_GAP_TIME = 1.5;
var WALL_APPEAR_TIME = 2.5;
var MAX_SEA_SHEELS = 7;

// static variables
var s_currentScore = 0;
var s_gameStarted = false;
var s_weather = 0; // 0 for rainy weather , 1 for sunny weather