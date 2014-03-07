//
//  AdMobObject.mm
//  flappy
//
//  Created by haotian chang on 6/03/2014.
//
//

#import "AdMobObject.h"
#import "AppController.h"
#import "RootViewController.h"
#import "EAGLView.h"
#import "cocos2d.h"

@implementation AdMobObject
static AdMobObject* instance;

+(AdMobObject *) shared{
    @synchronized(self){
        if( instance == nil ){
            instance = [[self alloc] init];
        }
    }
    return instance;
}

- (void) setViewController:(RootViewController*)vc{

    viewController = vc;


}
- (void) addAdMob{
    NSLog(@"----------addAdMob");
    
   
    bannerView_ = [[GADBannerView alloc] initWithAdSize:kGADAdSizeSmartBannerPortrait];
    CGRect screenRect = [[UIScreen mainScreen] bounds];
    
    CGFloat screenHeight = screenRect.size.height;
    
    
    [bannerView_ setFrame:CGRectMake(0,
                                     // screenHeight-bannerView_.bounds.size.height,
                                     0,
                                     bannerView_.bounds.size.width,
                                     bannerView_.bounds.size.height)];
    bannerView_.adUnitID = @"ca-app-pub-4106182710083142/8799461914";
  
    bannerView_.rootViewController = viewController;
    [viewController.view addSubview:bannerView_];
    GADRequest *request = [GADRequest request];
    // For testing
    request.testDevices = [NSArray arrayWithObjects:@"e896b36e4164ccddf92f9e4e1246468d", nil];
    [bannerView_ loadRequest:request];

    
}
- (void) showAddAtTop{
    
    NSLog(@"[AppController]: showAdView");
   // [UIView animateWithDuration:1.0 animations:^ {
        CGRect screenRect = [[UIScreen mainScreen] bounds];
        CGFloat screenHeight = screenRect.size.height;
        // Final frame of ad should be docked to bottom of screenqq
       bannerView_.frame = CGRectMake(0,
                                       //screenHeight-bannerView_.bounds.size.height,
                                       0,
                                       bannerView_.bounds.size.width,
                                       bannerView_.bounds.size.height);
   // }];
    

}
- (void) showAddAtBottom{
    // HIDE SOME THING
    

        NSLog(@"[AppController]: showAdView");
//        [UIView animateWithDuration:1.0 animations:^ {
            CGRect screenRect = [[UIScreen mainScreen] bounds];
            CGFloat screenHeight = screenRect.size.height;
            // Final frame of ad should be docked to bottom of screenqq
            bannerView_.frame = CGRectMake(0,
                                           screenHeight-bannerView_.bounds.size.height,
                                          //0,
                                           bannerView_.bounds.size.width,
                                           bannerView_.bounds.size.height);
  //      }];
   
}
@end