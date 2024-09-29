"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const poolifier_1 = require("poolifier");
const worker_threads_1 = require("worker_threads");
const camera_1 = require("./dll/camera");
const shmem_1 = require("./dll/shmem");
const ref = require("ref-napi");
class CameraWorker extends poolifier_1.ThreadWorker {
    constructor() {
        super({
            initPool: (dllPath) => {
                let pathArray = process.env.PATH.split(';');
                pathArray.unshift(dllPath);
                process.env.PATH = pathArray.join(';');
                this.cameraScript = (0, camera_1.camera)(dllPath);
                this.shmem = (0, shmem_1.shmem)(dllPath);
            },
            init: (cameraType) => {
                return this.cameraScript.init_camera(cameraType);
            },
            mock: (mockCameraPath) => {
                return this.cameraScript.mock_camera(mockCameraPath);
            },
            getParams: (id) => {
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
            grabInternal: (id) => {
                let _grabCb = null;
                _grabCb = this.cameraScript.grabCb((fno, buffer, height, width, channel, user) => {
                    this._grabCbMap.set(id, _grabCb);
                    let bufferPtr = this.shmem.ptr2val(buffer);
                    worker_threads_1.parentPort.postMessage({ bufferPtr, id, height, width, channel });
                });
                this.cameraScript.grab_internal(id, _grabCb, Buffer.alloc(0));
            },
            grabExternal: (id) => {
                let _grabCb = null;
                _grabCb = this.cameraScript.grabCb((fno, buffer, height, width, channel, user) => {
                    this._grabCbMap.set(id, _grabCb);
                    let bufferPtr = this.shmem.ptr2val(buffer);
                    worker_threads_1.parentPort.postMessage({ bufferPtr, id, height, width, channel });
                });
                this.cameraScript.grab_external(id, _grabCb, Buffer.alloc(0));
            },
            grabOnce: (id) => {
                let _grabCb = null;
                _grabCb = this.cameraScript.grabCb((fno, buffer, height, width, channel, user) => {
                    this._grabCbMap.set(id, _grabCb);
                    let bufferPtr = this.shmem.ptr2val(buffer);
                    worker_threads_1.parentPort.postMessage({ bufferPtr, id, height, width, channel });
                });
                this.cameraScript.grab_once(id, _grabCb, Buffer.alloc(0));
            },
            grabStop: (id) => {
                return this.cameraScript.grab_stop(id);
            },
            closeAll: async () => {
                return await this.cameraScript.close_all_cameras();
            }
        });
        this._grabCbMap = new Map();
    }
    test() {
        console.log('================================');
    }
}
module.exports = new CameraWorker();
//# sourceMappingURL=camera.worker.js.map