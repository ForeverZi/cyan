import BaseEffect from './BaseEffect';
import AddCalculator from '../../logic/calculator/AddCalculator';
import ContextConst from '../../logic/const/ContextConst';

class PropEffect extends BaseEffect {

    /**
     *Creates an instance of PropEffect.
     * @param {number} proId - 目标对象生效的属性ID
     * @param {Array.<Object>} info - [{targetType: 0, proId: 1, scale: 1.5}...]形式的数组，用于计算效果的值
     * @param {ViewEntity} owner - 生成此效果的对象
     * @memberof PropEffect
     */
    constructor(proId, info, owner) {
        super();
        this.owner = owner;
        this.context = owner.logicEntity.getContext();
        this.info = info;
        this.proId = proId;
    }

    doEffect(target) {
        const roleContext = target.logicEntity.getContext();
        let value = this.calculateValue(roleContext);
        this.cal = new AddCalculator(this.proId, 1, value);
        roleContext.addCalculator(this.cal);
    }

    undoEffect(target){
        const roleContext = target.logicEntity.getContext();
        roleContext.rmCalculator(this.cal);
    }

    calculateValue(targetContext) {
        let total = 0;
        for (const item of this.info) {
            let context;
            switch (item[0]) {
                case ContextConst.TARGET_TYPE.OWNER:
                    context = this.context;
                    break;
                case ContextConst.TARGET_TYPE.TARGET:
                    context = targetContext;
                    break;
            }
            const delta = context.getRealProp(item.proId) * item.scale;
            total += delta;
        }
        return total;
    }

}

export default PropEffect;
