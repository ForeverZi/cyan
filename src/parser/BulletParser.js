import ViewBullet from '../view/bullet/ViewBullet';
import SplitViewBullet from '../view/bullet/SplitViewBullet';
import EffectParser from './EffectParser';
import BuffParser from './BuffParser';
import SelectorParser from './SelectorParser';
import TriggerParser from './TriggerParser';
import buffs from '../../config/buff';
import bullets from '../../config/bullet';
import SubBullet from '../view/bullet/SubBullet';

class BulletParser{

    parse(bulletConfig, owner){
        const effects = [];
        for(const config of bulletConfig.effects){
            effects.push(EffectParser.parse(config, owner));
        }
        const buffs = [];
        for(const buffId of bulletConfig.buffs){
            const config = this.getBuffConfigById(buffId);
            buffs.push(BuffParser.parse(config, owner));
        }
        const selector = SelectorParser.parseComplex(bulletConfig.selectors, owner);
        const trigger = TriggerParser.parse(bulletConfig.trigger, owner);
        
        let explodeSelector;
        const explodeEffects = [];
        if (bulletConfig.explodeSelectors && bulletConfig.explodeSelectors.length > 0) {
            explodeSelector = SelectorParser.parseComplex(bulletConfig.explodeSelectors, owner);
            for (const config of bulletConfig.explodeEffects) {
                explodeEffects.push(EffectParser.parse(config, owner));
            }
        }
        const subBulletConf = bulletConfig.subBullet && bullets[bulletConfig.subBullet];
        const Bullet = subBulletConf ? SplitViewBullet : ViewBullet;
        const bullet = new Bullet(owner, {
            effects: effects,
            buffs: buffs,
            selector: selector,
            spinePath: bulletConfig.spinePath,
            hitEffect: bulletConfig.hitEffect,
            offset: cc.v2(bulletConfig.offset.x, bulletConfig.offset.y),
            trigger: trigger,
            trace: bulletConfig.trace,
            mustHit: bulletConfig.mustHit,
            explodeSelector: explodeSelector,
            explodeEffects: explodeEffects,
            explodeEffectPath: bulletConfig.explodeEffectPath,
            groundEffectPath: bulletConfig.groundEffectPath,
            subBulletConf: subBulletConf,
        });
        return bullet;
    }

    parseSubBullet(bulletConfig, owner, target){
        const effects = [];
        for (const config of bulletConfig.effects) {
            effects.push(EffectParser.parse(config, owner));
        }
        const buffs = [];
        for (const buffId of bulletConfig.buffs) {
            const config = this.getBuffConfigById(buffId);
            buffs.push(BuffParser.parse(config, owner));
        }
        const trigger = TriggerParser.parse(bulletConfig.trigger, owner);
        let explodeSelector;
        const explodeEffects = [];
        if (bulletConfig.explodeSelectors && bulletConfig.explodeSelectors.length > 0) {
            explodeSelector = SelectorParser.parseComplex(bulletConfig.explodeSelectors, owner);
            for (const config of bulletConfig.explodeEffects) {
                explodeEffects.push(EffectParser.parse(config, owner));
            }
        }
        const bullet = new SubBullet(owner, {
            effects: effects,
            buffs: buffs,
            spinePath: bulletConfig.spinePath,
            hitEffect: bulletConfig.hitEffect,
            offset: cc.v2(bulletConfig.offset.x, bulletConfig.offset.y),
            trigger: trigger,
            trace: bulletConfig.trace,
            mustHit: bulletConfig.mustHit,
            explodeSelector: explodeSelector,
            explodeEffects: explodeEffects,
            explodeEffectPath: bulletConfig.explodeEffectPath,
            groundEffectPath: bulletConfig.groundEffectPath,
        }, target);
        return bullet;
    }

    getBuffConfigById(id){
        return buffs[id];
    }
}

const parser = new BulletParser();

export default parser;