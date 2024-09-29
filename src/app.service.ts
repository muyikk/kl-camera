import { Injectable } from '@nestjs/common';
import { FixedThreadPool } from 'poolifier';

@Injectable()
export class AppService {
  // 线程池
  pool: FixedThreadPool;
  // 相机列表
  cameraList: Object;
  // dll路径
  dllPath: string;
  grabbedCb: any;
  constructor() {
    this.dllPath = __dirname.replace(/dist$/, 'dll\\')
    console.log(this.dllPath)
    // 新开线程池
    this.pool = new FixedThreadPool(1, __dirname + '/camera.worker.js', {
      messageHandler: ({ bufferPtr, id, height, width, channel }) => {
        console.log('out:', bufferPtr, id, height, width, channel)
        let sn = this.cameraList[id].sn
        this.grabbedCb({bufferPtr, sn, id, height, width, channel})
      }
    });
    this.pool.execute(this.dllPath, 'initPool')
  }
  /**
   * 创建真实相机
   * @param types 相机类型
   * @returns 枚举相机数量
   */
  async init(types: string): Promise<unknown> {
    return await this.pool.execute(types, 'init')
  }

  /**
   * 创建模拟相机
   * @param count 模拟相机数量
   * @param cameraPAthList 模拟相机路径
   * @returns 模拟相机id列表
   */
  async mock(count: number, cameraPAthList: Array<string>): Promise<number[]> {
    const ids = []
    for (let i = 0; i < count; i++) {
      let id = await this.pool.execute(cameraPAthList[0], 'mock')
      ids.push(id)
    }
    return ids
  }

  /**
   * 获取相机参数
   * @param id 相机ID
   * @returns 
   */
  getParams(id: number) {
    this.pool.execute(id, 'getParams').then(({ sn, model, type, width, height, channel }) => {
      this.cameraList[id].width = width;
      this.cameraList[id].height = height;
      this.cameraList[id].channel = channel;
      this.cameraList[id].sn = sn
      this.cameraList[id].model = model
      this.cameraList[id].type = type
      console.log(this.cameraList[sn])
      return this.cameraList[id]
    }).catch(err => {
      console.error(err)
    })
  }
  /**
   * 内触发采集
   * @param id 相机id
   */
  grabInternal(id: number) {
    this.pool.execute(id, 'grabInternal')
  }
  /**
   * 外触发采集
   * @param id 相机id
   */
  grabExternal(id: number) {
    this.pool.execute(id, 'grabExternal')
  }
  /**
   * 单次采集
   * @param id 相机id
   */
  grabOnce(id: number) {
    this.pool.execute(id, 'grabOnce')
  }

  grabStop(id: number): any {
    this.pool.execute(id, 'grabStop').then(() => {
      console.log('相机', this.cameraList[id].sn, '停止采集')

    })
  }

  grabbed(callback: any) {
    this.grabbedCb = callback;
  }

  getHello() {
    return "Hello"
  }
}
