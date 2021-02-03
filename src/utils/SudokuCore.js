const LEN = 9;
const NOTREPEATROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function loopHandler(cb) {
  for (let i = 0; i < LEN; i++) {
    for (let j = 0; j < LEN; j++) {
      cb(i, j);
    }
  }
}

class SudokuCore {
  constructor() {
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
    let sudoku = [];

    for (let i = 0; i < LEN; i++) {
      let tmp = [];

      for (let j = 1; j <= LEN; j++) {
        tmp.push('');
      }

      sudoku.push(tmp);
    }

    return sudoku;
  }

  /**
   * 九宫格数组
   */
  inSquareds(i, j, sudoku) {
    let x, z;

    if (i < 3) {
      x = 0;
    } else if (i < 6) {
      x = 3;
    } else if (i < 9) {
      x = 6;
    }

    if (j < 3) {
      z = 0;
    } else if (j < 6) {
      z = 3;
    } else if (j < 9) {
      z = 6;
    }

    let counter = 3,
      squareds = [];

    for (let len = x + counter; x < len; x++) {
      squareds.push(sudoku[x][z]);
      squareds.push(sudoku[x][z + 1]);
      squareds.push(sudoku[x][z + 2]);
    }

    return squareds;
  }

  inRows(i, j, sudoku) {
    let row = [];

    for (let x = 0; x < LEN; x++) {
      row.push(sudoku[i][x]);
    }

    return row;
  }

  inColumns(i, j, sudoku) {
    let column = [];

    for (let x = 0; x < LEN; x++) {
      column.push(sudoku[x][j]);
    }

    return column;
  }

  getRandomNumber() {
    return Math.floor(Math.random() * LEN + 1);
  }

  checkNumber(rand, i, j, sudoku) {
    if (this.inRows(i, j, sudoku).indexOf(rand) === -1 &&
        this.inColumns(i, j, sudoku).indexOf(rand) === -1 &&
        this.inSquareds(i, j, sudoku).indexOf(rand) === -1) {

      return rand;
    }

    return this.checkNumber(this.getRandomNumber(), i, j, sudoku);
  }

  initSudoku() {
    let sudoku = this.rowGenerate();

    return this.renderSudoku(sudoku);
  }

  /**
   * 因不会算法，通过try catch取巧完成数独的初始化生成
   */
  renderSudoku(sudoku) {
    let _self = this;

    try {
      loopHandler(function (i, j) {
        let num = _self.checkNumber(_self.getRandomNumber(), i, j, sudoku);

        sudoku[i][j] = num;
      });

      return sudoku;
    } catch (e) {
      return _self.initSudoku();
    }
  }

  /**
   * 此函数用来给数独随机留白以供玩家填空。
   */
  createBlankCell(sudoku, difficulty) {
    loopHandler(function (i, j) {
      if (Math.random() > difficulty) {
        sudoku[i][j] = '';
      }
    });

    return sudoku;
  }

  /**
   * 此函数用来给玩家的结果检测是否完成。
   */
  checkSudoku(sudoku) {
    for (let i = 0; i < LEN; i++) {
      let rows = sudoku[i].slice();
      rows.sort();

      for (let j = 0; j < LEN; j++) {
        if (rows[j] !== NOTREPEATROWS[j]) { return false; }
      }
    }

    for (let i = 0; i < LEN; i++) {
      let columns = [];
      for (let j = 0; j < LEN; j++) {
        columns.push(sudoku[j][i]);
      }
      columns.sort();

      for (let x = 0; x < LEN; x++) {
        if (columns[x] !== NOTREPEATROWS[x]) { return false; }
      }
    }

    let counter = 3,
        squareds = [];

    for (let i = 0; i < LEN; i += counter) {
      for (let j = 0; j < LEN; j += counter) {
        let tmp = [];

        for (let x = i, len = i + counter; x < len; x++) {
          for (let z = j, len = j + counter; z < len; z++) {
            tmp.push(sudoku[x][z]);
          }
        }

        squareds.push(tmp);
      }
    }

    for (let i = 0; i < LEN; i++) {
      let nineGrids = squareds[i];
      nineGrids.sort();

      for (let j = 0; j < LEN; j++) {
        if (nineGrids[j] !== NOTREPEATROWS[j]) { return false; }
      }
    }

    return true;
  }

}

export default SudokuCore;