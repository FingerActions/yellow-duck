//
//  MyGameCenterManager.mm
//  flappy
//
//  Created by haotian chang on 1/03/2014.
//
//

#import "MyGameCenterManager.h"
#include "GameKitHelper.h"

@implementation MyGameCenterManager

+(void) reportScore: (int64_t) score forCategory: (NSString*) category
{
    
    NSLog(@"Hello, World!");
    
    //[[GameKitHelper sharedGameKitHelper] showLeaderboard];
    
    [[GameKitHelper sharedGameKitHelper] reportScore:score forCategory:(NSString *)category];
}


@end
