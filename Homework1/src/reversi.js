// reversi.js
const rev = {

    repeat: function(value, n) {
      var array = [];
      for (var i = 0; i < n; i++) {
        array.push(value);
      }
      return array;
    },

    generateBoard: function(rows, columns, initialCellValue) {
      var len = rows * columns;
      var arr = [];
      if (initialCellValue == null){
        arr = rev.repeat(" ", len);
      } else {
        arr = rev.repeat(initialCellValue, len);
      }
      return arr;
    },

    rowColToIndex: function(board, rowNumber, columnNumber) {
      var len = board.length;
      var size = Math.sqrt(len);
      var index = rowNumber * size;
      index += columnNumber;
      return index;
    },

    indexToRowCol: function(board, i) {
      var len = board.length;
      var size = Math.sqrt(len);

      return obj = {
        col: i % size,
        row:  Math.floor(i/size)
      };
      return obj;
    },

    setBoardCell: function(board, letter, row, col) {
      var newArray = board.slice();
      var index = rev.rowColToIndex(board, row, col);
      newArray[index] = letter;
      return newArray;
    },

    algebraicToRowCol: function(algebraicNotation) {
      var str1 = algebraicNotation.slice(0, 1);
      var str2 = algebraicNotation.slice(1, 2);
      if(str1.length == 1 && str2.length == 1 && str1.match(/[a-z]/i) && str2.match(/^[0-9]+$/)) {
        var alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        var letterPosition = alphabet.indexOf(algebraicNotation.slice(0, 1));
        return obj = {
          row: str2 - 1,
          col: letterPosition
        };
        return obj;
      } else {
        return;
      }
    },

    placeLetter: function(board, letter, algebraicNotation) {
      var rowCol = rev.algebraicToRowCol(algebraicNotation);
      var arr = [];
      var index = rev.rowColToIndex(board, rowCol.row, rowCol.col);
      arr = rev.setBoardCell(board, letter, rowCol.row, rowCol.col);
      return arr;
    },

    placeLetters: function(board, letter, algebraicNotation) {
      var arr = board;
      for (i = 2; i < arguments.length; i++) {
        var rowCol = rev.algebraicToRowCol(arguments[i]);
        var index = rev.rowColToIndex(board, rowCol.row, rowCol.col);
        arr[index] = letter;
      }
        return arr;
    },

    boardToString: function(board) {
      var len = board.length;
      var size = Math.sqrt(len);
      var alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
      var letters = [];
      var lettersArray = '     ';
      for(var i =0; i< size; i++) {
        letters[i] =   alphabet[i] + '   ';
      }
      lettersArray += letters.join('');

      var lines = rev.repeat('+---', size);
      lines = lines.join('');
      lines += '+';
      var newArray = [];
      for(var i=0; i<len; i++) {
        newArray[i] = '| ' + board[i] + ' ';
      }
      var x = 0;
      var n = size;
      var board =  lettersArray + '\n';//\t" + lines + "\n"";
      for(var i =0; i< size; i++) {
        board += '   ' + lines + '\n ' + (i+1) + ' ';
        for(var j =x; j< n; j++) {
          board += newArray[j];
        } board += '|\n';
        x += size;
        n += size;
      }
      board += '   ' + lines ;

      return board;
    },

    isBoardFull: function(board) {
      var foundSpace = false;
      for(var i=0;i<board.length;i++) {
        if(board[i] === " ") {
          foundSpace = true;
          break;
        }
      }
      if(foundSpace == true) {
        return false;
      } else {
        return true;
      }
    },

    flip: function(board, row, col) {
      var index = rev.rowColToIndex(board, row, col);
      var arr = board;
      if(board[index] == 'X') {
        arr[index] = 'O';
      } else if( board[index] == 'O') {
        arr[index] = 'X';
      }
      return arr;
    },

    flipCells: function(board, cellsToFlip) {
      var arr = [];
      for(var i=0;i<cellsToFlip.length;i++) {
        for(var j=0;j<cellsToFlip[i].length; j++) {
          for(var k=0;k<cellsToFlip[i][j].length; k++) {
            var row = cellsToFlip[i][j][k];
            var col = cellsToFlip[i][j][k+1];
            var index = rev.rowColToIndex(board, row, col);
            arr.push(index);
            break;
          }
        }
      }
      for(var i=0;i<arr.length;i++) {

        if(board[arr[i]] == 'X') {
          board[arr[i]] = 'O';
        } else if (board[arr[i]] == 'O') {
          board[arr[i]] = 'X';
        }
      } return board;
    },

  getCellsToFlip: function(board, lastRow, lastCol) {
    lastRow = lastRow + 1;
    lastCol = lastCol + 1;


    // could copy the board and move the places that are there into the correct indices for a normal board, then play like that

    var newArray = rev.createNewArray(board);

    var ind = rev.rowColToIndex(newArray, lastRow, lastCol);
    var letter = newArray[ind];
     var rowCheck;
     var colCheck;


     var indexCheck;

     var finalFlips = [];

     for (var rowDir = -1; rowDir <= 1; rowDir++) {

            for (var colDir = -1; colDir <= 1; colDir++) {

                if (rowDir === 0 && colDir === 0) {
                    continue;
                }

                rowCheck = lastRow + rowDir;
                colCheck = lastCol + colDir;
                var possibleFlips = [];

                indexCheck = rev.rowColToIndex(newArray, rowCheck, colCheck);
                while (rev.isValidPosition(newArray, rowCheck, colCheck) &&  newArray[indexCheck] != letter && newArray[indexCheck] != " ") {

                    possibleFlips.push([rowCheck-1, colCheck-1]);
                  rowCheck += rowDir;
                   colCheck += colDir;
                   indexCheck = rev.rowColToIndex(newArray, rowCheck, colCheck);
               }

               if (possibleFlips.length) {

                   if (rev.isValidPosition(newArray, rowCheck, colCheck) && newArray[indexCheck] != " " && newArray[indexCheck] === letter) {
                        finalFlips.push(possibleFlips);
                   }
               }
           }
       }

       return finalFlips;

  },

  isValidPosition: function(board, row, col) {
      var size = Math.sqrt(board.length);
        return (row > 0 && row < size) && (col > 0 && col < size);
  },

  createNewArray: function(board) {
    var size = Math.sqrt(board.length);
    var newArray = new Array((size*size) + ((size*2)+1));
    var newLen = board.length + ((size*2)+1);
    var newSize = Math.sqrt(newLen);
    for(var i=0;i<board.length;i++) {
      if(board[i] != " ") {
        var color = board[i];
        var obj = rev.indexToRowCol(board,i);
        var rowX = obj.row + 1;
        var colX = obj.col + 1;
        var newInd = rev.rowColToIndex(newArray, rowX, colX);
        newArray[newInd] = color;
      }
    }

    for(var a=0;a<newArray.length;a++) {
      if(newArray[a] === undefined) {
        newArray[a] = " ";
      }
    }
    for(var n=0;n<newArray.length;n++) {
      if(newArray[n] != " ") {
        var objNew = rev.indexToRowCol(newArray, n);
      }
    }

    return newArray;
  },

  isValidMove: function(board, letter, row, col) {
    row = row + 1;
    col = col + 1;

    var newArray = rev.createNewArray(board);

     var rowCheck;
     var colCheck;

     for(var n=0;n<newArray.length;n++) {
       if(newArray[n] != " ") {
         var objNew = rev.indexToRowCol(newArray, n);
       }
     }
     var indexCheck;

     for (var rowDir = -1; rowDir <= 1; rowDir++) {

            for (var colDir = -1; colDir <= 1; colDir++) {

                // dont check the actual position
                if (rowDir === 0 && colDir === 0) {
                    continue;
                }

                rowCheck = row + rowDir;
                colCheck = col + colDir;

                var itemFound = false;

                indexCheck = rev.rowColToIndex(newArray, rowCheck, colCheck);
                while (rev.isValidPosition(newArray, rowCheck, colCheck) &&  newArray[indexCheck] != letter && newArray[indexCheck] != " ") {
                  rowCheck += rowDir;
                   colCheck += colDir;
                   indexCheck = rev.rowColToIndex(newArray, rowCheck, colCheck);
                   // item found
                   itemFound = true;
               }

               if (itemFound) {

                   if (rev.isValidPosition(newArray, rowCheck, colCheck) && newArray[indexCheck] != " " && newArray[indexCheck] === letter) {
                       return true;
                   }
               }
           }
       }return false;


    if(board[index] == " " && index<board.length) {
      return true;
    } else {
      return false;
    }



  },

  isValidMoveAlgebraicNotation: function(board, letter, algebraicNotation) {
    var arg = rev.algebraicToRowCol(algebraicNotation);
    var index = rev.rowColToIndex(board, arg.row, arg.col);
    if(rev.isValidMove(board, letter, arg.row, arg.col)) {
      return true;
    } return false;
    if(index < board.length && board[index] == " ") {
      return true;
    } else {
      return false;
    }
  },

  getLetterCounts: function(board) {
    var xCount = 0;
    var oCount = 0;

    for(var i=0;i<arguments.length;i++) {
    }
    for(var i=0;i<board.length;i++) {
      if(board[i] == 'X') {
        xCount += 1;
      } else if (board[i] == 'O') {
        oCount += 1;
      }
    }
    return obj = {
      X: xCount,
      O: oCount
    };

  },

  getValidMoves: function(board, letter) {

    var mainArray = [];

        for(var i=0;i<board.length;i++) {
          if(board[i] == " ") {

            var obj = rev.indexToRowCol(board, i);

            if(rev.isValidMove(board, letter, obj.row, obj.col) ) {
              var arr = [];
              arr.push(obj.row);
              arr.push(obj.col);
              mainArray.push(arr);
            }
          }
        }
        return mainArray;

  },


}

module.exports = rev;
// var foo = require('./reversi.js');
// foo.repeat('hi', 6);
