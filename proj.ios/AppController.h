
#import "RootViewController.h"
#import "GADBannerView.h"


static    GADBannerView  *bannerView_;

@class RootViewController;

@interface AppController : NSObject <UIAccelerometerDelegate, UIAlertViewDelegate, UITextFieldDelegate,UIApplicationDelegate> {
    
    UIWindow *window;
    RootViewController    *viewController;
 

}

@end

