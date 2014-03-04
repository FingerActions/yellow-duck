//
//  MyGameCenterManager.mm
//  flappy
//
//  Created by haotian chang on 1/03/2014.
//
//

#import "MyGameCenterManager.h"
#include "GameKitHelper.h"
#import "myoc.h"

@implementation MyGameCenterManager

+(void) reportScore: (int64_t) score forCategory: (NSString*) category
{
    
    NSLog(@"Hello, World!");
    
    //[[GameKitHelper sharedGameKitHelper] showLeaderboard];
    
    [[GameKitHelper sharedGameKitHelper] reportScore:score forCategory:(NSString *)category];
}

+ (void) showLeaderboard
{
    
     [[GameKitHelper sharedGameKitHelper] showLeaderboard];
}

+ (void) showAddAtTop{
    /*
    if(view && size.width>0){
        
        [view setFrame:CGRectMake(0, -13, 320, 50)];
    }
     */
    
    
    
}


+ (void) showAddAtBottom{
    /*
    if(view && size.width>0){
        
        [view setFrame:CGRectMake(0, size.height-50, 320, 50)];
    }
    */
    

    
}

@end
