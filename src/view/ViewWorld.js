import CommonConst from '../logic/const/CommonConst';
import RoleEntity from '../logic/entity/RoleEntity';
import RoleContext from '../logic/entity/RoleContext';
import ViewEntity from './ViewEntity';
import pubfunc from '../logic/utils/pubfunc';
import ContextConst from '../logic/const/ContextConst';
import stateConfig from '../../config/stateConfig';

// ViewWorld需要绑定在对应的战场节点上
cc.Class({
    extends: cc.Component,

    properties: {
    },

    ctor(){
        this._entities = {};
        this._entityList = [];
        this._bullets = [];
        pubfunc.setWorld(this);
        this.randFunc = pubfunc.getRandomFunc(Date.now());
    },

    onLoad(){
        this._featureSkill();
    },

    _featureSkill(){
        let hero = this.addHero();
        let entity1 = this.addEnemy();
        entity1.setPosition(hero.getPosition().add(400, 20))
        let entity2 = this.addEnemy();
        entity2.setPosition(hero.getPosition().add(300, -20));
    },

    addHero(){
        let entity = this._addSampleEntity(ContextConst.CAMP.PLAYER, 1000);
        entity.setPosition(cc.v2(this.randFunc(-this.node.width / 2 + 50, this.node.width / 2 - 50),
            this.randFunc(-this.node.height / 2 + 50, this.node.height / 2 - 50)));
        entity.setNormalSkillIds(['10002']);
        return entity;
    },

    addEnemy(){
        let entity = this._addSampleEntity(ContextConst.CAMP.MONSTER, this.randFunc(800, 1000));
        entity.setNormalSkillIds(['3']);
        entity.setPosition(cc.v2(this.randFunc(-this.node.width / 2 + 50, this.node.width / 2 - 50), 
            this.randFunc(-this.node.height / 2 + 50, this.node.height / 2 - 50)));
        return entity;
    },

    _addSampleEntity(camp, hp){
        const roleContext = new RoleContext();
        roleContext.init({
            0: hp,
            1: 100,
            2: hp,
            3: 100
        });
        const logicEntity = new RoleEntity(roleContext, camp);
        const entity = new ViewEntity(logicEntity, {
            spinePath: 'role/ZGL/ZGL',
            skin: 'ZGL04',
            scale: 0.5
        }, stateConfig);
        entity.setHead(cc.v2(1, 0));
        this.addEntity(entity);
        return entity;
    },

    update(){
        for(const e of this._bullets){
            e.update();
        }
        for(const e of this._entityList){
            e.update();
        }
    },

    addEntity(entity){
        entity.view.parent = this.node;
        this._entities[entity.id] = entity;
        this._entityList.push(entity);
    },

    getEntityById(id){
        return this._entities[id];
    },

    getAllEntity(){
        return this._entityList.slice();
    },

    removeEntity(id){
        delete this._entities[id];
        this._entityList = this._entityList.filter((e)=>e.id!==id);
    },


    /**
     * 仅仅是将子弹注册到世界，以使其可以执行update
     * @param {ViewBullet} bullet
     */
    addBullet(bullet) {
        this._bullets.push(bullet);
        bullet.view.parent = this.node;
    },

    /**
     * 子弹只有在发射之后才会显示出来，这里为了校准子弹位置和方向
     * @param {ViewBullet} bullet
     */
    fireBullet(bullet){
        const atker = bullet.atker;
        const wpos = atker.view.convertToWorldSpaceAR(bullet.view.position);
        const tpos = this.node.convertToNodeSpaceAR(wpos);
        bullet.view.position = tpos;
        bullet.view.scaleX = - atker.getDirect() * bullet.view.scaleX;
    },

    removeBullet(bullet) {
        this._bullets = this._bullets.filter((e) => e.id !== bullet.id);
    },

    handleEvent(event, targetId){
        // TODO 处理事件，事件的来源可能是表现层实体或者逻辑层
        if(!targetId || targetId < 0){
            this._handleWorldEvent(event);
            return;
        }
        const entities = this._getEntitiesById(targetId);
        for(const e of entities){
            e.handleEvent(event);
        }
    },

    _getEntitiesById(id){
        let entities = [];
        switch(id){
        case CommonConst.ALL_ENTITY_CHANNEL:
            entities = this._entityList.slice();
            break;
        case CommonConst.ALL_ALIVE_ENTITY_CHANNEL:
            entities = this._entityList.filter((e)=>{
                return e.isAlive();
            });
            break;
        default:
            if (id >= CommonConst.ENTITY_MIN_ID) {
                let entity = this.getEntityById(id);
                if (entity) {
                    entities.push(entity);
                }
            }
        }
        return entities;
    },

    _handleWorldEvent(event){
        // TODO 通知世界
    }

});
