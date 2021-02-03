<script>
    /**
     * 此组件的代码
     * 如果不拆分成这个子组件，直接在父组件里实现是比较快捷的.
     * 
     * 由于学习svelte的时间短，也许是对svelte官网的用例理解不够
     * 拆分成这个子组件，在实现上没找到可以像 vue 那样
     * 通过 ref 调用子组件里方法的方式
     * 所以放弃了在此组件里实现，改用svelte自身提供的状态管理
     * 期待以后能获知在此组件里实现功能的方式
     * 
     * 用svelte自身提供的状态管理来实现计时功能，使用和理解更 方便 ！
    */
    import { usedTime } from '../store.js';
</script>

<style>
    .time {
        margin: 10px 0;
        width: 360px;
        font-size: 16px;
        line-height: 1.5;
        color: #333;
    }
</style>

<div class="time">{ $usedTime }</div>