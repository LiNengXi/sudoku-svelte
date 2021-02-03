<script>
    export let sudoku;
    const LEN = 9;

    $: numbers = numbersSign(sudoku);

    function numbersSign(sudoku) {
        let numbers_local = initNumbers();

        for (let i = 0; i < LEN; i++) {
            let numsRes = JSON.stringify(sudoku).match(new RegExp(i + 1, 'g')),
                len = numsRes ? numsRes.length : 0;
            
                numbers_local[i].isMax = len >= LEN;
        }

        return numbers_local;
    }

    function initNumbers() {
        let res = [];

        for (let i = 1; i <= LEN; i++) {
            res.push({
                num: i,
                isMax: false
            });
        }

        return res;
    }
</script>

<style>
.numbers {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    width: 360px;
    font-size: 18px;
}
.s-max {
    text-decoration: line-through;
}
</style>

<ul class="numbers">
    { #each numbers as e, i }
        <li class="{ e.isMax ? 's-max' : '' }">{ e.num }</li>
    { /each }
</ul>

