# 猫咪花色实验室

一个中文单页遗传小游戏：调两只亲本，生成一窝 5 只小猫，点开查看花色来历。React + TypeScript + Vite，SVG 插画，无后端、无账号。

## 本地运行

```sh
npm install
npm run dev
```

打开终端显示的本地地址。`npm test` 验证规则，`npm run build` 生成 `dist/`。

## 设计依据

- [原始构思](docs/brainstorms/2026-09-23-cat-coat-genetics-game-brainstorm.md)
- [实现计划](docs/plans/2026-09-23-feat-cat-coat-litter-demo-plan.md)
- [本轮设计补充](docs/plans/2026-09-25-demo-design-addendum.md)（冲突以此补充为准）

解释读取本次继承记录；旧窝保留双亲快照；外观种子让花斑稳定。虎斑和白斑采用游戏近似，页面内有模拟说明。刷新重置；暂不包含公玳瑁彩蛋、存档和多代繁育。
