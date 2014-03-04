//
//  MyGameCenterManager.h
//  flappy
//
//  Created by haotian chang on 1/03/2014.
//
//

#ifndef __flappy__MyGameCenterManager__
#define __flappy__MyGameCenterManager__

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "GADBannerView.h"
#import "AppController.h"

@interface MyGameCenterManager : NSObject
{


}
+(void) reportScore: (int64_t) score forCategory: (NSString*) category;
+(void) showLeaderboard;
+(void) showAddAtTop;
+(void) showAddAtBottom;


@end

#endif /* defined(__flappy__MyGameCenterManager__) */
