//
//  AdMobObject.h
//  flappy
//
//  Created by haotian chang on 6/03/2014.
//
//

#ifndef __flappy__AdMobObject__
#define __flappy__AdMobObject__

#import "AdMobObject.h"
#import "RootViewController.h"
#import "GADBannerView.h"

@class RootViewController;
@class GADBannerView;
@interface AdMobObject : UIViewController{
    RootViewController * viewController;
    GADBannerView * bannerView_;
    
}
+ (AdMobObject *) shared;
- (void) setViewController:(RootViewController*)vc;
- (void) addAdMob;
- (void) showAdMob;
- (void) showAddAtBottom;
@end


#endif /* defined(__flappy__AdMobObject__) */
