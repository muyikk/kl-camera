import { Library } from 'ffi-napi';

export const shmem = (dllPath) => {
  const ogCommon = new Library(dllPath + 'og-common', {
    /*
    @brief 分配共享内存(创建a逻辑内存-a磁盘映射)
    @param[in] name  共享内存块名称(其他进程ref时需同名)
    @param[in] size  共享内存块大小(字节单位)
    @param[in/out] handle  共享内存块句柄(unref释放时需传入，size_t = uint64)
    @return 共享内存块首地址
    */
    shmalloc: ['uchar *', ['char *', 'uint64', 'uint64 *']],
    /*
    @brief 引用共享内存(创建a+逻辑内存-磁盘映射)
    @param[in] name  共享内存块名称(其他进程已shmalloc分配同名共享内存块)
    @param[in] handle  共享内存块句柄(unref释放时需传入，size_t = uint64)
    @return 共享内存块首地址
    */
    ref: ['uchar *', ['string', 'uint64 *']],
    /*
    @brief 释放共享内存(解除映射)
    @param[in] handle  共享内存块句柄(shmalloc或ref时获取)
    @param[in] ptr  共享内存块首地址(shmalloc或ref时返回)
    @hint  共享内存块仅当所有shmalloc/ref方均已unref时才真正释放回收
    */
    unref: ['void', ['uchar *', 'uint64 *']],
    /*
    @brief 图像复制，将src的src_roi区域复制至dst的dst_roi区域
    @param[in] src_data 原图的数据指针
    @param[in] src_h 原图的高
    @param[in] src_w 原图的宽
    @param[in] src_roi_data 原图的感兴趣区域的数据指针(x0,y0,w,h)
    @param[in/out] dst_data 目标图的数据指针
    @param[in] dst_h 目标图的高
    @param[in] dst_w 目标图的宽
    @param[in] dst_roi_data 目标图的感兴趣区域的数据指针(x1,y1,w,h)
    @param[in] channels 图像通道
    */
    copy: [
      'void',
      [
        'uchar *',
        'int',
        'int',
        'uchar *',
        'uchar *',
        'int',
        'int',
        'uchar *',
        'int',
      ],
    ],
    /*
    @brief 读图片
    @param[in] img_path 读入图片的路径
    @param[in/out] img_data 读入图片的数据指针
    @param[in] img_h 读入图片的高
    @param[in] img_w 读入图片的宽
    @param[in] img_c 读入图片的通道数
    @param[in] is_utf8 file是否为utf8编码
    @return 是否成功
    */
    imread: ['bool', ['string', 'uchar *', 'int', 'int', 'int', 'bool']],
    /*
    @brief 写图片
    @param[in] img_path 写出图片的路径
    @param[in] img_data 写出图片的数据指针
    @param[in] img_h 写出图片的宽
    @param[in] img_w 写出图片的高
    @param[in] img_c 写出图片的通道数
    @param[in] is_utf8 file是否为utf8编码
    @return 是否成功
    */
    imwrite: ['void', ['string', 'uchar *', 'int', 'int', 'int', 'bool']],
    imwrite_async: ['void', ['string', 'uchar *', 'int', 'int', 'int', 'bool']],
    /*
    @brief 图像缩放
    @param[in] src 原图的数据指针
    @param[in] srcH 原图的高
    @param[in] srcW 原图的宽
    @param[in/out] dst 目标图的数据指针
    @param[in] dstH 目标图的高
    @param[in] dstW 目标图的宽
    @param[in] channels 图像通道
    @param[in] code(插值方式：0-INTER_NEAREST；1-INTER_LINEAR；2-INTER_CUBIC；3-INTER_AREA；
    4-INTER_LANCZOS4；5INTER_LANCZOS4；6-INTER_NEAREST_EXACT；
    7-INTER_NEAREST_EXACT；8-WARP_FILL_OUTLIERS；16-WARP_INVERSE_MAP) 
    */
    resize: [
      'void',
      ['char*', 'int', 'int', 'char*', 'int', 'int', 'int', 'int'],
    ],
    /*
    @brief 图像旋转
    @param img 图像的数据指针(输入旋转前，输出旋转后)
    @param height 图像的高
    @param width 图像的宽
    @param channel 图像的通道
    @param 旋转代码(0->90°，1->180°，2->270° )
    */
    rotate: ['bool', ['char *', 'int', 'int', 'int', 'int']],
    /*
    @brief  图像翻转
    @param img 图像的数据指针
    @param height 图像的高
    @param width 图像的宽
    @param channels 图像的通道
    @param code 翻转代码(0->纵向，1->横向，2->同时 )
    */
    flip: ['bool', ['char *', 'int', 'int', 'int', 'int']],
    /*
    @brief rgb转gray
    @param[in] rgb_data 转换前rgb图片的数据指针
    @param[in] height 图片的高
    @param[in] width 图片的宽
    @param[in/out] gray_data 转换后gray图片的数据指针
    */
    rgb2gray: ['void', ['uchar *', 'int', 'int', 'uchar*']],
    /*
    @brief bgr转gray
    @param[in] bgr_data 转换前bgr图片的数据指针
    @param[in] height 图片的高
    @param[in] width 图片的宽
    @param[in/out] gray_data 转换后gray图片的数据指针
    */
    bgr2gray: ['void', ['uchar *', 'int', 'int', 'uchar*']],
    /*
    @brief 画框
    @param[in] src_data  原图的数据指针
    @param[in] src_h 原图的高
    @param[in] src_w 原图的宽
    @param[in] src_c 原图的通道数
    @param[in/out] dst_data  目标图的数据指针(大小为src_h*src_w*3)
    @param[in] roi_data 感兴趣区域的数据指针(x,y,w,h)
    param[in] pix_width 像素宽
    */
    drawRectangle: [
      'void',
      ['uchar *', 'int', 'int', 'int', 'int *', 'int *', 'int'],
    ],
  });
  const shmem = new Library(dllPath + 'shmem', {
    // 根据buffer获取指针 ['返回值,['buffer']]
    ptr2val: ['uint64', ['uchar *']],
    // 根据指针获取buffer ['返回值,['指针']]
    val2ptr: ['uchar *', ['uint64']],
    // gray转rgb
    gray2rgb: ['bool ', ['uchar *', 'uchar *', 'int', 'int']],
    // 切割图像  ['返回值',['原图像buffer','原图像宽','原图像高','切割起始点x','切割起始点y','切割图像buffer','新图像宽','新图像高','通道值']]
    crop: [
      'void',
      ['uchar *', 'int', 'int', 'int', 'int', 'uchar *', 'int', 'int', 'int'],
    ],
    // 粘贴图像  ['返回值',]'原图像buffer','原图像宽','原图像高','粘贴起始点x','粘贴起始点y','新图像宽','新图像宽','通道值']]
    paste: [
      'bool',
      ['uchar *', 'int', 'int', 'int', 'int', 'uchar *', 'int', 'int', 'int'],
    ],
  });
  Object.assign(shmem, ogCommon);
  return shmem;
};
