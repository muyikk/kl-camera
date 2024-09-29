"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const poolifier_1 = require("poolifier");
let AppService = class AppService {
    constructor() {
        this.dllPath = __dirname.replace(/dist$/, 'dll\\');
        console.log(this.dllPath);
        this.pool = new poolifier_1.FixedThreadPool(1, __dirname + '/camera.worker.js', {
            messageHandler: ({ bufferPtr, id, height, width, channel }) => {
                console.log('out:', bufferPtr, id, height, width, channel);
                let sn = this.cameraList[id].sn;
                this.grabbedCb({ bufferPtr, sn, id, height, width, channel });
            }
        });
        this.pool.execute(this.dllPath, 'initPool');
    }
    async init(types) {
        return await this.pool.execute(types, 'init');
    }
    async mock(count, cameraPAthList) {
        const ids = [];
        for (let i = 0; i < count; i++) {
            let id = await this.pool.execute(cameraPAthList[0], 'mock');
            ids.push(id);
        }
        return ids;
    }
    getParams(id) {
        this.pool.execute(id, 'getParams').then(({ sn, model, type, width, height, channel }) => {
            this.cameraList[id].width = width;
            this.cameraList[id].height = height;
            this.cameraList[id].channel = channel;
            this.cameraList[id].sn = sn;
            this.cameraList[id].model = model;
            this.cameraList[id].type = type;
            console.log(this.cameraList[sn]);
            return this.cameraList[id];
        }).catch(err => {
            console.error(err);
        });
    }
    grabInternal(id) {
        this.pool.execute(id, 'grabInternal');
    }
    grabExternal(id) {
        this.pool.execute(id, 'grabExternal');
    }
    grabOnce(id) {
        this.pool.execute(id, 'grabOnce');
    }
    grabStop(id) {
        this.pool.execute(id, 'grabStop').then(() => {
            console.log('相机', this.cameraList[id].sn, '停止采集');
        });
    }
    grabbed(callback) {
        this.grabbedCb = callback;
    }
    getHello() {
        return "Hello";
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
//# sourceMappingURL=app.service.js.map