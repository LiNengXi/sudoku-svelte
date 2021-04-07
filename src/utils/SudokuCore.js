const LEN = 9;
//  用于比较行列九宫数组排序后的位置上数字是否准确
const NOTREPEATROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
//  组成九个数字元素数组的循环步骤数
const CELLGROUPCOUNTER = 3;

class SudokuCore {
  constructor() {
    this.__sudoku = [];
    this.levels = [
      {
        text: '简单',
        difficulty: .5
      },
      {
        text: '一般',
        difficulty: .4
      },
      {
        text: '困难',
        difficulty: .3
      },
      {
        text: '专家',
        difficulty: .25
      }
    ];
  }

  rowGenerate() {
    this.__sudoku = Array.apply(null, { length: LEN }).map(() => {
      return Array.apply(null, { length: LEN }).map(() => '');
    });
  }

  setSteps(idx) {
    if (idx < CELLGROUPCOUNTER) {
      return 0;
    } else if (idx < CELLGROUPCOUNTER * 2) {
      return CELLGROUPCOUNTER;
    } else if (idx < CELLGROUPCOUNTER * CELLGROUPCOUNTER) {
      return CELLGROUPCOUNTER * 2;
    }
  }

  //  九宫格数组
  inSquareds(i, j, sudoku = this.__sudoku) {
    let x = this.setSteps(i),
        z = this.setSteps(j),
        squareds = [];

    for (let len = x + CELLGROUPCOUNTER; x < len; x++ ) {
      for (let p = z; p < z + CELLGROUPCOUNTER; p++) {
        squareds.push(sudoku[x][p]);
      }
    }

    return squareds;
  }

  inRows(i, sudoku = this.__sudoku) {
    return sudoku[i].slice();
  }

  inColumns(j, sudoku = this.__sudoku) {
    return sudoku.map(ele => ele[j]);
  }

  renderSudoku() {
    this.rowGenerate();
    let sudoku = this.__sudoku;

    for (let i = 0; i < LEN; i++) {
      let isReset = false;
      for (let j = 0; j < LEN; j++) {
        let rows = this.inRows(i),
            columns = this.inColumns(j),
            squareds = this.inSquareds(i, j),
            intersection = [ ...new Set(rows.concat(columns, squareds)) ];  //  当前单元格所处行、列、九宫的交集数组

        if (intersection.length) {
          /**
           * avaliableComplement 为当前单元格交集数组相对 NOTREPEATROWS 的补集数组
           * 通俗来说，剩下可用来填充当前单元格的随机数字集合
           */
          let avaliableComplement = NOTREPEATROWS.filter(ele => intersection.indexOf(ele) === -1),
              len = avaliableComplement.length;

          if (len) {
            //  在可用数字集合里随机一个数字
            sudoku[i][j] = avaliableComplement[ Math.floor(Math.random() * len) ];
          } else {
            // avaliableComplement 为空立即重置
            isReset = true;
            break;
          }
        } else {
          //  开始 intersection 为空，随机产生一个数字
          sudoku[i][j] = Math.floor(Math.random() * LEN + 1);
        }
      }

      if (isReset) {
        //  重置数独二维数组及循环变量
        this.rowGenerate();
        sudoku = this.__sudoku;
        i = -1;   // i++ 之后为 0
      }
    }

    return sudoku;
  }

  //  此函数用来给数独随机留白以供玩家填空。
  createBlankCell(sudoku, difficulty) {
    for (let i = 0; i < LEN; i++) {
      for (let j = 0; j < LEN; j++) {
        if (Math.random() > difficulty) {
          sudoku[i][j] = '';
        }
      }
    }
  
    return sudoku;
  }

  checkSudokuRows(arr) {
    return arr.every((ele, index) => ele === NOTREPEATROWS[index]);
  }

  //  此函数用来给玩家的结果检测是否完成。
  checkSudoku(sudoku) {
    for (let i = 0; i < LEN; i++) {
      let rows = sudoku[i].slice().sort();
  
      let isRowsTrue = this.checkSudokuRows(rows);
      if (!isRowsTrue) { return isRowsTrue; }

      let columns = this.inColumns(i, sudoku).sort();
  
      let isColumnsTrue = this.checkSudokuRows(columns);
      if (!isColumnsTrue) { return isColumnsTrue; }
    }

    for (let i = 0; i < LEN; i += CELLGROUPCOUNTER) {
        for (let j = 0; j < LEN; j += CELLGROUPCOUNTER) {
            let squared = this.inSquareds(i, j, sudoku).sort(),
                isSquaredTrue = this.checkSudokuRows(squared);

            if (!isSquaredTrue) { return isSquaredTrue; }
          }
    }
  
    return true;
  }

}

export default SudokuCore;