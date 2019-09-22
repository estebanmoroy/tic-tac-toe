const game = (() => {
  let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  const getBoard = () => board;

  const makePlay = (cell, playerNumber) => {
    board[cell] = playerNumber;
  };

  const checkRows = () => {
    if (board[0] === board[1] && board[0] === board[2]) {
      return board[0];
    } else if (board[3] === board[4] && board[3] === board[5]) {
      return board[3];
    } else if (board[6] === board[7] && board[6] === board[8]) {
      return board[6];
    } else {
      return 0;
    }
  };

  const checkColumns = () => {
    if (board[0] === board[3] && board[0] === board[6]) {
      return board[0];
    } else if (board[1] === board[4] && board[1] === board[7]) {
      return board[1];
    } else if (board[2] === board[5] && board[2] === board[8]) {
      return board[2];
    } else {
      return 0;
    }
  };

  const checkDiagonals = () => {
    if (board[0] === board[4] && board[0] === board[8]) {
      return board[0];
    } else if (board[2] === board[4] && board[2] === board[6]) {
      return board[1];
    } else {
      return 0;
    }
  };

  /* Returns the number of the player that has won the game
  or 0 if the game is still in progress*/
  const checkForWinner = () => {
    return checkRows() !== 0 || checkColumns() !== 0 || checkDiagonals() !== 0
      ? checkRows() + checkColumns() + checkDiagonals()
      : 0;
  };

  const resetBoard = () => (board = [0, 0, 0, 0, 0, 0, 0, 0, 0]);

  return { getBoard, makePlay, checkForWinner, resetBoard };
})();

const render = () => {
  const makeChip = playerValue => {
    const chip = document.createElement("div");
    switch (playerValue) {
      case 1:
        chip.classList.add("player-one");
        chip.textContent = "X";
        return chip;
        break;
      case 2:
        chip.classList.add("player-two");
        chip.textContent = "O";
        return chip;
      default:
        break;
    }
  };

  game.getBoard().forEach((cell, index) => {
    if (cell !== 0 && !$(`div[data-id='${index}']`).hasChildNodes())
      $(`div[data-id='${index}']`).appendChild(makeChip(cell));
  });
};

const gameManager = (() => {
  let playerTurn = 2;
  const getPlayerTurn = () => {
    return playerTurn === 2 ? (playerTurn = 1) : (playerTurn = 2);
  };

  const makePlay = cell => {
    game.makePlay(cell, getPlayerTurn());
    render();
    if (game.checkForWinner() !== 0) {
      //TO DO: Display winner's name on the result class
      //TO DO: Check logic for ties!
    }
  };
  return { makePlay };
})();

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
