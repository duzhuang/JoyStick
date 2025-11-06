# Cocos Creator 摇杆组件项目

一个基于Cocos Creator 2.4.5开发的移动端虚拟摇杆组件，提供流畅的触摸控制和方向输入功能。

## 🎮 项目特性

### 核心功能
- **虚拟摇杆控制** - 支持触摸操作的虚拟摇杆
- **方向向量输出** - 实时输出标准化的方向向量
- **死区控制** - 可配置的死区范围，避免误操作
- **事件系统** - 完整的事件生命周期管理


## 📁 项目结构

```
assets/
├── JoyStick/           # 摇杆组件资源
│   ├── PrefabJoyStick.ts    # 摇杆组件脚本
│   └── Sprites/       # 摇杆贴图资源
├── Prefabs/           # 预制体资源
│   ├── PrefabJoyStick.prefab    # 摇杆预制体
│   └── PrefabTank.prefab       # 坦克预制体
├── Scripts/           # 脚本文件
│   ├── PrefabTank.ts          # 坦克控制脚本
│   └── main.ts               # 主场景脚本
├── Scenes/            # 场景文件
│   └── main.fire             # 主场景
```

## 🚀 快速开始

### 环境要求
- Cocos Creator 2.4.5+
- TypeScript 3.7+
- Node.js 12+

### 安装步骤
1. 克隆或下载项目到本地
2. 使用Cocos Creator打开项目文件夹
3. 等待资源导入完成
4. 打开 `assets/Scenes/main.fire` 场景
5. 点击预览按钮运行项目

## 🎯 摇杆组件使用

### 组件属性

| 属性名 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| nodeBg | cc.Node | 摇杆背景节点 | - |
| nodeStick | cc.Node | 摇杆节点 | - |
| maxRadius | number | 最大移动半径 | 100 |
| deadZone | number | 死区范围(0-1) | 0.1 |

### 事件系统

摇杆组件通过全局事件系统发送以下事件：

```typescript
// 摇杆开始触摸
cc.game.emit('joySitck-start');

// 摇杆方向改变
cc.game.emit('joySitck-change', direction: cc.Vec3);

// 摇杆结束触摸
cc.game.emit('joySitck-end');
```

### 使用示例

```typescript
// 监听摇杆事件
cc.game.on('joySitck-change', (direction: cc.Vec3) => {
    // 处理方向输入
    this.node.x += direction.x * this.speed;
    this.node.y += direction.y * this.speed;
});

// 监听摇杆开始事件
cc.game.on('joySitck-start', () => {
    console.log('摇杆开始操作');
});

// 监听摇杆结束事件
cc.game.on('joySitck-end', () => {
    console.log('摇杆操作结束');
});
```

## 🎮 坦克控制示例

项目中包含一个坦克控制示例，展示了如何使用摇杆控制游戏对象：

### 坦克组件特性
- **移动控制** - 通过摇杆控制坦克移动
- **旋转控制** - 根据移动方向自动旋转
- **动画系统** - 移动状态动画切换
- **碰撞检测** - 基础碰撞处理

### 坦克属性配置
```typescript
@property({ tooltip: "移动速度" })
speed: number = 200;

@property({ tooltip: "旋转速度" })
rotateSpeed: number = 5;
```

## 🔧 开发指南

### 组件扩展
摇杆组件设计为可扩展的，可以轻松添加以下功能：

```typescript
// 添加力度控制
@property({ tooltip: "力度控制" })
forceControl: boolean = false;

// 添加摇杆类型
enum JoyStickType {
    STATIC,    // 静态摇杆
    DYNAMIC,   // 动态摇杆
    FOLLOW     // 跟随摇杆
}
```

### 自定义事件
可以扩展事件系统以支持更多功能：

```typescript
// 自定义摇杆事件
cc.game.emit('joyStick-custom', {
    type: 'doubleTap',
    position: event.getLocation()
});
```


---

**注意**: 本项目为学习用途，建议在实际项目中使用前进行充分测试。