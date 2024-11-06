import { Injectable } from '@nestjs/common';
import { FixedThreadPool } from 'poolifier';
import { shmem } from './dll/shmem';
import { camera } from './dll/camera';


@Injectable()
export class Camera {
  // 线程池
  private pool: FixedThreadPool;

  private shmem: any;
  private camera: any;
  // 相机列表
  public cameraList: Object;
  // dll路径
  public dllPath: string;
  public grabbedCb: any;
  constructor(dllPath: string) {
    this.cameraList = new Object;
    // this.dllPath = __dirname.replace(/dist$/, 'dll\\')
    this.dllPath = dllPath
    console.log(`dllPath:`, this.dllPath)

    let pathArray = process.env.PATH.split(';');
    pathArray.unshift(dllPath);
    process.env.PATH = pathArray.join(';');
    this.shmem = shmem(dllPath)
    this.camera = camera(dllPath)

    // 新开线程池
    this.pool = new FixedThreadPool(1, __dirname + '/camera.worker.js', {
      messageHandler: ({ bufferPtr, id, height, width, channel }) => {
        console.log('out:', bufferPtr, id, height, width, channel)
        let buffer = this.shmem.val2ptr(bufferPtr)
        let sn = this.cameraList[id].sn
        this.grabbedCb({ buffer, sn, id, height, width, channel })
      }
    });
  }
  /**
   * 初始化线程池中的工具函数
   */
  public async initPool() {
    await this.pool.execute(this.dllPath, 'initPool')
  }

  /**
   * 创建真实相机
   * @param types 相机类型
   * @returns 枚举相机数量
   */
  public async init(types: string): Promise<unknown> {
    const count: any = await this.pool.execute(types, 'init')
    for (let i = 0; i < count; i++) {
      await this.getParams(i)
    }
    return count
  }

  /**
   * 创建模拟相机
   * @param count 模拟相机数量
   * @param cameraPAthList 模拟相机路径
   * @returns 模拟相机id列表
   */
  public async mock(count: number, cameraPAthList: Array<string>): Promise<number[]> {
    const ids = []
    for (let i = 0; i < count; i++) {
      let id: any = await this.pool.execute(cameraPAthList[0], 'mock')
      await this.getParams(id)
      ids.push(id)
    }
    return ids
  }

  /**
   * 获取相机参数
   * @param id 相机ID
   * @returns 
   */
  public async getParams(id: number): Promise<any> {
    this.pool.execute(id, 'getParams').then(({ sn, model, type, width, height, channel }) => {
      const camera = { width, height, channel, sn, model, type }
      this.cameraList[id] = camera
      console.log(this.cameraList[id])
      return this.cameraList[id]
    }).catch(err => {
      console.error(err)
    })
  }
  /**
   * 内触发采集
   * @param id 相机id
   */
  public grabInternal(id: number): undefined {
    this.pool.execute(id, 'grabInternal')
  }
  /**
   * 外触发采集
   * @param id 相机id
   */
  public grabExternal(id: number): undefined {
    this.pool.execute(id, 'grabExternal')
  }
  /**
   * 单次采集
   * @param id 相机id
   */
  public grabOnce(id: number) {
    this.pool.execute(id, 'grabOnce')
  }
  /**
   * 停止采集
   * @param id 相机id
   */
  public grabStop(id: number): undefined {
    this.pool.execute(id, 'grabStop').then(() => {
      console.log('相机', this.cameraList[id].sn, '停止采集')

    })
  }
  /**
   * 回调函数，用于出图
   * @param callback 
   */
  public grabbed(callback: any): undefined {
    this.grabbedCb = callback;
  }
  /**
   * 释放图片内存
   * @param buffer 要释放的图片buffer
   */
  public free(buffer: any): undefined {
    this.camera.free_img(buffer);
  }
  /**
   * 
   * @returns 
   */
  public getHello() {
    return "Hello"
  }
}
