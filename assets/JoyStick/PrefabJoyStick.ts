const { ccclass, property } = cc._decorator;

@ccclass
export default class PrefabJoyStick extends cc.Component {
    @property({ type: cc.Node, tooltip: '摇杆背景' })
    nodeBg: cc.Node = null;

    @property({ type: cc.Node, tooltip: '摇杆' })
    nodeStick: cc.Node = null;

    @property({ tooltip: "最大半径" })
    maxRadius: number = 100;

    @property({ tooltip: "死区" })
    deadZone: number = 0.1;

    /** 方向向量 */
    private m_direction: cc.Vec2 = new cc.Vec2(0, 0);
    /** 当前触摸ID */
    private m_touchId: number = -1;

    protected onLoad(): void {
        this.nodeStick.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.nodeStick.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.nodeStick.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.nodeStick.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    protected onDestroy(): void {
        this.nodeStick.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.nodeStick.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.nodeStick.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.nodeStick.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    protected start(): void {
        this.resetStickPosition();
    }

    private onTouchStart(event: cc.Event.EventTouch): void {
        if (this.m_touchId !== -1) {
            return;
        }
        // 记录当前触摸ID
        this.m_touchId = event.getID();
        this.updateStickPosition(event);
        cc.game.emit('joySitck-start');
    }

    private onTouchMove(event: cc.Event.EventTouch): void {
        // 如果当前触摸ID不是当前事件的ID，则忽略该事件
        if (this.m_touchId !== event.getID()) {
            return;
        }
        this.updateStickPosition(event);
    }

    private onTouchEnd(event: cc.Event.EventTouch): void {
        // 如果当前触摸ID不是当前事件的ID，则忽略该事件
        if (this.m_touchId !== event.getID()) {
            return;
        }
        this.m_touchId = -1;
        this.resetStickPosition();
        this.m_direction.set(cc.Vec2.ZERO);
        cc.game.emit('joySitck-end');
    }

    private resetStickPosition(): void {
        this.nodeStick.setPosition(cc.v2(0, 0));
    }

    /**
     * 更新摇杆位置
     * @param event 
     */
    private updateStickPosition(event: cc.Event.EventTouch) {

        // 获取触摸点相对于摇杆背景节点的局部坐标
        let touchPos: cc.Vec2 = this.nodeBg.convertToNodeSpaceAR(event.getLocation());
        // 计算触摸点与摇杆背景中心的距离
        let dis = touchPos.mag();
        // 如果触摸点距离超过最大半径，则将触摸点限制在最大半径内
        if (dis > this.maxRadius) {
            touchPos = touchPos.mul(this.maxRadius / dis);
            dis = this.maxRadius;
        }
        // 更新摇杆位置
        this.nodeStick.setPosition(touchPos);

        // 计算当前方向向量
        const currentDirection = dis < this.deadZone ? cc.Vec2.ZERO : touchPos.normalize();

        // 如果当前方向与之前方向不同，则更新方向
        if (this.m_direction.fuzzyEquals(currentDirection, 0.001)) {
            return;
        }        

        // 更新方向向量
        this.m_direction.set(currentDirection);
        cc.game.emit('joySitck-change', new cc.Vec3(this.m_direction.x, this.m_direction.y, 0));
    }
}
