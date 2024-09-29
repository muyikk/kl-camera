"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shmem = void 0;
const ffi_napi_1 = require("ffi-napi");
const shmem = (dllPath) => {
    const ogCommon = new ffi_napi_1.Library(dllPath + 'og-common', {
        shmalloc: ['uchar *', ['char *', 'uint64', 'uint64 *']],
        ref: ['uchar *', ['string', 'uint64 *']],
        unref: ['void', ['uchar *', 'uint64 *']],
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
        imread: ['bool', ['string', 'uchar *', 'int', 'int', 'int', 'bool']],
        imwrite: ['void', ['string', 'uchar *', 'int', 'int', 'int', 'bool']],
        imwrite_async: ['void', ['string', 'uchar *', 'int', 'int', 'int', 'bool']],
        resize: [
            'void',
            ['char*', 'int', 'int', 'char*', 'int', 'int', 'int', 'int'],
        ],
        rotate: ['bool', ['char *', 'int', 'int', 'int', 'int']],
        flip: ['bool', ['char *', 'int', 'int', 'int', 'int']],
        rgb2gray: ['void', ['uchar *', 'int', 'int', 'uchar*']],
        bgr2gray: ['void', ['uchar *', 'int', 'int', 'uchar*']],
        drawRectangle: [
            'void',
            ['uchar *', 'int', 'int', 'int', 'int *', 'int *', 'int'],
        ],
    });
    const shmem = new ffi_napi_1.Library(dllPath + 'shmem', {
        ptr2val: ['uint64', ['uchar *']],
        val2ptr: ['uchar *', ['uint64']],
        gray2rgb: ['bool ', ['uchar *', 'uchar *', 'int', 'int']],
        crop: [
            'void',
            ['uchar *', 'int', 'int', 'int', 'int', 'uchar *', 'int', 'int', 'int'],
        ],
        paste: [
            'bool',
            ['uchar *', 'int', 'int', 'int', 'int', 'uchar *', 'int', 'int', 'int'],
        ],
    });
    Object.assign(shmem, ogCommon);
    return shmem;
};
exports.shmem = shmem;
//# sourceMappingURL=shmem.js.map