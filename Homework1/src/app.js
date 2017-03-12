// app.js
var rev = require('./reversi.js');
const readlineSync = require('readline-sync');
var fs = require('fs');

if(process.argv[2] != null) {
  fs.readFile(process.argv[2], 'utf8', function(err, data) {
   if (err) {
    console.log('uh oh', err);
   } else {
     main(data);

   }
  });

  // interactive computer vs player game
} else {
  var width = readlineSync.question('How wide should the board be? (even numbers between 4 and 26, inclusive)\n> ');
  var filterInt = function(value) {
    if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
      return Number(value);
    return NaN;
  }
  while((filterInt(width) < 4 || filterInt(width) >26) || !(filterInt(width) % 2 == 0)) {
    width = readlineSync.question('How wide should the board be? (even numbers between 4 and 26, inclusive)\n> ');
  }
  var color = readlineSync.question('Pick your letter: X (black) or O (white)\n> ');
  while(!(color === 'X' || color === 'x' || color === 'O' || color === 'o')) {
    color = readlineSync.question('Pick your letter: X (black) or O (white)\n> ');
  }
  console.log('Player is ' + color + '\n');
  var compColor;
  if(color == 'X') {
    compColor = 'O';
  } else if(color == 'O') {
    compColor = 'X';
  }

  const b1 = rev.generateBoard(filterInt(width), filterInt(width), " ");
  var size = Math.sqrt(b1.length);

  const b2 = rev.setBoardCell(b1, "O", (size/2)-1, (size/2)-1);
  const b3 = rev.setBoardCell(b2, "X", (size/2)-1, (size/2));
  const b4 = rev.setBoardCell(b3, "X", (size/2), (size/2)-1);
  const board = rev.setBoardCell(b4, "O", (size/2), (size/2));
  console.log(rev.boardToString(board));

  var brd = board.slice();
  var countObj;
  while(!rev.isBoardFull(brd)) {
      if(rev.getValidMoves(brd, color).length == 0) {

        var pass = readlineSync.question('No valid moves, press <ENTER> to pass\n');
        // var enter1 = readlineSync.question("\nPress <ENTER> to show computer's move..");
        var validMoves1 = rev.getValidMoves(brd, compColor);
        if( validMoves1 == null) {
          var pass = readlineSync.question("\nNo valid moves.  Press <ENTER> to Pass.");
          console.log('\n');
        } else {
          var validRow1 = validMoves1[0][0];
          var validCol1 = validMoves1[0][1];
          brd = rev.setBoardCell(brd, compColor, validRow1, validCol1);
          var compArr1 = rev.getCellsToFlip(brd, validRow1, validCol1);
          if(compArr1.length) {
            for(var t1=0;t1<compArr1.length;t1++) {
              for(var s1=0;s1<compArr1[t1].length;s1++) {
                var r11 = compArr1[t1][s1][0];
                var c11 = compArr1[t1][s1][1];
                brd = rev.flip(brd, r11, c11);
              }
            }
          }
        }
        console.log('\n' + rev.boardToString(brd) + '\n');
        countObj = rev.getLetterCounts(brd);
        console.log('Score\n=====\nX: ' + countObj.X + '\nO: ' + countObj.O);
      } else {
        var move = readlineSync.question("\nWhat's your move\n> ");

        var alg = rev.algebraicToRowCol(move);
        if(alg == undefined || !(rev.isValidMoveAlgebraicNotation(brd, color, move) && rev.isValidMove(brd, color, alg.row, alg.col))) {
          console.log("\nINVALID MOVE. Your move should be: \n* in a letter-number format\n* specify an exisiting empty cell\n* flip at least one of your opponent's pieces\n");

        } else {
          if(rev.isValidMoveAlgebraicNotation(brd, color, move)) {
            brd = rev.setBoardCell(brd, color, alg.row, alg.col);
            var arr = rev.getCellsToFlip(brd, alg.row, alg.col);
            if(arr.length) {
              for(var x=0;x<arr.length;x++) {
                for(var y=0;y<arr[x].length;y++) {
                  var r = arr[x][y][0];
                  var c = arr[x][y][1];
                  brd = rev.flip(brd, r, c);
                }
              }
            }
            console.log('\n' + rev.boardToString(brd) + '\n');
            countObj = rev.getLetterCounts(brd);
            console.log('Score\n=====\nX: ' + countObj.X + '\nO: ' + countObj.O);
            if(rev.isBoardFull(brd)) {
              break;
            }
          // computer's move
          if(rev.getValidMoves(brd, compColor).length == 0 && rev.getValidMoves(brd, color).length < 0) {

            var pass = readlineSync.question('\nNo valid moves, press <ENTER> to pass\n');
            var move = readlineSync.question("What's your move\n> ");

            var alg = rev.algebraicToRowCol(move);
            if(alg == undefined || !(rev.isValidMoveAlgebraicNotation(brd, color, move) && rev.isValidMove(brd, color, alg.row, alg.col))) {
              console.log("\nINVALID MOVE. Your move should be: \n* in a letter-number format\n* specify an exisiting empty cell\n* flip at least one of your opponent's pieces\n");
            }   else {
              if(rev.isValidMoveAlgebraicNotation(brd, color, move)) {
                brd = rev.setBoardCell(brd, color, alg.row, alg.col);
                var arr = rev.getCellsToFlip(brd, alg.row, alg.col);
                if(arr.length) {
                  for(var x=0;x<arr.length;x++) {
                    for(var y=0;y<arr[x].length;y++) {
                      var r = arr[x][y][0];
                      var c = arr[x][y][1];
                      brd = rev.flip(brd, r, c);
                    }
                  }
                }
                console.log('\n' + rev.boardToString(brd) + '\n');
                countObj = rev.getLetterCounts(brd);
                console.log('Score\n=====\nX: ' + countObj.X + '\nO: ' + countObj.O);
                if(rev.isBoardFull(brd)) {
                  break;
                }
              }
            }
          }
          var oneSpot = 0;
          for(var q =0;q<board.legnth;q++) {
            if(board[q] == " ") {
              oneSpot += 1;
            }
          }
          var enter = readlineSync.question("\nPress <ENTER> to show computer's move..");
          var oneSpot = 0;
          for(var q =0;q<brd.length;q++) {
            if(brd[q] == " ") {
              oneSpot += 1;
            }
          }
          if((rev.getValidMoves(brd, compColor).length == 0 && rev.getValidMoves(brd, color).length == 0) || (rev.getValidMoves(brd, compColor).length == 0) && oneSpot == 1)  {
            console.log('No more valid moves. Game is over');
            break;
          }
          var validMoves = rev.getValidMoves(brd, compColor);
          if( validMoves == null) {
            var pass = readlineSync.question("\nNo valid moves.  Press <ENTER> to Pass.");
            console.log('\n');
          } else {
            var validRow = validMoves[0][0];
            var validCol = validMoves[0][1];
            brd = rev.setBoardCell(brd, compColor, validRow, validCol);
            var compArr = rev.getCellsToFlip(brd, validRow, validCol);
            if(compArr.length) {
              for(var t=0;t<compArr.length;t++) {
                for(var s=0;s<compArr[t].length;s++) {
                  var r1 = compArr[t][s][0];
                  var c1 = compArr[t][s][1];
                  brd = rev.flip(brd, r1, c1);
                }
              }
            }
          }
          console.log('\n' + rev.boardToString(brd) + '\n');
          countObj = rev.getLetterCounts(brd);
          console.log('Score\n=====\nX: ' + countObj.X + '\nO: ' + countObj.O );
        //  console.log('\n');
        }
      }
    }
  }
  if(color == 'X') {
    if(countObj.X > countObj.O) {
      console.log('You won!');
    } else if(countObj.O > countObj.X) {
      console.log('You lost!');
    } else if(countObj.X == countObj.O) {
      console.log("It's a tie");
    }
  } else if (color == 'O') {
    if(countObj.O > countObj.X) {
      console.log('You won!');
    } else if(countObj.X > countObj.O) {
      console.log('You lost!');
    } else if(countObj.X == countObj.O) {
      console.log("It's a tie");
    }
  }
}


// config file
function main(data) {
  var obj = JSON.parse(data);
  var firstPlayerMoves = [];
  var secondPlayerMoves = [];
  var player;
  var comp;
  var board = obj.boardPreset.board;
  if(obj.boardPreset.playerLetter == 'X') {
    firstPlayerMoves = obj.scriptedMoves.player;
    secondPlayerMoves = obj.scriptedMoves.computer;
    player = 'X';
    comp = 'O';
  } else if(obj.boardPreset.playerLetter == 'O') {
    firstPlayerMoves = obj.scriptedMoves.computer;
    secondPlayerMoves = obj.scriptedMoves.player;
    player = 'O';
    comp = 'X';
  }
  var u = 0;
  console.log('\nPlayer is ' + obj.boardPreset.playerLetter);
  console.log('\n' + rev.boardToString(obj.boardPreset.board) + '\n');
  var countObj;

  while(!rev.isBoardFull(obj.boardPreset.board)  && !(u == obj.scriptedMoves.player.length) ) {
    var move1 = readlineSync.question("Press <ENTER> to play next move\n");
    console.log('\nPlayer is ' + obj.boardPreset.playerLetter);
    var play = rev.algebraicToRowCol(obj.scriptedMoves.player[u]);
    console.log(obj.scriptedMoves.player[u]);
    if(rev.isValidMoveAlgebraicNotation(board, obj.boardPreset.playerLetter, obj.scriptedMoves.player[u])) {
      board = rev.setBoardCell(board, obj.boardPreset.playerLetter, play.row, play.col);
      var arr = rev.getCellsToFlip(board, play.row, play.col);
      if(arr.length) {
        for(var x=0;x<arr.length;x++) {
          for(var y=0;y<arr[x].length;y++) {
            var r = arr[x][y][0];
            var c = arr[x][y][1];
            board = rev.flip(board, r, c);
          }
        }
      }
      console.log('\n' + rev.boardToString(board) + '\n');
      countObj = rev.getLetterCounts(board);
      console.log('Score\n=====\nX: ' + countObj.X + '\nO: ' + countObj.O);
      if(rev.isBoardFull(board)) {
        break;
      }
    }

    var opp;
    if(obj.boardPreset.playerLetter=='X') {
      opp = 'O';
    } else {
      opp = 'X';
    }
    var move2 = readlineSync.question("\nPress <ENTER> to play next move\n");
    console.log('Player is ' + opp);
    var play2 = rev.algebraicToRowCol(obj.scriptedMoves.computer[u]);

    if(rev.isValidMoveAlgebraicNotation(board, opp, obj.scriptedMoves.computer[u])) {
      board = rev.setBoardCell(board, opp, play2.row, play2.col);
      var arr1 = rev.getCellsToFlip(board, play2.row, play2.col);
      if(arr1.length) {
        for(var x1=0;x1<arr1.length;x1++) {
          for(var y1=0;y1<arr1[x1].length;y1++) {
            var r1 = arr1[x1][y1][0];
            var c1 = arr1[x1][y1][1];
            board = rev.flip(board, r1, c1);
          }
        }
      }
      console.log('\n' + rev.boardToString(board) + '\n');
      countObj = rev.getLetterCounts(board);
      console.log('Score\n=====\nX: ' + countObj.X + '\nO: ' + countObj.O);
      if(rev.isBoardFull(board)) {
        break;
      }
    }
    u += 1;
  }

  if(obj.boardPreset.playerLetter == 'X') {
    if(countObj.X > countObj.O) {
      console.log('\nYou won!');
    } else if(countObj.O > countObj.X) {
      console.log('\nYou lost!');
    } else if(countObj.X == countObj.O) {
      console.log("\nIt's a tie");
    }
  } else if (color == 'O') {
    if(countObj.O > countObj.X) {
      console.log('\nYou won!');
    } else if(countObj.X > countObj.O) {
      console.log('\nYou lost!');
    } else if(countObj.X == countObj.O) {
      console.log("\nIt's a tie");
    }

  }

}
