//
//  MyAdManager.h
//  flappy
//
//  Created by haotian chang on 27/02/2014.
//
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "GADBannerView.h"
@interface MyAdManager : NSObject
{
       GADBannerView *bannerView_;
}
+(void)showAddAtTop;
+(void)showAddAtBottom;
@end