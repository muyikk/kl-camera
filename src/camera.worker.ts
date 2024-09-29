import { ThreadWorker } from "poolifier";
import { parentPort } from "worker_threads";
import { camera } from 'src/dll/camera';
import { shmem } from 'src/dll/shmem';
import * as ref from "ref-napi"


class CameraWorker extends ThreadWorker {
  private _grabCbMap: Map<number, Buffer>;
  private cameraScript: any;
  private shmem: any;
  constructor() {
    super({
      /**
       * 初始化线程中dll模块
       * @param dllPath dll路径
       */
      initPool: (dllPath: string) => {
        let pathArray = process.env.PATH.split(';');
        pathArray.unshift(dllPath);
        process.env.PATH = pathArray.join(';');
        this.cameraScript = camera(dllPath)
        this.shmem = shmem(dllPath)
        console.log(`初始化线程中dll模块\t完成`)
      },
      /**
       * 创建实体相机
       * @param cameraType 相机类型
       * @returns 相机数量
       */
      init: (cameraType: string) => {
        return this.cameraScript.init_camera(cameraType);
      },
      /**
       * 创建模拟相机
       * @param mockCameraPath 模拟相机地址
       * @returns 相机数量
       */
      mock: (mockCameraPath: string) => {
        return this.cameraScript.mock_camera(mockCameraPath);
      },
      /**
       * 获取相机参数
       * @param id 相机id
       * @returns { sn, model, type, width, height, channel }: {相机sn, 相机型号, 相机类型, 宽, 高, 通道}
       */
      getParams: (id: number) => {
        const picWidth = Buffer.alloc(4);
        const picHeight = Buffer.alloc(4);
        const channels = Buffer.alloc(4);
        this.cameraScript.camera_size(id, picHeight, picWidth, channels);
        const width = picWidth.readInt32LE();
        const height = picHeight.readInt32LE();
        const channel = channels.readInt32LE();

        const snBuffer = this.cameraScript.camera_sn(id);
        const modelBuffer = this.cameraScript.camera_model(id);
        const typeBuffer = this.cameraScript.camera_type(id);
        const sn = ref.readCString(snBuffer, 0);
        const model = ref.readCString(modelBuffer, 0);
        const type = ref.readCString(typeBuffer, 0);

        return { sn, model, type, width, height, channel };
      },
      /**
       * 内触发采集
       * @param id 相机id
       */
      grabInternal: (id: number) => {
        let _grabCb = null;
        _grabCb = this.cameraScript.grabCb((fno, buffer, height, width, channel, user) => {
          this._grabCbMap.set(id, _grabCb)
          let bufferPtr = this.shmem.ptr2val(buffer);
          // console.log('pool:', bufferPtr, id, height, width, channel)
          parentPort.postMessage({ bufferPtr, id, height, width, channel });
        });
        this.cameraScript.grab_internal(id, _grabCb, Buffer.alloc(0));
      },
      /**
       * 外触发采集
       * @param id 相机id
       */
      grabExternal: (id: number) => {
        let _grabCb = null;
        _grabCb = this.cameraScript.grabCb((fno, buffer, height, width, channel, user) => {
          this._grabCbMap.set(id, _grabCb)
          let bufferPtr = this.shmem.ptr2val(buffer);
          // console.log('pool:', bufferPtr, id, height, width, channel)
          parentPort.postMessage({ bufferPtr, id, height, width, channel });
        });
        this.cameraScript.grab_external(id, _grabCb, Buffer.alloc(0));
      },
      /**
       * 单次采集
       * @param id 相机id
       */
      grabOnce: (id: number) => {
        let _grabCb = null;
        _grabCb = this.cameraScript.grabCb((fno, buffer, height, width, channel, user) => {
          this._grabCbMap.set(id, _grabCb)
          let bufferPtr = this.shmem.ptr2val(buffer);
          // console.log('pool:', bufferPtr, id, height, width, channel)
          parentPort.postMessage({ bufferPtr, id, height, width, channel });
        });
        this.cameraScript.grab_once(id, _grabCb, Buffer.alloc(0));
      },
      /**
       * 停止采集
       * @param id 相机id
       * @returns 
       */
      grabStop: (id: number) => {
        return this.cameraScript.grab_stop(id)
      },
      /**
       * 关闭所有相机
       */
      closeAll: async () => {
        return await this.cameraScript.close_all_cameras();
      }
    })
    this._grabCbMap = new Map();
  }



  test() {
    console.log('================================');
  }

}

module.exports = new CameraWorker()

