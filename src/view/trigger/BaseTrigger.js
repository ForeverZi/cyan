class BaseTrigger{

    constructor(){
    }

    /**
     * 判断是否触发
     * @param {ViewEntity} atk
     * @param {Array.<ViewEntity>} targets
     * @param {ViewWorld} world
     * @return {bool}
     * @memberof BaseTrigger
     */
    trigger(atk, targets, world){
        return true;
    }

    /**
     * 需要在每帧update状态，然后调用trigger判定是否被出发
     * @memberof BaseTrigger
     */
    update(){

    }

}

export default BaseTrigger;