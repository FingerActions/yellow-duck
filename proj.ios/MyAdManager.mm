//
//  MyAdManager.mm
//  flappy
//
//  Created by haotian chang on 27/02/2014.
//
//

#import "MyAdManager.h"
#import "myoc.h"

@implementation MyAdManager

+ (void)showAddAtTop {
    
    NSLog(@"Hello, World!");
    
    if (view && size.width > 0) {
        [view setFrame:CGRectMake(0, -13, 320, 500)];
    }
}

+ (void)showAddAtBottom {
    if (view && size.width > 0) {
        [view setFrame:CGRectMake(0, size.height - 50, 320, 50)];
    }
}

@end