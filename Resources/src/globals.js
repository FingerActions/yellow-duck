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
//design pixel is according to non-retina iphone 4
var SCALE_FACTOR = 5;
//decoration will be non-retina on big screens
var DECORATION_SCALE_FACTOR = 2;
//full screen images will be partial retina
var FULLSCREEN_SCALE_FACTOR = 1600 / 1536;
var WALL_MIN_GAP = 150 * SCALE_FACTOR;
var WALL_MAX_GAP = 200 * SCALE_FACTOR;
var GRAVITY = 0.3 * SCALE_FACTOR;
var JUMP_VELOCITY = 7 * SCALE_FACTOR;
var MAX_NUM_BUBBLES = 5;
var MAX_NUM_FISH = 20;
var MAX_NUM_LEAFS = 5;
var MAX_NUM_WALLS = 6;
var WALL_GAP_TIME = 1.5;
var WALL_APPEAR_TIME = 2.5;
var MAX_SEA_SHEELS = 7;
var DESIGN_FPS = 60;

// static variables
var s_currentScore = 0;
var s_gameStarted = false;
var s_weather = 0; // 0 for rainy weather , 1 for sunny weather
var s_isHighScore = false;

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Returns a random number between min and max
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


// Returns bool value of an event according to occurence rate
// rate should be 1 - 100
function getRandomOccurence(rate) {

    return getRandomInt(1, 100) <= rate ? true : false;

}