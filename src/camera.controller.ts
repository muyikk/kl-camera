import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { Camera } from './camera.service';
import HttpResponse from './interface'

@ApiTags('camera')
@Controller('camera')
export class CameraController {
  constructor(private cameraService: Camera) { }

  @Get("init/:types")
  @ApiOperation({
    summary: '创建真实相机',
    description: '创建真实相机',
  })
  @ApiParam({
    name: 'types',
    description: '相机类型',
    example: 'Hik',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: '返回值 0:成功 1:失败',
  })
  init(@Param("types") types: string): HttpResponse<Promise<Array<number>>> {
    return HttpResponse.ok(this.cameraService.init(types));
  };

  @Get("mock/:types")
  @ApiOperation({
    summary: '创建模拟相机',
    description: '创建模拟相机',
  })
  @ApiParam({
    name: 'types',
    description: '相机类型',
    example: '',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: '返回值 0:成功 1:失败',
  })
  mock(@Param("types") types: Array<string>): HttpResponse<Promise<Array<number>>> {
    return HttpResponse.ok(this.cameraService.mock(types));
  };

  @Get("findAll")
  @ApiOperation({
    summary: '获取相机列表',
    description: '获取相机列表',
  })
  @ApiResponse({
    status: 200,
    description: '返回值 0:成功 1:失败',
  })
  findAll(): HttpResponse<Array<Object>> {
    return HttpResponse.ok(this.cameraService.findAll());
  };

  @Get("subscribe/:shmemName")
  @ApiOperation({
    summary: '后端接受数据源订阅',
    description: '订阅名称 需与前端subscribe订阅时同名',
  })
  @ApiParam({
    name: 'shmemName',
    description: '订阅名称',
    example: '',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: '返回值 0:成功 1:失败',
  })
  subscribe(@Param("shmemName") shmemName: string): HttpResponse<Promise<boolean>> {
    return HttpResponse.ok(this.cameraService.subscribeBackend(shmemName));
  };


  @Get("grabInternal/:id")
  @ApiOperation({
    summary: '内触发采集',
    description: '内触发采集',
  })
  @ApiParam({
    name: 'id',
    description: '相机id',
    example: '0',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: '',
  })
  grabInternal(@Param("id") id: number): HttpResponse<void> {
    return HttpResponse.ok(this.cameraService.grabInternal(id));
  };

  @Get("grabExternal/:id")
  @ApiOperation({
    summary: '外触发采集',
    description: '外触发采集',
  })
  @ApiParam({
    name: 'id',
    description: '相机id',
    example: '0',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: '',
  })
  grabExternal(@Param("id") id: number): HttpResponse<void> {
    return HttpResponse.ok(this.cameraService.grabExternal(id));
  };

  @Post("exMockTrigger")
  @ApiOperation({
    summary: '模拟相机外触发触发器',
    description: '模拟相机外触发触发器',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          example: '-1',
          description: '相机id',
        },
        interval: {
          type: 'number',
          example: '500',
          description: '出图间隔'
        },
        times: {
          type: 'number',
          example: '4',
          description: '出图数量'
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '',
  })
  exMockTrigger(@Body() body: {id: number, interval: number, times: number}): HttpResponse<void> {
    return HttpResponse.ok(this.cameraService.exMockTrigger(body.id, body.interval, body.times));
  };

  @Get("grabOnce/:id")
  @ApiOperation({
    summary: '单次采集',
    description: '单次采集',
  })
  @ApiParam({
    name: 'id',
    description: '相机id',
    example: '0',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: '',
  })
  grabOnce(@Param("id") id: number): HttpResponse<void> {
    return HttpResponse.ok(this.cameraService.grabOnce(id));
  };

  @Get("grabStop/:id")
  @ApiOperation({
    summary: '相机停止触发采图',
    description: '相机停止触发采图',
  })
  @ApiParam({
    name: 'id',
    description: '相机id',
    example: '0',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: '',
  })
  grabStop(@Param("id") id: number): HttpResponse<void> {
    return HttpResponse.ok(this.cameraService.grabStop(id));
  };

  @Post("setExposureTime")
  @ApiOperation({
    summary: '相机设置曝光',
    description: '相机设置曝光',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          example: '0',
          description: '相机id',
        },
        expTime: {
          type: 'number',
          example: '50',
          description: '曝光时间'
        }
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '',
  })
  setExposureTime(@Body() body: { id: number, expTime: number }): HttpResponse<Promise<boolean>> {
    return HttpResponse.ok(this.cameraService.setExposureTime(body.id, body.expTime));
  };

  @Get("getExposureTime/:id")
  @ApiOperation({
    summary: '相机获取曝光',
    description: '相机获取曝光',
  })
  @ApiParam({
    name: 'id',
    description: '相机id',
    example: '0',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: '',
  })
  getExposureTime(@Param("id") id: number): HttpResponse<Promise<number | boolean>> {
    return HttpResponse.ok(this.cameraService.getExposureTime(id));
  };
  @Post("undistort")
  @ApiOperation({
    summary: '相机设置畸变参数',
    description: '相机设置畸变参数',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          example: '0',
          description: '相机id',
        },
        undistortParams: {
          type: 'number',
          example: null,
          description: '畸变参数',
        }
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '',
  })
  undistort(@Body() body: { id: number, undistortParams: Array<number> }): HttpResponse<Promise<boolean>> {
    return HttpResponse.ok(this.cameraService.undistort(body.id, body.undistortParams));
  };


}
