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

@interface MyGameCenterManager : NSObject
{
    
}
+(void) reportScore: (int64_t) score forCategory: (NSString*) category;
@end

#endif /* defined(__flappy__MyGameCenterManager__) */
