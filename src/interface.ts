import { FixedThreadPool } from 'poolifier';
import KLBuffer from 'kl-buffer';
export declare interface Image {
  klBuffer: KLBuffer;
  // 图片宽度
  width: number;
  // 图片高度
  height: number;
  // 图片通道
  channel: number;
}
export declare interface GrabCbParam {
  /**帧号 */
  fno: number;
  /**相机sn */
  sn: string;
  /**相机id */
  id: number;
  /**图片 */
  image: Image;
}
export interface CameraInterface {
  // 相机列表
  cameraList: Object;

  /**
   * 创建真实相机
   * @param types 相机类型
   * @returns 真实相机id列表
   */
  init(types: string): Promise<number[]>

  /**
   * 创建模拟相机
   * @param cameraPAthList 模拟相机路径列表
   * @returns 模拟相机id列表
   */
  mock(cameraPAthList: Array<string>): Promise<number[]>

  /**
   * 获取相机参数
   * @param id 相机ID
   * @returns 
   */
  getParams(id: number): Promise<any>

  /**
   * 内触发采集
   * @param id 相机id
   * @param callback 出图回调函数
   */
  grabInternal(id: number, callback: ({ fno, sn, id, image }: GrabCbParam)=> void): void

  /**
   * 外触发采集
   * @param id 相机id
   * @param callback 出图回调函数
   */
  grabExternal(id: number, callback: ({ fno, sn, id, image }: GrabCbParam)=> void): void

  /**
   * 单次采集
   * @param id 相机id
   * @param callback 出图回调函数
   */
  grabOnce(id: number, callback: ({ fno, sn, id, image }: GrabCbParam)=> void): void

  /**
   * 停止采集
   * @param id 相机id
   */
  grabStop(id: number): void


  /**
   * 释放图片内存
   * @param buffer 要释放的图片buffer
   */
  freeImg(buffer: any): void

  /**
   * 相机畸变校正
   * @param id 相机id
   * @param params 畸变校正参数,为NULL时取消校正  [0-3]相机内参 [4]外参数量(4/5/8/12/14) [5-end]畸变外参
   * @returns true:成功, false:失败
   */
  undistort(id: number, undistortParams: Array<number>|null): Promise<boolean>

  /**
   * 设置曝光时间
   * @param id 相机id
   * @param time 曝光时间
   * @returns true:成功, false:失败
   */
  setExposureTime( id: number, time: number ): Promise<boolean>

  /**
   * 获取曝光时间
   * @param id 相机id
   * @returns time 曝光时间，return false => 失败
   */
  getExposureTime(id: number): Promise<boolean|number>

  /**
   * 关闭所有相机
   */
  closeAll(): Promise<void>

  /**
   * 后端接受数据源订阅
   * @param name 订阅名称（需与前端subscribe订阅时同名）
   */
  subscribeBackend(name: string): Promise<boolean>
}