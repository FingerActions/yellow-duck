//
//  AdmobHelper.h
//  flappy
//
//  Created by haotian chang on 3/03/2014.
//
//

#ifndef __flappy__AdmobHelper__
#define __flappy__AdmobHelper__

#import "cocos2d.h"

#define ADMOB_BANNER_UNIT_ID   @"ca-app-pub-4106182710083142/8799461914";

#import "GADBannerView.h"
typedef enum _bannerType
{
    kBanner_Portrait_Top,
    kBanner_Portrait_Bottom,
    kBanner_Landscape_Top,
    kBanner_Landscape_Bottom,
}CocosBannerType;

#define BANNER_TYPE kBanner_Portrait_Top


@interface MyAdmob : NSObject
{
    CocosBannerType mBannerType;
    GADBannerView *mBannerView;
    float on_x, on_y, off_x, off_y;
}


-(void)hideBannerView;
-(void)showBannerView;
@end



#endif /* defined(__flappy__AdmobHelper__) */
