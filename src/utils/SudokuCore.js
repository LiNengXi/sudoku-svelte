const LEN = 9;
//  用于比较行列九宫数组排序后的位置上数字是否准确
const NOTREPEATROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
//  组成九个数字元素数组的循环步骤数
const CELLGROUPCOUNTER = 3;

function loopHandler(cb) {
  for (let i = 0; i < LEN; i++) {
      for (let j = 0; j < LEN; j++) {
          cb(i, j);
      }
  }
}

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
      return Array.apply(null, { length: LEN }).map(() => {
        return '';
      })
    });
  }

  setSteps(idx) {
    let p;

    if (idx < CELLGROUPCOUNTER) {
      p = 0;
    } else if (idx < CELLGROUPCOUNTER * 2) {
      p = CELLGROUPCOUNTER;
    } else if (idx < CELLGROUPCOUNTER * CELLGROUPCOUNTER) {
      p = CELLGROUPCOUNTER * 2;
    }

    return p;
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

  inRows(i) {
    let sudoku = this.__sudoku,
        row = [];
    
    for (let x = 0; x < LEN; x++) {
      row.push(sudoku[i][x]);
    }
      
    return row;
  }

  inColumns(j, sudoku = this.__sudoku) {
    let column = [];
    
    for (let x = 0; x < LEN; x++) {
      column.push(sudoku[x][j]);
    }
      
    return column;
  }

  getRandomNumber() {
    return Math.floor(Math.random() * LEN + 1);
  }

  checkNumber(rand, i, j) {
    if (this.inRows(i).indexOf(rand) === -1 &&
        this.inColumns(j).indexOf(rand) === -1 &&
        this.inSquareds(i, j).indexOf(rand) === -1) {
      
      return rand;
    }

    return this.checkNumber(this.getRandomNumber(), i, j);
  }

  initializeSudoku() {
    this.rowGenerate();
    return this.renderSudoku();
  }

  //  因不会算法，通过try catch取巧完成数独的初始化生成
  renderSudoku() {
    let sudoku = this.__sudoku,
        _self = this;

    try {
        loopHandler(function (i, j) {
            let num = _self.checkNumber(_self.getRandomNumber(), i, j);

            sudoku[i][j] = num;
        });

        return sudoku;
    } catch (e) {
      return _self.initializeSudoku();
    }
  }

  //  此函数用来给数独随机留白以供玩家填空。
  createBlankCell(sudoku, difficulty) {
    loopHandler(function (i, j) {
      if (Math.random() > difficulty) {
        sudoku[i][j] = '';
      }
    });
  
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