import BaseEffect from './BaseEffect';
import AddCalculator from '../../logic/calculator/AddCalculator';
import ContextConst from '../../logic/const/ContextConst';
import Log from '../../lib/Log';

class PropEffect extends BaseEffect {

    /**
     *Creates an instance of PropEffect.
     * @param {number} proId - 目标对象生效的属性ID
     * @param {Array.<Object>} info - [{targetType: 0, proId: 1, scale: 1.5, step: 0}...]形式的数组，用于计算效果的值
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
        let value = ContextConst.getEffectValue(this.info, target, this.owner);
        this.cal = new AddCalculator(this.proId, 1, value);
        const oldValue = roleContext.getRealProp(this.proId);
        roleContext.addCalculator(this.cal);
        Log.log(`PropEffect生效，${this.proId}:${oldValue}=>${roleContext.getRealProp(this.proId)}`);
    }

    undoEffect(target){
        const roleContext = target.logicEntity.getContext();
        roleContext.rmCalculator(this.cal);
    }

}

export default PropEffect;
