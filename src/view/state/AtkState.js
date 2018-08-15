import BaseState from "./BaseState";

class AtkState extends BaseState {

    constructor() {
        super('atk');
    }

    onEnter(sm) {
        super.onEnter(sm);
        sm.viewEntity.playAnim('attack01');
        // for test
        sm.viewEntity.prepareBullets();
        sm.viewEntity.fireBullets(50);
    }
    
}

export default AtkState;