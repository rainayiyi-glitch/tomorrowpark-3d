# Tomorrow Park · Controls Lab

**Created by Raina / 乙南** · [English](README.en.md)

从 Tomorrow Park 提取、解耦的两套学习用代码：**3D 模型观察与镜头控制**，以及 **角色移动、网格寻路与跟随镜头**。

这是独立的代码示例，不是完整的 MAÑANA 公园。原公园的模型、Raina 外观、私人摄影、歌曲、展品和品牌素材均不包含。演示中的简单建筑和小机器人专门用于验证控制系统，不代表私人作品的美术品质。

本示例原创代码采用 [MIT 许可证](LICENSE)，署名 Raina / 乙南。第三方声明见 `licenses/`。许可不涵盖未包含在本仓库中的私人照片、音乐、Raina外观和完整公园模型。

## 运行

安装 Node.js 22.18 或更新的受支持版本。在本目录运行：

```bash
npm ci
npm run dev
```

打开终端显示的本机地址。运行不需要原公园文件，也不需要任何照片、音乐或API密钥。

```bash
npm test
npm run build
npm run preview
```

## 操作

- 鼠标拖动旋转；滚轮缩放；右键拖动平移。
- 点击示例建筑：平滑推进。Overview：返回全景。
- WASD / 方向键移动；Shift 加速；点击空地自动寻路。
- 键盘移动立即取消旧路径。碰撞时沿障碍滑动；不可达目标显示提示。
- Follow character 跟随；Free camera 自由观察。自由模式下方向键仍只移动角色。
- 选择本地自包含 `.glb`：在浏览器内解析，不上传。导入模型进入观察模式；Reset demo 返回可移动角色示例。

**范围限制：**导入任意GLB不会自动生成该模型的导航网格、动画或碰撞。示例寻路使用平地网格和显式障碍；坡面、动态人群避让、完整公园交互和相机建筑遮挡恢复不在本次发布范围内。移动端可观察模型，键盘角色控制以桌面为主。

## 文件结构

| 文件 | 用途 |
|---|---|
| `src/viewer.js` | Three.js场景、OrbitControls、GLB加载、镜头聚焦、资源释放 |
| `src/navigation.ts` | 从原项目WalkGrid提取的A*、路径平滑、障碍和滑动算法 |
| `src/explorer.js` | 从Raina控制流程解耦的输入、移动、转向、路径接管与跟随 |
| `src/main.js` | 无外部素材的测试场景与页面按钮 |
| `tests/` | 寻路与控制回归测试 |
| `PROVENANCE.md` | 原模块关系、改编范围 |
| `RELEASE_REVIEW.md` | 发布范围、排除清单、测试边界 |
| `LICENSE_PROPOSAL.md` | 许可证确认记录 |

## 换成自己的项目

1. 用 `ModelViewer` 加载你有权使用的自包含GLB。
2. 将角色Object3D传给 `Explorer`，搭配独立的WalkGrid。
3. 用 `grid.addBox()` / `grid.addCircle()`登记障碍，按项目尺寸修改网格边界。
4. 每帧调用 `explorer.update(deltaSeconds)`，然后更新镜头并渲染。
5. 外观模型和骨骼动画需自行接入。此示例不含Raina角色模型，也不提供完整公园。

## 素材与许可

没有打包个人照片、歌曲、第三方画作、品牌Logo、原公园GLB或Blender文件。所有演示几何体由代码创建。Three.js和Vite保留各自上游许可证；原项目要求保留的MIT声明位于 `licenses/`。不以本项目许可证替第三方资源重新授权。

私有版照片日记、音乐、艺术展等功能没有被修改。请不要将私人原工程直接覆盖到此仓库。
