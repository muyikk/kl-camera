import { FixedThreadPool } from 'poolifier';
export declare class AppService {
    pool: FixedThreadPool;
    cameraList: Object;
    dllPath: string;
    grabbedCb: any;
    constructor();
    init(types: string): Promise<unknown>;
    mock(count: number, cameraPAthList: Array<string>): Promise<number[]>;
    getParams(id: number): void;
    grabInternal(id: number): void;
    grabExternal(id: number): void;
    grabOnce(id: number): void;
    grabStop(id: number): any;
    grabbed(callback: any): void;
    getHello(): string;
}
