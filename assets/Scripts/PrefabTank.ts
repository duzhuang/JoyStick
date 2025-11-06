
const { ccclass, property } = cc._decorator;

@ccclass
export default class PrefabTank extends cc.Component {

    @property({ tooltip: "速度" })
    maxSpeed: number = 100;

    @property({ tooltip: "转向速度(角度插值)" })
    turnSpeed: number = 100;

    @property({ tooltip: "加速速度" })
    accelSpeed: number = 3;

    private m_currentDirection: cc.Vec3 = cc.Vec3.ZERO;
    private m_isMoving: boolean = false;
    private m_currentSpeed: number = 0; // 当前速度

    protected onLoad(): void {
        cc.game.on("joySitck-start", this.onJoySitckStart, this);
        cc.game.on("joySitck-end", this.onJoySitckEnd, this);
        cc.game.on("joySitck-change", this.onJoySitckChange, this);
    }

    protected onDestroy(): void {
        cc.game.off("joySitck-start", this.onJoySitckStart, this);
        cc.game.off("joySitck-end", this.onJoySitckEnd, this);
        cc.game.off("joySitck-change", this.onJoySitckChange, this);
    }


    private onJoySitckStart(): void {
        this.m_isMoving = true;
    }

    private onJoySitckEnd(): void {
        // 重置当前方向
        this.m_currentDirection.set(cc.Vec3.ZERO);
        this.m_isMoving = false;
    }

    private onJoySitckChange(direction: cc.Vec3): void {
        this.m_currentDirection.set(direction);
        this.m_isMoving = direction.len() > 0;
    }

    protected update(dt: number): void {
        this.tankSpeed(dt);
        this.tankTurn(dt);
        this.tankMove(dt);
    }


    /**
     * 坦克速度控制
     * @param dt 时间间隔
     */
    private tankSpeed(dt: number): void {
        // 速度控制
        if (this.m_isMoving) {
            // 加速
            this.m_currentSpeed += this.accelSpeed * dt;
            if (this.m_currentSpeed > this.maxSpeed) {
                this.m_currentSpeed = this.maxSpeed;
            }
        } else {
            // 减速
            this.m_currentSpeed -= this.accelSpeed * dt;
            if (this.m_currentSpeed < 0) {
                this.m_currentSpeed = 0;
            }
        }
    }

    /**
     * 坦克转向
     * @param dt 时间间隔
     */
    private tankTurn(dt: number): void {
        if (this.m_currentDirection.len() <= 0) {
            return;
        }

        const targetAngle = Math.atan2(this.m_currentDirection.y, this.m_currentDirection.x) * 180 / Math.PI;     
        this.smoothRotate(targetAngle, dt);
    }

    /**
     * 坦克移动
     * @param dt 时间间隔
     */
    private tankMove(dt: number): void {
        // 移动
        const moveDelta = new cc.Vec3(
            this.m_currentDirection.x * this.m_currentSpeed * dt,
            this.m_currentDirection.y * this.m_currentSpeed * dt,
            0
        );
        this.node.position = this.node.position.add(moveDelta);
    }


    /**
     * 平滑转向
     * @param targetAngle 目标角度
     * @param dt 时间间隔
     */
    private smoothRotate(targetAngle: number, dt: number) {
        let currentAngle = this.node.angle;
        let delta = targetAngle - currentAngle;

        // 修正跨越 -180/180 的情况
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        // 按转向速度逐渐逼近
        let step = this.turnSpeed * dt;
        if (Math.abs(delta) < step) {
            currentAngle = targetAngle;
        } else {
            currentAngle += step * Math.sign(delta);
        }

        this.node.angle = currentAngle;
    }

}
