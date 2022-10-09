import BaseCanvasWebgl from './BaseCanvasWebgl.js';
import Cube from './Cube.js';
import * as tools from './tools.js';
import { Matrix4, Vector4 } from '../libs/cuon-matrix.js';

// 魔方方向：上 下 左 右 前 后
// 魔方颜色：黄 白 红 橙 绿 蓝
const CUBE_COLORS = {
  top: [1, 1, 0],
  bottom: [1, 1, 1],
  left: [1, 0, 0],
  right: [1, 0.6, 0],
  front: [0, 1, 0],
  back: [0, 0, 1],
}

// 面 => 法向量 map
const FACE_NORMAL = new Map([
  [1, BaseCanvasWebgl.Z_DIR],
  [2, BaseCanvasWebgl.X_DIR],
  [3, BaseCanvasWebgl.Y_DIR],
  [4, BaseCanvasWebgl.X_DIR_REVERSE],
  [5, BaseCanvasWebgl.Y_DIR_REVERSE],
  [6, BaseCanvasWebgl.Z_DIR_REVERSE],
]);

// 法向量 => 面 map
const NORMAL_FACE = new Map();
for (let [key, val] of FACE_NORMAL.entries()) {
  NORMAL_FACE.set(val.join(','), key);
}

// 每个面旋转的状态转移
// const statesX = new tools.DoubleCircularLinkedList([1, 5, 6, 3]);
// const statesY = new tools.DoubleCircularLinkedList([1, 2, 6, 4]);
// const statesZ = new tools.DoubleCircularLinkedList([2, 5, 4, 3]);
// const STATES = [statesX, statesY, statesZ];
export default class MagicCube extends BaseCanvasWebgl {
  #vSource = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    attribute float a_Face; // 表面编号
    attribute float a_Id; // 立方体编号
    attribute vec4 a_Normal; // 表面法向量
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_NormalMatrix; // 法向量变换矩阵
    varying vec4 v_Color;
    varying float v_Face;
    varying float v_Id;
    varying vec3 v_Normal;
    varying vec3 v_Position;
    void main() {
      gl_Position = u_ViewMatrix * u_ModelMatrix * a_Position;
      v_Color = a_Color;
      v_Face = a_Face;
      v_Id = a_Id;
      v_Normal = normalize(vec3(u_NormalMatrix * a_Normal)); // 法向量归一化
      v_Position = vec3(u_ModelMatrix * a_Position); // 计算顶点的世界坐标
    }
  `;
  #fSource = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    uniform bool u_IsJudging; // 是否处于判断选中面的模式
    uniform int u_PickedFace; // 被选中的表面编号
    uniform int u_PickedCube; // 被选中的立方体编号
    uniform vec3 u_AmbientLightColor; // 环境光颜色
    uniform vec3 u_LightColor; // 光线颜色
    uniform vec3 u_LightPosition; // 光源位置
    uniform vec2 u_LightRange; // 光源光照的范围
    varying vec4 v_Color;
    varying float v_Face;
    varying float v_Id;
    varying vec3 v_Normal;
    varying vec3 v_Position;
    void main() {
      if(u_IsJudging) {
        gl_FragColor = vec4(v_Id / 255.0, 0.0, v_Face / 255.0, 1.0); // 判断时，选中面设置为不同颜色分量
      } else {
        vec3 normal = normalize(v_Normal); // 法向量归一化，防止内插后不为 1.0
        vec3 lightDirection = normalize(u_LightPosition - v_Position); // 计算光线方向并归一化
        // 计算当前片元与光源的距离按比例的光强衰减
        float lpd = distance(v_Position, u_LightPosition);
        float decay = 1.0 - clamp((lpd - u_LightRange.x) / (u_LightRange.y - u_LightRange.x), 0.0, 1.0);
        float nDotL = max(dot(lightDirection, normal), 0.0); // 光线方向和顶点法向量的点积
        vec3 diffuse = u_LightColor * v_Color.rgb * nDotL; // 计算反射光
        vec3 ambient = u_AmbientLightColor * v_Color.rgb; // 计算环境光
        vec4 lightColor = vec4((diffuse + ambient) * decay, v_Color.a); // 计算整体光照效果
        vec4 color = v_Color * lightColor;
        if(u_PickedFace > 0 && u_PickedFace == int(v_Face) && u_PickedCube == int(v_Id)) {
          color *= vec4(vec3(0.5), 1.0);
        }
        gl_FragColor = color;
      }
    }
  `;
  constructor(canvas, params, order) {
    super(canvas, params);
    // 创建 program
    this.programs.set(
      'cube',
      tools.createProgram(this.gl, this.#vSource, this.#fSource)
    );
    // 设置当前的 program
    this.useProgram(this.programs.get('cube'));
    this.locs = tools.getLocations(this.gl, this.currentProgram, {
      attrs: [
        'a_Position',
        'a_Color',
        'a_Face',
        'a_Id',
        'a_Normal',
      ],
      unifs: [
        'u_ModelMatrix',
        'u_ViewMatrix',
        'u_IsJudging',
        'u_PickedFace',
        'u_PickedCube',
        'u_AmbientLightColor',
        'u_LightColor',
        'u_LightPosition',
        'u_NormalMatrix',
        'u_LightRange',
      ],
    });
    this.cubePositionIdMap = new Map(); // 立方体位置 => id
    this.cubeIdPositionMap = new Map(); // 立方体 id => 位置
    this.currentPlainCubeIds = new Set(); // 当前旋转的立方体 id 列表
    this.commonCube = new Cube(this.gl, {
      defaultColor: Array(3).fill(0.15),
    }, {
      verticeFlag: false,
      colorFlag: false,
      defaultColorFlag: true,
      indexFlag: true,
      textureFlag: false,
      normalFlag: true,
      faceFlag: true,
      borderColorFlag: true,
      borderIndexFlag: true,
    });
    this.cubes = this.createCubes(order);
    this.resetData();
  }

  // 重置数据
  resetData() {
    this.history = []; // 清除历史
    // 当前朝向的每个面的 id
    this.currentFaces = {
      F: 1, R: 2, U: 3,
    };

    // 当前的旋转轴方向
    this.currentDirs = {
      x: BaseCanvasWebgl.X_DIR,
      y: BaseCanvasWebgl.Y_DIR,
      z: BaseCanvasWebgl.Z_DIR_REVERSE,
    };

    // 当前状态
    this._states = {
      animating: false, // 播放动画中
      recoverying: false, // 恢复历史中
      playing: false, // 播放一组旋转中
      totalRotatePlainDeg: null, // 当前旋转面当次总的旋转角度
      currentRotatePlainDir: null, // 当前旋转面的旋转轴
      relativeRotateX: null, // 相对旋转绕 x 轴的角度分量
      relativeRotateY: null, // 相对旋转绕 y 轴的角度分量
      rotateBackRate: null, // 旋转回之前的朝向的比率值
      willRotatePlains: null, // 选中的方块可能将要旋转的平面
      currentFace: null, // 选中的当前的实践面
      diffRotateDeg: null, // 一次旋转中累计的旋转角度
      rotatePlainEndDeg: null, // 旋转结束的角度
    }

    this.init();
  }

  // 获取历史
  getHistory() {
    return this.history;
  }

  // 新增历史
  pushHistory(state) {
    // 去除冗余的操作
    let pushFlag = true;
    if (this.history.length) {
      const last = this.history[this.history.length - 1];
      if (
        state.type === last.type &&
        state.axis === last.axis &&
        state.index === last.index &&
        state.reverse === !last.reverse
      ) {
        // 合并去除两次反向操作
        pushFlag = false;
        this.history.pop();

      } else if (this.history.length >= 3) {
        // 合并去除四次同向操作
        pushFlag = false;
        for (let i = this.history.length - 1; i >= this.history.length - 3; i--) {
          if (!(this.history[i].type === state.type &&
            this.history[i].axis === state.axis &&
            this.history[i].index === state.index &&
            this.history[i].reverse === state.reverse
          )) {
            pushFlag = true;
            break;
          }
        }
        if (!pushFlag) {
          this.history.splice(this.history.length - 3, 3);
        }
      }
    }

    if (pushFlag) {
      this.history.push(state);
    }
  }

  // 阶数变换
  changeOrder(order, size) {
    if (this._states.animating || order < 2 || order > 6) return;
    this.resetData();
    this.initMatrixs();
    this.cubes = this.createCubes(order, size);
    this.draw();
  }

  // 开始 webgl 的部分功能特性
  // @override
  enableFuncs() {
    this.gl.enable(this.gl.DEPTH_TEST); // 开启隐面消除
    this.gl.enable(this.gl.CULL_FACE); // 开启背面隐藏
    this.gl.enable(this.gl.POLYGON_OFFSET_FILL);
    // this.gl.enable(this.gl.BLEND); // 开启混合模式
    // this.gl.blendFunc(this.gl.SRC_COLOR, this.gl.ZERO); // 混合函数
  }

  draw(selectDraw = false) {
    this.clear();

    // 绘制所有立方体
    for (let { cube, matrix } of this.cubes.values()) {
      this.setModelMatrix(matrix); // 计算模型矩阵

      // 绑定索引
      tools.useArrayBuffer(this.gl, this.locs.attrs.a_Id, cube.buffers.idBuffer);
      tools.useElementBuffer(this.gl, this.commonCube.buffers.indexBuffer);

      // 绘制立方体底色面
      tools.useArrayBuffer(this.gl, this.locs.attrs.a_Position, cube.buffers.verticeBuffer);
      tools.useArrayBuffer(this.gl, this.locs.attrs.a_Color, this.commonCube.buffers.defaultColorBuffer);
      this.gl.polygonOffset(1, 1);
      this.gl.drawElements(this.gl.TRIANGLES, this.commonCube.count, this.commonCube.buffers.indexBuffer.type, 0);

      if (!selectDraw) {
        // 绘制立方体彩色面
        tools.useArrayBuffer(this.gl, this.locs.attrs.a_Position, cube.buffers.paddingVerticeBuffer);
        tools.useArrayBuffer(this.gl, this.locs.attrs.a_Color, cube.buffers.colorBuffer);
        this.gl.polygonOffset(0, 0);
        this.gl.drawElements(this.gl.TRIANGLES, this.commonCube.count, this.commonCube.buffers.indexBuffer.type, 0);
        // 绘制立方体边框
        tools.useArrayBuffer(this.gl, this.locs.attrs.a_Position, cube.buffers.verticeBuffer);
        tools.useArrayBuffer(this.gl, this.locs.attrs.a_Color, this.commonCube.buffers.borderColorBuffer);
        tools.useElementBuffer(this.gl, this.commonCube.buffers.borderIndexBuffer);
        this.gl.drawElements(this.gl.LINES, this.commonCube.borderCount, this.commonCube.buffers.borderIndexBuffer.type, 0);
      }
    }
  }

  // 判断是否选中，并高亮选中面
  select(offsetX, offsetY) {
    if (this._states.animating) {
      return;
    }
    let selected = false;

    this.gl.uniform1i(this.locs.unifs.u_IsJudging, true);
    this.draw(true);

    const pickColor = new Uint8Array(4);
    const x = offsetX;
    const y = this.height - offsetY;
    this.gl.readPixels(x, y, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pickColor);
    if (pickColor[2] > 0) {
      selected = true;
      this.gl.uniform1i(this.locs.unifs.u_PickedFace, pickColor[2]);
      this.gl.uniform1i(this.locs.unifs.u_PickedCube, pickColor[0]);
      this.setRotatePlain(pickColor[0], pickColor[2]);
    }

    this.gl.uniform1i(this.locs.unifs.u_IsJudging, false);
    this.draw();

    return selected;
  }

  // 释放选中状态
  unselect() {
    this.gl.uniform1i(this.locs.unifs.u_PickedFace, 0);
    this.draw();
  }

  // 缩放
  scaleBy(k) {
    if (Math.min.apply(null, this.modelParams.scale) + k < 0.2) return; // 限制最小缩放比例
    if (Math.max.apply(null, this.modelParams.scale) + k > 2) return; // 限制最大缩放比例
    this.modelParams.scale = this.modelParams.scale.map(it => it += k);
    this.draw();
  }

  // 整体绕轴旋转 90 度
  rotateWhole(axis, reverse) {
    if (this._states.animating || ![0, 1, 2].includes(axis)) return;

    return new Promise((resolve, reject) => {
      this._states.animating = true;
      const dir = [this.currentDirs.x, this.currentDirs.y, this.currentDirs.z][axis];
      this.animateRotateWhole(0, 90, reverse, dir, axis, resolve);
      if (!this._states.recoverying) {
        this.pushHistory({
          type: 'total',
          axis,
          reverse,
        });
      }
    });
  }

  // 整体旋转动画
  animateRotateWhole(curDeg, tolDeg, reverse, dir, axis, cb) {
    const rk = reverse ? -1 : 1; // 是否反向
    // 临时的旋转矩阵
    if (!this.tempRotateMatrix) this.tempRotateMatrix = new Matrix4();
    this.tempRotateMatrix.set(this.modelRotateMatrix).rotate(curDeg * rk, ...dir);

    this.draw();

    if (curDeg === tolDeg) {
      // 结束旋转动画
      this.modelRotateMatrix.set(this.tempRotateMatrix);
      const mat = new Matrix4(this.modelRotateMatrix).invert();
      this.currentDirs.x = [...mat.multiplyVector4(new Vector4(BaseCanvasWebgl.X_DIR)).round().elements];
      this.currentDirs.y = [...mat.multiplyVector4(new Vector4(BaseCanvasWebgl.Y_DIR)).round().elements];
      this.currentDirs.z = [...mat.multiplyVector4(new Vector4(BaseCanvasWebgl.Z_DIR_REVERSE)).round().elements];
      this.tempRotateMatrix = null;
      this._states.animating = false;

      // 坐标变换
      this._states.totalRotatePlainDeg = 90 * rk;
      this._states.currentRotatePlainDir = dir;
      this.rotatePlainPosition([...this.cubePositionIdMap.values()], false);

      // 朝向面变更，F:z, R:x, U:y
      for (let key in this.currentFaces) {
        const normal = FACE_NORMAL.get(key === 'F' ? 1 : key === 'R' ? 2 : 3);
        const currentNormal = mat.multiplyVector4(new Vector4(normal)).round().elements;
        const currentFace = NORMAL_FACE.get(currentNormal.join(','));
        this.currentFaces[key] = currentFace;
      }
      cb();
      return;
    }

    // 继续动画
    let nexDeg = (tolDeg - curDeg) * this.animateParams.wholeRotateSpeed + curDeg; // 下一次的旋转角度
    nexDeg = Math.abs(nexDeg - tolDeg) < 1 ? tolDeg : nexDeg;
    return requestAnimationFrame(() => this.animateRotateWhole.call(this, nexDeg, tolDeg, reverse, dir, axis, cb));
  }

  // 旋转，相对角度
  rotate(xdeg, ydeg) {
    if (!this.tempRotateMatrix) {
      this.tempRotateMatrix = new Matrix4(this.modelRotateMatrix);
    } else {
      this.tempRotateMatrix.set(this.modelRotateMatrix);
    }

    this._states.relativeRotateX = ydeg;
    this._states.relativeRotateY = xdeg;
    this.tempRotateMatrix.rotate(ydeg, ...this.currentDirs.x); // 绕 x 轴旋转
    this.tempRotateMatrix.rotate(xdeg, ...this.currentDirs.y); // 绕 y 轴旋转

    this.throttleDraw();
  }

  // 结束旋转
  rotateEnd() {
    if (!this.tempRotateMatrix) return;

    this.modelRotateMatrix.set(this.tempRotateMatrix);
    this.tempRotateMatrix = null;

    this.tempMatrix.set(this.modelRotateMatrix).invert(); // 计算旋转矩阵的逆矩阵
    const xdir = this.tempMatrix.multiplyVector4(new Vector4(BaseCanvasWebgl.X_DIR));
    const ydir = this.tempMatrix.multiplyVector4(new Vector4(BaseCanvasWebgl.Y_DIR));
    const zdir = this.tempMatrix.multiplyVector4(new Vector4(BaseCanvasWebgl.Z_DIR));
    this.currentDirs.x = [...xdir.elements];
    this.currentDirs.y = [...ydir.elements];
    this.currentDirs.z = [...zdir.elements];

    this.draw();
  }

  // 旋转回
  rotateBack() {
    if (!this._states.rotateBackRate) {
      this._states.rotateBackRate = 1;
    }
    let dx = this._states.relativeRotateX * this._states.rotateBackRate;
    let dy = this._states.relativeRotateY * this._states.rotateBackRate;
    this._states.rotateBackRate *= (1 - this.animateParams.backSpeed);

    const stopFlag = Math.max(Math.abs(dx), Math.abs(dy)) < 1;
    dx = stopFlag ? 0 : dx;
    dy = stopFlag ? 0 : dy;

    if (!this.tempRotateMatrix) {
      this.tempRotateMatrix = new Matrix4();
    }
    this.tempRotateMatrix.set(this.modelRotateMatrix);
    this.tempRotateMatrix.rotate(dx, ...this.currentDirs.x); // 绕 x 轴旋转
    this.tempRotateMatrix.rotate(dy, ...this.currentDirs.y); // 绕 y 轴旋转
    this.draw();

    if (stopFlag) {
      this._states.rotateBackRate = 0;
      this.tempRotateMatrix = null;
      return;
    };
    requestAnimationFrame(this.rotateBack.bind(this));
  }

  // 命令式地旋转平面
  rotatePlainCommand(axis, index, reverse) {
    if (this._states.animating) return;
    return new Promise((resolve, reject) => {
      const position = Array(3).fill(this.positionRange[1]);
      position[axis] -= index; // 计算虚拟点击方块的位置

      // 计算当前旋转面的方块坐标集合
      this.currentPlainCubeIds.clear();
      for (let i = this.positionRange[0]; i <= this.positionRange[1]; i++) {
        const pp = [];
        pp[axis] = position[axis];

        if (pp[0] === undefined) {
          pp[0] = i;
        } else if (pp[1] === undefined) {
          pp[1] = i;
        } else if (pp[2] === undefined) {
          pp[2] = i;
        }
        for (let j = this.positionRange[0]; j <= this.positionRange[1]; j++) {
          const ppp = [...pp];
          if (ppp[0] === undefined) {
            ppp[0] = j;
          } else if (ppp[1] === undefined) {
            ppp[1] = j;
          } else if (ppp[2] === undefined) {
            ppp[2] = j;
          }
          this.currentPlainCubeIds.add(this.cubePositionIdMap.get(ppp.join(',')));
        }
      }
      // 设置旋转方向
      switch (axis) {
        case 0: this._states.currentRotatePlainDir = this.currentDirs.x; break;
        case 1: this._states.currentRotatePlainDir = this.currentDirs.y; break;
        case 2: this._states.currentRotatePlainDir = this.currentDirs.z; break;
        default: break;
      }
      const dDeg = 90 * (reverse ? 1 : -1);
      this._states.totalRotatePlainDeg = dDeg;
      this.rotatePlainTo(dDeg, () => {
        resolve();
      });
    });
  }

  // 播放一组平面旋转
  async playGroupRotates(list) {
    this._states.playing = true;
    for await (let { type, axis, index, reverse } of list) {
      if (type === 'plain') {
        await this.rotatePlainCommand(axis, index, reverse);
      } else if (type === 'total') {
        await this.rotateWhole(axis, reverse);
      }
    }
    this._states.playing = false;
  }

  // 随机播放
  async randomRotatePlains(count) {
    if (this._states.animating) return;

    const list = [];
    for (let i = 0; i < count; i++) {
      const type = Math.random() < 0.9 ? 'plain' : 'total';
      if (type === 'plain') {
        list.push({
          type,
          axis: Math.floor(Math.random() * 3),
          index: Math.floor(Math.random() * this.order),
          reverse: !!Math.floor(Math.random() * 2),
        });
      } else if (type === 'total') {
        list.push({
          type,
          axis: Math.floor(Math.random() * 3),
          reverse: !!Math.floor(Math.random() * 2),
        });
      }
    }
    this.playGroupRotates(list);
  }

  // 还原魔方，历史数组
  async recovery(counts = Infinity) {
    if (this._states.animating) return;

    this._states.recoverying = true; // 恢复历史中
    while (this.history.length && (counts--) > 0) {
      const state = this.history.pop();
      if (state.type === 'plain') {
        const { axis, index, reverse } = state;
        await this.rotatePlainCommand(axis, index, !reverse);
      } else if (state.type === 'total') {
        const { axis, reverse } = state;
        await this.rotateWhole(axis, !reverse);
      }
    }
    this._states.recoverying = false; // 恢复历史完成
  }

  // 判断要旋转的平面
  setRotatePlain(cubeId, face) {
    // 获取点击的方块当前坐标
    const position = this.cubeIdPositionMap.get(cubeId).split(',');
    // 获取以该点为中心的三个平面的坐标集合
    const plains = [];
    position.forEach((pos, ind) => {
      const plain = [];
      for (let i = this.positionRange[0]; i <= this.positionRange[1]; i++) {
        const pp = [];
        pp[ind] = pos;

        if (pp[0] === undefined) {
          pp[0] = i;
        } else if (pp[1] === undefined) {
          pp[1] = i;
        } else if (pp[2] === undefined) {
          pp[2] = i;
        }
        for (let j = this.positionRange[0]; j <= this.positionRange[1]; j++) {
          const ppp = [...pp];
          if (ppp[0] === undefined) {
            ppp[0] = j;
          } else if (ppp[1] === undefined) {
            ppp[1] = j;
          } else if (ppp[2] === undefined) {
            ppp[2] = j;
          }
          plain.push(ppp.join(','));
        }
      }
      plains.push(plain);
    });

    this.currentPlainCubeIds.clear();
    this._states.willRotatePlains = plains; // 保存可能旋转的平面

    const tcube = this.cubes.get(cubeId);
    const currentFaceNormal = tcube.matrix.multiplyVector4(new Vector4(FACE_NORMAL.get(face))).elements; // 旋转过后的面法向量
    const currentFace = NORMAL_FACE.get(currentFaceNormal.join(','));
    this._states.currentFace = currentFace;

    // console.log('*'.repeat(40));
    // console.log('position: ', this.cubeIdPositionMap.get(cubeId));
    // console.log('selected: ', cubeId, face);
    // console.log('face: ', face, 'currentFace', currentFace);
  }

  // 旋转平面
  rotatePlain(dx, dy) {
    if (this._states.animating) return; // 等待动画播放

    // 判断旋转的面
    if (this._states.willRotatePlains && !this.currentPlainCubeIds.size) {
      let dir = null;
      if (Math.abs(dx) >= Math.abs(dy)) {
        this._states.currentRotatePlainDir = this.currentDirs.y;
        dir = 1;
      } else {
        if (this._states.currentFace === this.currentFaces.F) {
          // 正面
          this._states.currentRotatePlainDir = this.currentDirs.x;
          dir = 0;
        } else if (this._states.currentFace === this.currentFaces.R) {
          // 右面
          this._states.currentRotatePlainDir = this.currentDirs.z;
          dir = 2;
        }
      }
      if (dir === null) return;
      this._states.willRotatePlains[dir].forEach(p => {
        this.currentPlainCubeIds.add(this.cubePositionIdMap.get(p));
      });
    }

    const dDeg = this._states.currentRotatePlainDir.toString() === this.currentDirs.y.toString() ? dx : -dy; // 转动角度
    // 一次旋转中累计偏转角度
    if (this._states.diffRotateDeg === undefined || this._states.diffRotateDeg === null) {
      this._states.diffRotateDeg = 0;
    }
    this._states.diffRotateDeg += dDeg;

    // 设置自身旋转矩阵
    for (let id of this.currentPlainCubeIds) {
      const cube = this.cubes.get(id);
      cube.matrix.rotate(dDeg, ...cube.dirMatrix.multiplyVector4(new Vector4(this._states.currentRotatePlainDir)).elements);
    }
    this.throttleDraw();
  }

  // 旋转平面结束
  rotatePlainEnd() {
    if (!this._states.diffRotateDeg) return;

    const reset = this._states.diffRotateDeg % 90;
    const resetDeg1 = reset >= 0 ? reset : reset + 90; // 需要多转动的角度，原方向逆向
    const resetDeg2 = 90 - resetDeg1; // 需要多转动的角度，原方向正向
    const deg = resetDeg1 >= resetDeg2 ? resetDeg2 : -resetDeg1; // 转到正 90 度需要多偏移的角度
    // 旋转至
    this._states.totalRotatePlainDeg = Math.round(this._states.diffRotateDeg + deg);
    this.rotatePlainTo(deg);
    this._states.diffRotateDeg = null;
  }

  // 旋转平面至
  rotatePlainTo(deg, cb) {
    if (this._states.animating && Math.abs(this._states.rotatePlainEndDeg) <= 0.2) {
      // 结束动画
      const ddeg = this._states.rotatePlainEndDeg;
      for (let id of this.currentPlainCubeIds) {
        const cube = this.cubes.get(id);
        cube.matrix.rotate(
          ddeg,
          ...cube.dirMatrix.multiplyVector4(new Vector4(this._states.currentRotatePlainDir)).elements,
        ).round();
      }
      this.draw();

      if (!this._states.recoverying) {
        // 加入历史
        const axis = this._states.currentRotatePlainDir.toString() === this.currentDirs.x.toString() ? 0 :
          this._states.currentRotatePlainDir.toString() === this.currentDirs.y.toString() ? 1 : 2; // 旋转轴
        const count = Math.abs(Math.round(this._states.totalRotatePlainDeg / 90)); // 每 90deg 为一次旋转历史
        const cubeId = this.currentPlainCubeIds.values().next().value;
        const index = this.positionRange[1] - +this.cubeIdPositionMap.get(cubeId).split(',')[axis]; // 面的 index
        for (let i = 0; i < count; i++) {
          this.pushHistory({
            type: 'plain',
            axis,
            index,
            reverse: this._states.totalRotatePlainDeg > 0,
          });
        }
      }

      this._states.animating = false;
      this._states.willRotatePlains = null;
      this.rotatePlainPosition(this.currentPlainCubeIds); // 旋转平面坐标
      this.currentPlainCubeIds.clear();
      this.doIfOrderly(); // 检测是否完成
      cb && cb(); // 回调
      return;
    }
    if (!this._states.animating) {
      this._states.animating = true;
      this._states.rotatePlainEndDeg = deg;
    }
    const ddeg = this._states.rotatePlainEndDeg *
      (this._states.recoverying ? this.animateParams.recoverySpeed :
        this._states.playing ? this.animateParams.playSpeed : this.animateParams.speed);
    this._states.rotatePlainEndDeg -= ddeg;

    for (let id of this.currentPlainCubeIds) {
      const cube = this.cubes.get(id);
      cube.matrix.rotate(
        ddeg,
        ...cube.dirMatrix.multiplyVector4(new Vector4(this._states.currentRotatePlainDir)).elements,
      );
    }
    this.draw();

    requestAnimationFrame(() => this.rotatePlainTo(null, cb));
  }

  // 旋转平面坐标
  rotatePlainPosition(ids, changeDir = true) {
    if (this._states.totalRotatePlainDeg === 0) return;

    const c0 = (this.positionRange[1] + this.positionRange[0]) / 2;
    const [xIndex, yIndex] =
      this._states.currentRotatePlainDir.toString() === this.currentDirs.y.toString() ? [0, 2] :
        this._states.currentRotatePlainDir.toString() === this.currentDirs.x.toString() ? [2, 1] : [0, 1];
    const td = -this._states.totalRotatePlainDeg / 180 * Math.PI;
    for (let id of ids) {
      const pos = this.cubeIdPositionMap.get(id).split(','); // 根据 id 获取位置
      const x = pos[xIndex];
      const y = pos[yIndex];
      const x1 = Math.round((x - c0) * Math.cos(td) - (y - c0) * Math.sin(td) + c0);
      const y1 = Math.round((x - c0) * Math.sin(td) + (y - c0) * Math.cos(td) + c0);
      pos[xIndex] = x1;
      pos[yIndex] = y1;
      // 旋转后的坐标
      const posString = pos.join(',');
      this.cubePositionIdMap.set(posString, id);
      this.cubeIdPositionMap.set(id, posString);

      if (changeDir) {
        // 设置旋转后的旋转轴旋转矩阵
        this.cubes.get(id).dirMatrix.rotate(-this._states.totalRotatePlainDeg, ...this._states.currentRotatePlainDir).round();
      }
    }
  }

  // 创建立方体
  createCubes(order = 3, size = 1, { gap = 0, padding = size * 0.05 } = {}) {
    if (order < 2 || order > 6) return;
    this.cubePositionIdMap.clear();
    this.cubeIdPositionMap.clear();
    const cubes = new Map();
    const { left, right, top, bottom, front, back } = CUBE_COLORS;
    const half = Math.floor(order / 2); // 阶数的一半
    const start = -half, end = order - half - 1;
    const isOdd = (order % 2 === 1); // 是否是奇数阶，若为偶数阶，则 >= 0 的正方向偏移，< 0 的负方向偏移
    const stepOffset = isOdd ? 0 : (size / 2 + gap / 2); // 偶数阶数需要额外的位移量
    const dd = (k) => {
      let offset = stepOffset;

      if (!isOdd && k < 0) {
        k += 1;
        offset *= -1;
      }
      return k * size + k * gap + offset;
    };
    this.order = order; // 设置魔方阶数
    this.positionRange = [start, end]; // 坐标范围

    let dx = 0, dy = 0, dz = 0; // 偏移量
    let id = 1; // 立方体 id
    for (let k = start; k <= end; k++) {
      // y 轴
      dy = dd(k);

      for (let j = start; j <= end; j++) {
        // z 轴
        dz = dd(j);

        for (let i = start; i <= end; i++) {
          // x 轴
          dx = dd(i);

          const colorObj = {};
          const faces = new Set(); // 顺序：1前、2右、3上、4左、5下、6后
          if (k === start) { colorObj.bottom = bottom; faces.add(5); }
          if (k === end) { colorObj.top = top; faces.add(3); }
          if (i === start) { colorObj.left = left; faces.add(4); }
          if (i === end) { colorObj.right = right; faces.add(2); }
          if (j === start) { colorObj.back = back; faces.add(6); }
          if (j === end) { colorObj.front = front; faces.add(1); }
          const location = [i, k, j];
          cubes.set(id, {
            cube: new Cube(this.gl, {
              size: size,
              offset: [dx, dy, dz],
              colors: colorObj,
              padding: padding,
              id,
            }, {
              verticeFlag: true,
              colorFlag: true,
              paddingVerticeFlag: true,
              idFlag: true,
            }),
            id,
            matrix: new Matrix4(), // 自身的旋转矩阵
            dirMatrix: new Matrix4(), // 旋转轴的变换矩阵
            faces, // 当前方块占据的面
          });
          const pos = location.join(',');
          this.cubePositionIdMap.set(pos, id);
          this.cubeIdPositionMap.set(id, pos);
          id++;
        }
      }
    }

    return cubes;
  }

  // 判断魔方是否还原状态
  isOrderly() {
    let intersection = null; // 交集
    const [start, end] = this.positionRange;
    // 循环判断六个面
    for (let i = 0; i < 3; i++) {
      const ind0 = i;
      let ind1, ind2;
      if (i === 0) { ind1 = 1; ind2 = 2; }
      if (i === 1) { ind1 = 0; ind2 = 2; }
      if (i === 2) { ind1 = 0; ind2 = 1; }

      for (let j = 0; j < 2; j++) {
        const lockedPlain = this.positionRange[j]; // 锁定的分量坐标的值

        // 每个平面
        for (let pi = start; pi <= end; pi++) {
          for (let pj = start; pj <= end; pj++) {
            const pos = [];
            pos[ind0] = lockedPlain;
            pos[ind1] = pi;
            pos[ind2] = pj;
            const cube = this.cubes.get(this.cubePositionIdMap.get(pos.join(',')));

            // 取交集
            if (pi === start && pj === start) {
              intersection = new Set(cube.faces);
            } else {
              intersection = new Set([...intersection].filter(x => cube.faces.has(x)));
            }
            if (!intersection.size) return false;
          }
        }
      }
    }
    return true;
  }

  // 完成后回调
  doIfOrderly() {
    if (this.isOrderly()) {
      // 清除旋转的历史
      this.history = this.history.filter(item => item.type === 'total');
    }
  }

  // 初始化视图、模型参数
  // @override
  initParams() {
    // 模型参数
    this.modelParams = {
      // 绕视图的 x, y 轴旋转
      rotateX: 0, // 绕 x 轴旋转角度
      rotateXDir: [...BaseCanvasWebgl.X_DIR], // 绕 x 轴旋转轴向量
      rotateY: 0, // 绕 y 轴旋转角度
      rotateYDir: [...BaseCanvasWebgl.Y_DIR], // 绕 y 轴旋转轴向量
      rotateZ: 0, // 绕 y 轴旋转角度
      rotateZDir: [...BaseCanvasWebgl.Z_DIR], // 绕 y 轴旋转轴向量
      translate: [0, 0, 0], // 平移距离
      scale: [1, 1, 1], // 缩放系数
    };
    // 视图参数
    this.viewParams = {
      perspective: [30, this.width / this.height, 1, 100], // 投影参数
      lookAtFrom: [8, 8, 12], // 摄像机位置
      lookAtTo: [0, 0, 0], // 摄像机观察点
      lookAtDir: [0, 1, 0], // 摄像机正方向
    };
    // 光照参数
    this.lightParams = {
      lightPosition: [4, 4, 8], // 光源位置
      lightColor: [1, 1, 1], // 光线颜色
      ambientLightColor: [0.75, 0.75, 0.75], // 环境光颜色
      lightRange: [5, 25], // 光照范围
    };
    // 动画参数
    this.animateParams = {
      speed: 0.3, // 一般速度
      playSpeed: 0.5, // 播放一组旋转的速度
      recoverySpeed: 0.4, // 恢复速度
      backSpeed: 0.25, // 右键旋转转会速度
      wholeRotateSpeed: 0.25, // 整体旋转速度
    };
  }

  // 初始化矩阵变量
  // @override
  initMatrixs() {
    this.viewMatrix = new Matrix4(); // 视图矩阵
    this.modelMatrix = new Matrix4(); // 模型矩阵
    this.modelRotateMatrix = new Matrix4(); // 模型旋转矩阵
    this.tempRotateMatrix = null; // 旋转开始前的旋转矩阵
    this.tempMatrix = new Matrix4(); // 临时矩阵
    this.normalMatrix = new Matrix4(); // 法向量矩阵

    this.modelRotateMatrix.rotate(this.modelParams.rotateX, ...this.modelParams.rotateXDir);
    this.modelRotateMatrix.rotate(this.modelParams.rotateY, ...this.modelParams.rotateYDir);
    this.modelRotateMatrix.rotate(this.modelParams.rotateZ, ...this.modelParams.rotateZDir);
  }

  // 初始化数据
  // @override
  initData() {
    this.setLightParams(); // 设置光照参数

    tools.useArrayBuffer(this.gl, this.locs.attrs.a_Face, this.commonCube.buffers.faceBuffer);
    this.setViewMatrix();
    this.draw();
  }

  // 设置光源参数
  setLightParams() {
    tools.useArrayBuffer(this.gl, this.locs.attrs.a_Normal, this.commonCube.buffers.normalBuffer); // 设置面的法向量

    this.gl.uniform3fv(this.locs.unifs.u_AmbientLightColor, this.lightParams.ambientLightColor); // 设置环境光颜色
    this.gl.uniform3fv(this.locs.unifs.u_LightColor, this.lightParams.lightColor); // 设置光线颜色
    this.gl.uniform3fv(this.locs.unifs.u_LightPosition, this.lightParams.lightPosition); // 设置光源位置
    this.gl.uniform2fv(this.locs.unifs.u_LightRange, this.lightParams.lightRange); // 设置光源光照范围
  }

  // 设置视图矩阵
  setViewMatrix() {
    this.viewMatrix.setPerspective(...this.viewParams.perspective);
    this.viewMatrix.lookAt(
      ...this.viewParams.lookAtFrom,
      ...this.viewParams.lookAtTo,
      ...this.viewParams.lookAtDir,
    );

    this.gl.uniformMatrix4fv(this.locs.unifs.u_ViewMatrix, false, this.viewMatrix.elements);
  }

  // 设置模型矩阵
  setModelMatrix(selfMatrix) {
    this.modelMatrix.setTranslate(...this.modelParams.translate);
    this.modelMatrix.multiply(this.currentRotateMatrix);
    this.modelMatrix.multiply(selfMatrix);
    this.modelMatrix.scale(...this.modelParams.scale);

    this.gl.uniformMatrix4fv(this.locs.unifs.u_ModelMatrix, false, this.modelMatrix.elements);

    this.setNormalMatrix();
  }

  // 设置法向量矩阵
  setNormalMatrix() {
    this.normalMatrix.set(this.modelMatrix); // 设置为模型矩阵
    this.normalMatrix.invert().transpose(); // 模型矩阵的逆转置矩阵

    this.gl.uniformMatrix4fv(this.locs.unifs.u_NormalMatrix, false, this.normalMatrix.elements);
  }

  // 当前使用的旋转矩阵
  get currentRotateMatrix() {
    return this.tempRotateMatrix ? this.tempRotateMatrix : this.modelRotateMatrix;
  }

  // 当前的 mvp 矩阵
  get currentMvpMatrix() {
    return new Matrix4(this.viewMatrix).multiply(this.modelMatrix).multiply(this.currentRotateMatrix);
  }

  // 正在动画中
  get animating() {
    return this._states.animating;
  }
}
