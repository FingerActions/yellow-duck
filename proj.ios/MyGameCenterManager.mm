//
//  MyGameCenterManager.mm
//  flappy
//
//  Created by haotian chang on 1/03/2014.
//
//

#import "MyGameCenterManager.h"
#include "GameKitHelper.h"
#import "AdMobObject.h"
#import "myoc.h"
#import "RootViewController.h"
#import "GADBannerView.h"



@implementation MyGameCenterManager

static MyGameCenterManager *instance;


+(MyGameCenterManager*)shared{
    
    @synchronized(self){
        
        if(instance == nil){
         
            instance = [[self alloc] init];
            
        }
    }
    
    return instance;
    
}


- (void) reportScore: (int64_t) score forCategory: (NSString*) category
{
    
    NSLog(@"Hello, World!");
    
    //[[GameKitHelper sharedGameKitHelper] showLeaderboard];
    
    [[GameKitHelper sharedGameKitHelper] reportScore:score forCategory:(NSString *)category];
}


- (void) showLeaderboard
{
    
     [[GameKitHelper sharedGameKitHelper] showLeaderboard];
}

- (void) addAdMob
{

    [[AdMobObject shared] addAdMob];
    
}

- (void) showAddAtTop{
 
    [[AdMobObject shared] showAddAtTop];
}


- (void) showAddAtBottom{
   
    
    [[AdMobObject shared] showAddAtBottom];
    
}
 


@end
