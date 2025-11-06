const { ccclass, property } = cc._decorator;

@ccclass
export default class main extends cc.Component {
    @property({ type: cc.Node, tooltip: '坦克' })
    nodeTank: cc.Node = null;

    @property({ type: cc.Node, tooltip: '摇杆' })
    nodeJoyStick: cc.Node = null;
    
    
    @property({ type: cc.Prefab, tooltip: '坦克预制体' })
    prefabTank: cc.Prefab = null;

    @property({ type: cc.Prefab, tooltip: '摇杆预制体' })
    prefabJoyStick: cc.Prefab = null;

    protected onLoad(): void {
        
    }

    protected onDestroy(): void {
        
    }

    protected start(): void {
        // 实例化坦克
        const instanceTank = cc.instantiate(this.prefabTank);
        instanceTank.parent = this.nodeTank;
        
        // 实例化摇杆
        const instanceJoyStick = cc.instantiate(this.prefabJoyStick);
        instanceJoyStick.parent = this.nodeJoyStick;
    }
    
}
