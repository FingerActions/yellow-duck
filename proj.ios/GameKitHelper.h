//
//  GameKitHelper.h
//  flappy
//
//  Created by haotian chang on 1/03/2014.
//
//

#ifndef flappy_GameKitHelper_h
#define flappy_GameKitHelper_h

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <GameKit/GameKit.h>
#import "GADBannerView.h"
#import "AppController.h"

@class RootViewController;
@class GADBannerView;

@interface GameKitHelper :  NSObject <GKLeaderboardViewControllerDelegate, GKAchievementViewControllerDelegate, GKMatchmakerViewControllerDelegate, GKMatchDelegate>{
    BOOL gameCenterAvailable;
    BOOL userAuthenticated;
    RootViewController * viewController;
    GADBannerView *bannerView_;
}

@property (assign, readonly) BOOL gameCenterAvailable;

+ (GameKitHelper *)sharedGameKitHelper;
- (void) authenticateLocalUser;
- (void) reportScore: (int64_t) score forCategory: (NSString*) category;
- (void) showLeaderboard;
- (void)leaderboardViewControllerDidFinish:(GKLeaderboardViewController *)viewController;
- (void) addAdMob;
- (void) setViewController:(RootViewController*) vc;
- (void) showAddAtBottom;

@end


#endif
