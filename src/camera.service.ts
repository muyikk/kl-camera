import { Injectable } from '@nestjs/common';
import { FixedThreadPool } from 'poolifier';
import { camera } from './dll/camera';
import * as KLBuffer from 'kl-buffer'
import { CameraInterface } from './interface'

@Injectable()
export class Camera implements CameraInterface {
  // 线程池
  private pool: FixedThreadPool;
  // 相机dll
  private camera: any;
  // 出图回调
  private grabbedCb: any;
  // 相机列表
  public cameraList: Object;
  // dll路径
  public dllPath: string;

  // isMock: boolean;
  // imagePtrMap: Map<number, any>;
  // expectedFrameNo: number;
  constructor(dllPath: string) {
    this.cameraList = new Object;
    this.dllPath = dllPath
    console.log(`dllPath:`, this.dllPath)

    let pathArray = process.env.PATH.split(';');
    pathArray.unshift(dllPath);
    process.env.PATH = pathArray.join(';');
    this.camera = camera(dllPath)
    // // 用于纠正出图顺序
    // this.imagePtrMap = new Map<number, any>;
    // this.expectedFrameNo = 0;
    // 新开线程池
    this.pool = new FixedThreadPool(1, __dirname + '/camera.worker.js', {
      messageHandler: ({ fno, bufferPtrVal, id, height, width, channel }) => {
        let sn = this.cameraList[id].sn
        // // 根据出图序号纠正出图顺序
        // this.imagePtrMap.set(fno, bufferPtrVal)
        // while(this.imagePtrMap.size > 0){
        //   const expectedImagePtr = this.imagePtrMap.get(this.expectedFrameNo)
        //   if (expectedImagePtr) {
        //     this.imagePtrMap.delete(this.expectedFrameNo);
        //     this.grabbedCb({ fno:this.expectedFrameNo, bufferPtrVal:expectedImagePtr, sn, id, height, width, channel })
        //     this.expectedFrameNo += 1;
        //   }
        // }
        this.grabbedCb({ fno, bufferPtrVal, sn, id, height, width, channel })
      }
    });
  }
  /**
   * 初始化线程池中的工具函数
   */
  public async initPool(): Promise<void> {
    await this.pool.execute(this.dllPath, 'initPool')
  }

  /**
   * 创建真实相机
   * @param types 相机类型
   * @returns 真实相机id列表
   */
  public async init(types: string): Promise<number[]> {
    const ids = []
    const count: any = await this.pool.execute(types, 'init')
    for (let i = 0; i < count; i++) {
      await this.getParams(i)
      ids.push(i)
    }
    // count > 0 ? this.isMock = false : this.isMock
    return ids
  }

  /**
   * 创建模拟相机
   * @param count 模拟相机数量
   * @param cameraPAthList 模拟相机路径列表
   * @returns 模拟相机id列表
   */
  public async mock(count: number, cameraPAthList: Array<string>): Promise<number[]> {
    const ids = []
    for (let i = 0; i < count; i++) {
      let id: any = await this.pool.execute(cameraPAthList[i], 'mock')
      await this.getParams(id)
      ids.push(id)
    }
    // count > 0 ? this.isMock = true : this.isMock
    return ids
  }

  /**
   * 获取相机参数
   * @param id 相机ID
   * @returns 
   */
  public async getParams(id: number): Promise<any> {
    let camera = await this.pool.execute(id, 'getParams')
    this.cameraList[id] = camera;
    return this.cameraList[id];
  }
  /**
   * 内触发采集
   * @param id 相机id
   */
  public grabInternal(id: number): void {
    this.pool.execute(id, 'grabInternal')
  }
  /**
   * 外触发采集
   * @param id 相机id
   */
  public grabExternal(id: number): void {
    this.pool.execute(id, 'grabExternal')
  }
  /**
   * 单次采集
   * @param id 相机id
   */
  public grabOnce(id: number): void {
    this.pool.execute(id, 'grabOnce')
  }
  /**
   * 停止采集
   * @param id 相机id
   */
  public grabStop(id: number): void {
    this.pool.execute(id, 'grabStop').then(() => {
      // console.log('相机', this.cameraList[id].sn, '停止采集')
      // this.isMock == false ? this.expectedFrameNo = 0 : this.expectedFrameNo
    })
  }
  /**
   * 回调函数，用于出图
   * @param callback 
   */
  public grabbed(callback: any): void {
    this.grabbedCb = callback;
  }
  /**
   * 释放图片内存
   * @param buffer 要释放的图片buffer
   */
  public free(buffer: any): void {
    this.camera.free_img(buffer);
  }
  /**
   * 相机畸变校正
   * @param id 相机id
   * @param params 畸变校正参数,为NULL时取消校正  [0-3]相机内参 [4]外参数量(4/5/8/12/14) [5-end]畸变外参
   * @returns true:成功, false:失败
   */
  public async cameraUndistort({ id, params }): Promise<boolean> {
    let fail = await this.pool.execute({ id, params }, 'cameraUndistort')
    if (fail) {
      console.error('undistort fail!')
      return false
    } else {
      return true
    }
  }
  /**
   * 设置曝光时间
   * @param id 相机id
   * @param time 曝光时间
   * @returns true:成功, false:失败
   */
  public async setExposureTime({ id, time }): Promise<boolean> {
    let fail = await this.pool.execute({ id, time }, 'setExposureTime')
    if (fail) {
      console.error('setExposureTime fail!')
      return false
    } else {
      return true
    }
  }
  /**
   * 获取曝光时间
   * @param id 相机id
   * @returns time 曝光时间，false => 失败
   */
  public async getExposureTime(id: number): Promise<any> {
    let { fail, time }: any = await this.pool.execute(id, 'getExposureTime')
    if (fail) {
      console.error('getExposureTime fail!')
      return false
    } else {
      return time
    }
  }
  /**
   * 后端接受数据源订阅
   * @param name 订阅名称（需与前端subscribe订阅时同名）
   * @returns true:成功, false:失败
   */
  public subscribeBackend(name: string): any {
    let fail = this.pool.execute(name, 'subscribeBackend')
    if (fail) {
      console.error('subscribeBackend fail!')
      return false
    } else {
      return true
    }
  }
  /**
   * 关闭所有相机
   */
  public async closeAll(): Promise<void> {
    await this.pool.execute('closeAll')
  }
}
