"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camera = void 0;
const ffi_napi_1 = require("ffi-napi");
const camera = (dllPath) => {
    const camera = new ffi_napi_1.Library(dllPath + 'camera', {
        get_dll_version: ['char *', []],
        get_date_time: ['void ', ['char *', 'char *']],
        get_time: ['int *', []],
        get_timestamp: ['int * ', ['bool']],
        init_camera: ['int ', ['string']],
        mock_camera: ['int ', ['string']],
        mock_camera_script: ['int ', ['char *']],
        camera_type: ['char *', ['int']],
        camera_model: ['char *', ['int']],
        camera_sn: ['char *', ['int']],
        camera_size: ['int', ['int', 'int *', 'int *', 'int *']],
        open_camera: ['int', ['int', 'int *']],
        close_camera: ['int', ['int', 'int *']],
        close_all_cameras: ['void', []],
        grab_once: ['int ', ['int', 'pointer', 'void *']],
        grab_internal: ['int', ['int', 'pointer', 'void *']],
        grab_external: ['int', ['int', 'pointer', 'void *']],
        grab_stop: ['int', ['int']],
        free_img: ['void', ['uchar*']],
        imwrite: ['bool', ['char *', 'uchar *', 'int', 'int', 'int']],
        imread: ['bool', ['char *', 'uchar *', 'int', 'int', 'int']],
    });
    camera.grabCb = (callback) => {
        const cb = (0, ffi_napi_1.Callback)('void', ['int *', 'uchar *', 'int', 'int', 'int', 'void *'], (...arg) => {
            callback(...arg);
        });
        return cb;
    };
    return camera;
};
exports.camera = camera;
//# sourceMappingURL=camera.js.map