import { Library, Callback } from 'ffi-napi';
export const camera = (dllPath: string) => {
  const camera = new Library(dllPath, {
    /*
      @brief 打印库版本信息（编译时间）
      @return  yyyy-mm-dd hh:mm:ss
      */
    get_dll_version: ['char *', []],

    /*
      @brief 获取当前日期与时间
      @param [out,char[9]]当前日期，yyyymmdd
      @param [out,char[13]]当前时间，hh:mm:ss.mss
      */
    get_date_time: ['void ', ['char *', 'char *']],

    /*
      @brief 获取当前时间
      @return 当前时间，yyyymmddhhmmss
      */
    get_time: ['int *', []],

    /*
      @brief 获取当前时间戳
      @param [in]时间戳单位，false 到毫秒13位，true 到秒10位
      @return 当前时间戳
      */
    get_timestamp: ['int * ', ['bool']],

    /*
      @brief 初始化指定类型的实体相机
      @param [in] 需初始化的相机类型，以'|'号分隔
      @return 找到并打开的相机数量
     */
    init_camera: ['int ', ['string']],

    /*
      @brief 初始化模拟相机
      @param [in] 模拟相机路径或脚本，为路径时仅能外触发监听
      @return 该模拟相机的id，为负值
     */
    mock_camera: ['int ', ['string']],

    /*
      @brief 生成模拟相机脚本
      @param [in] 生成模拟相机脚本的路径与文件名
      @return  0:成功 1:失败
      mock_camera()时若该脚本不存在会自动生成，一般无需手动调用
      */
    mock_camera_script: ['int ', ['char *']],

    /*
      @brief 获取相机类型
      @param [in] 相机id
      @return id不存在时返NULL
     */
    camera_type: ['char *', ['int']],

    /*
      @brief 获取相机型号（"model(sn)"形式）
      @param [in] 相机id
      @return id不存在时返NULL
     */
    camera_model: ['char *', ['int']],

    /*
      @brief 获取相机序列号
      @param [in] 相机id
      @return id不存在时返NULL
      */
    camera_sn: ['char *', ['int']],

    /*
      @brief 获取相机图像尺寸
      @param [in] 相机id
      @param [out] 图像高度（行数）
      @param [out] 图像宽度（列数）
      @param [out] 图像通道数（1:灰度图 3:彩色图）
      @return 0:成功 1:失败
      */
    camera_size: ['int', ['int', 'int *', 'int *', 'int *']],

    /*
      @brief 打开相机
      @param [in] 相机id
      @param [in] 配置文件的路径与文件名
      @return 0:成功 other:失败
      init_camera()或mock_camera()时会自动打开，一般无需手动调用
      */
    open_camera: ['int', ['int', 'int *']],

    /*
      @brief 关闭相机
      @param [in] 相机id
      @return 0:成功 other:失败
      */
    close_camera: ['int', ['int', 'int *']],

    /*
      @brief 关闭所有相机
      */
    close_all_cameras: ['void', []],

    /*
      @brief 内触发单帧采集
      @param [in] 相机id
      @param [in] 回调函数
      @param [in] 回调自定义数据
      @return 0:成功 other:失败
      */
    grab_once: ['int ', ['int', 'pointer', 'void *']],

    /*
      @brief 内触发连续采集
      @param [in] 相机id
      @param [in] 回调函数
      @param [in] 回调自定义数据
      @return 0:成功 other:失败
      */
    grab_internal: ['int', ['int', 'pointer', 'void *']],

    /*
      @brief 外触发连续采集
      @param [in] 相机id
      @param [in] 回调函数
      @param [in] 回调自定义数据
      @return 0:成功 other:失败
      */
    grab_external: ['int', ['int', 'pointer', 'void *']],

    /*
      @brief 停止连续采集（切换回单帧采集模式）
      @param [in] 相机id
      @return 0:成功 other:失败
      */
    grab_stop: ['int', ['int']],

    /**
     * 释放图像数据内存，按指针传递
     * @param [in] 图像数据内存指针（Buffer(uchar)）
     */
    free_img: ['void', ['uchar*']],
    /// 相机畸变校正
    /// id[in] 相机id
    /// param[in,double[19]] 畸变校正参数，为NULL时取消校正
    ///      [0-3]相机内参 [4]外参数量(4/5/8/12/14) [5-end]畸变外参
    /// return 0:成功, 1:失败
    camera_undistort: ['int', ['int', 'double*']],
    /// 获取曝光时间
    /// id[in] 相机id
    /// time[out] 曝光时间(us)
    /// return 0:成功, 1:失败
    get_exposure_time: ['int', ['int', 'float*']],
    /// 设置曝光时间
    /// id[in] 相机id
    /// time[in] 曝光时间(us)
    /// return 0:成功, 1:失败
    set_exposure_time: ['int', ['int', 'float']],
    /// 后端接受数据源订阅
    /// name[in] 订阅名称（需与前端subscribe订阅时同名）
    /// return 0:成功 1:失败
    /// 一般前端应先subscribe（分配并填写共享内存块）再通知后端（对其引用）
    subscribe_backend: ['int', ['string']],
    /*
      @brief 写图片
      @param [in] 写出图片的路径
      @param [in] 写出图片的数据指针
      @param [in] 写出图片的高
      @param [in] 写出图片的宽
      @param [in] 写出图片的通道数
      @return true:成功, false:失败
      */
    imwrite: ['bool', ['char *', 'uchar *', 'int', 'int', 'int']],

    /*
      @brief 读图片
      @param [in] 写出图片的路径
      @param [out] 读入图片的数据指针（free_img或free_pimg手动释放）
      @param [in] 写出图片的高
      @param [in] 写出图片的宽
      @param [in] 写出图片的通道数
      @return true:成功, false:失败
      */
    imread: ['bool', ['char *', 'uchar *', 'int', 'int', 'int']],
  });

  /*
  @brief 采集回调函数
  @param [in] 帧号
  @param [in] 图像数据指针（free_img手动释放）
  @param [in] 图像高度（行数）
  @param [in] 图像宽度（列数）
  @param [in] 图像通道数（1:灰度图 3:彩色图）
  @param [in] 转发自定义数据
  */
  camera.grabCb = (callback) => {
    const cb = Callback(
      'void',
      ['int64', 'uchar *', 'int', 'int', 'int', 'void *'],
      (...arg) => {
        callback(...arg);
      },
    );
    return cb;
  };

  return camera;
};