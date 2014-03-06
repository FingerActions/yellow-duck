//
//  GameKitHelper.mm
//  flappy
//
//  Created by haotian chang on 1/03/2014.
//
//

#import "GameKitHelper.h"


@implementation GameKitHelper;
@synthesize gameCenterAvailable;

//静态初始化 对外接口
static GameKitHelper *sharedHelper = nil;
static UIViewController* currentModalViewController = nil;
+ (GameKitHelper *) sharedGameKitHelper {
    if (!sharedHelper) {
        sharedHelper = [[GameKitHelper alloc] init];
    }
    return sharedHelper;
}

//用于验证
- (BOOL)isGameCenterAvailable {
    // check for presence of GKLocalPlayer API
    Class gcClass = (NSClassFromString(@"GKLocalPlayer"));
    
    // check if the device is running iOS 4.1 or later
    NSString *reqSysVer =@"4.1";
    NSString *currSysVer = [[UIDevice currentDevice] systemVersion];
    BOOL osVersionSupported = ([currSysVer compare:reqSysVer
                                           options:NSNumericSearch] != NSOrderedAscending);
    
    return (gcClass && osVersionSupported);
}

- (id)init {
    if ((self = [super init])) {
        gameCenterAvailable = [self isGameCenterAvailable];
        if (gameCenterAvailable) {
            NSNotificationCenter *nc =
            [NSNotificationCenter defaultCenter];
            [nc addObserver:self
                   selector:@selector(authenticationChanged)
                       name:GKPlayerAuthenticationDidChangeNotificationName
                     object:nil];
        }
    }
    return self;
}

//后台回调登陆验证
- (void)authenticationChanged {
    
    if ([GKLocalPlayer localPlayer].isAuthenticated &&!userAuthenticated) {
        NSLog(@"Authentication changed: player authenticated.");
        userAuthenticated = TRUE;
    } else if (![GKLocalPlayer localPlayer].isAuthenticated && userAuthenticated) {
        NSLog(@"Authentication changed: player not authenticated");
        userAuthenticated = FALSE;
    }
    
}

- (void)authenticateLocalUser {
    
    if (!gameCenterAvailable) return;
    
    NSLog(@"Authenticating local user...");
    if ([GKLocalPlayer localPlayer].authenticated == NO) {
        [[GKLocalPlayer localPlayer] authenticateWithCompletionHandler:nil];
    } else {
        NSLog(@"Already authenticated!");
    }
}

//显示排行榜
- (void) showLeaderboard
{
    if (!gameCenterAvailable) return;
    
    GKLeaderboardViewController *leaderboardController = [[GKLeaderboardViewController alloc] init];
    if (leaderboardController != nil) {
        leaderboardController.leaderboardDelegate = self;
        
        UIWindow *window = [[UIApplication sharedApplication] keyWindow];
        currentModalViewController = [[UIViewController alloc] init];
        [window addSubview:currentModalViewController.view];
        
        leaderboardController.leaderboardDelegate = self;
        leaderboardController.category=@"scoreboard";
        leaderboardController.timeScope = GKLeaderboardTimeScopeAllTime;
    
        [currentModalViewController presentModalViewController:leaderboardController animated:YES];
    }
    
}

//PUSH SCORE
- (void) reportScore: (int64_t) score forCategory: (NSString*) category
{
    GKScore *scoreReporter = [[[GKScore alloc] initWithCategory:category] autorelease];
    scoreReporter.value = score;
    
    NSLog(@"I am inside report Score");
    
    [scoreReporter reportScoreWithCompletionHandler:^(NSError *error) {
        if (error != nil)
        {
            // handle the reporting error
        }
    }];
}


-(void) setViewController: (RootViewController*) vc{
    
    viewController = vc;
}

-(void) addAdMob{
    
    
    NSLog(@"-----------addAdMob");
    
    
    
    bannerView_ = [[GADBannerView alloc] initWithAdSize:kGADAdSizeSmartBannerPortrait];
    //CGRect screenRect = [[UIScreen mainScreen] bounds];
    //CGFloat screenWidth = screenRect.size.width;
    //CGFloat screenHeight = screenRect.size.height;
    
    [bannerView_ setFrame:CGRectMake(0,
                                     // screenHeight-bannerView_.bounds.size.height,
                                     0,
                                     bannerView_.bounds.size.width,
                                     bannerView_.bounds.size.height)];
    
    bannerView_.adUnitID = @"ca-app-pub-4106182710083142/8799461914";
    //AppController *app = (AppController*) [[UIApplication sharedApplication] delegate];
    //[bannerView_ setRootViewController:[app navController]];
    
    
     
    bannerView_.rootViewController = viewController;
    [viewController.view addSubview:bannerView_];
    
    GADRequest *request = [GADRequest request];
    request.testDevices = @[ @"e896b36e4164ccddf92f9e4e1246468d" ];
    [bannerView_ loadRequest:request];
    
    
}

- (void) showAddAtBottom{
    /*
     if(view && size.width>0){
     
     [view setFrame:CGRectMake(0, size.height-50, 320, 50)];
     }
     */
    [bannerView_ setHidden:YES];
    
}


//关闭排行榜回调
- (void)leaderboardViewControllerDidFinish:(GKLeaderboardViewController *)viewController{
    if(currentModalViewController !=nil){
        [currentModalViewController dismissModalViewControllerAnimated:NO];
        [currentModalViewController release];
        [currentModalViewController.view removeFromSuperview];
        currentModalViewController = nil;
    }
}

@end