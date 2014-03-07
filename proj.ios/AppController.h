
#import "RootViewController.h"
#import "GADBannerView.h"
#import "AdMobObject.h"




@class RootViewController;

@interface AppController : NSObject <UIAccelerometerDelegate, UIAlertViewDelegate, UITextFieldDelegate,UIApplicationDelegate> {
    
    UIWindow *window;
    RootViewController    *viewController;
    GADBannerView  *bannerView_;
    AdMobObject * adMobObject_;

}

@end

