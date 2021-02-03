<script>
    import { afterUpdate, createEventDispatcher } from 'svelte';

    export let levels;
    export let curr_difficulty;

    const dispatch = createEventDispatcher();

    let currIndex = 0;

    afterUpdate(() => {
        levels.forEach((ele, i) => {
            if (ele.difficulty === curr_difficulty) {
                currIndex = i;
            }
        });
    });

    function toggleLevel(i) {
        currIndex = i;
        dispatch('choseDifficulty', {
            value: levels[i].difficulty
        });
    }
</script>

<style>
.levels {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    width: 360px;
    color: #333;
}
.levels li {
    cursor: pointer;
}
.levels li.s-current {
    font-weight: 700;
    color: lightcoral;
}
.levels li.n-current {
    opacity: .6;
}
</style>

<ul class="levels">
    { #each levels as level, i (i) }
        <li class="{ i === currIndex ? 's-current' : 'n-current' }"
            on:click={ () => toggleLevel(i) }>{ level.text }</li>
    { /each }
</ul>