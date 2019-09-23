const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

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
      return board[2];
    } else {
      return 0;
    }
  };

  /* Returns the number of the player that has won the game,
  3 if the game is a tie or
  0 if the game is still in progress*/
  const checkForWinner = () => {
    if (checkRows() !== 0 || checkColumns() !== 0 || checkDiagonals() !== 0) {
      return checkRows() + checkColumns() + checkDiagonals();
    } else if (!board.includes(0)) {
      return 3;
    } else {
      return 0;
    }
  };

  const resetBoard = () => (board = [0, 0, 0, 0, 0, 0, 0, 0, 0]);

  return { getBoard, makePlay, checkForWinner, resetBoard };
})();

const playerFactory = (number, name, score = 0) => {
  return { number, name, score };
};

const match = (() => {
  let playerOne = playerFactory(1, "Player 1");
  let playerTwo = playerFactory(2, "Player 2");

  const getPlayerOneName = () => playerOne.name;
  const getPlayerTwoName = () => playerTwo.name;
  const getPlayerOneScore = () => playerOne.score;
  const getPlayerTwoScore = () => playerTwo.score;

  const startNew = (playerOneName = "Player 1", playerTwoName = "Player 2") => {
    playerOne = playerFactory(1, playerOneName);
    playerTwo = playerFactory(2, playerTwoName);
  };

  const declareRoundWinner = playerNumber => {
    playerNumber === 1 ? playerOne.score++ : playerTwo.score++;
  };

  return {
    startNew,
    declareRoundWinner,
    getPlayerOneName,
    getPlayerTwoName,
    getPlayerOneScore,
    getPlayerTwoScore
  };
})();

const renderBoard = () => {
  //Clears the board
  game.getBoard().forEach((cell, index) => {
    if ($(`div[data-id='${index}']`).hasChildNodes())
      $(`div[data-id='${index}']`).removeChild(
        $(`div[data-id='${index}']`).firstChild
      );
  });

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

const gameController = (() => {
  let playerTurn = 2;
  const getPlayerTurn = () => {
    return playerTurn === 2 ? (playerTurn = 1) : (playerTurn = 2);
  };

  const makePlay = cell => {
    game.makePlay(cell, getPlayerTurn());
    renderBoard();
    if (game.checkForWinner() !== 0) {
      if (game.checkForWinner() === 3) {
        $(".result").style.display = "block";
        $(".result").textContent = "Its a tie!";
        //replaces reset button with play again
        $(".action-container").removeChild($(".action-container").firstChild);
        $(".action-container").insertBefore(
          getActionButton("play again"),
          $(".action-container").firstChild
        );
      } else {
        let winnerName;
        game.checkForWinner() === 1
          ? (winnerName = match.getPlayerOneName())
          : (winnerName = match.getPlayerTwoName());
        //Logs the result of the round
        match.declareRoundWinner(game.checkForWinner());
        //Renders the result in the score-board
        $(".player-one-score").textContent = match.getPlayerOneScore();
        $(".player-two-score").textContent = match.getPlayerTwoScore();
        $(".result").style.display = "block";
        $(".result").textContent = `${winnerName} has won the game! 🎉`;
        /*Removes listeners so the players can no-longer play
        when the round is over*/
        Array.from($$(".cell")).forEach(cell => {
          cell.removeEventListener("click", makePlayEventHandler);
        });
        //replaces reset button with play again
        $(".action-container").removeChild($(".action-container").firstChild);
        $(".action-container").insertBefore(
          getActionButton("play again"),
          $(".action-container").firstChild
        );
      }
    }
  };

  const initialize = () => {
    game.resetBoard();
    renderBoard();
    $(".action-container").appendChild(getActionButton("start"));
  };

  return { initialize, makePlay };
})();

gameController.initialize();

//Event Handlers
function makePlayEventHandler(event) {
  if (!event.target.hasChildNodes())
    gameController.makePlay(event.target.dataset.id);
}

function startMatchEventHandler() {
  Array.from($$(".cell")).forEach(cell => {
    cell.addEventListener("click", makePlayEventHandler);
  });

  while ($(".action-container").hasChildNodes())
    $(".action-container").removeChild($(".action-container").firstChild);
  $(".action-container").appendChild(getActionButton("reset"));
  $(".action-container").appendChild(getActionButton("new match"));

  let playerOneName = "Player 1";
  let playerTwoName = "Player 2";
  if ($("input#player-one").value !== "")
    playerOneName = $("input#player-one").value;
  if ($("input#player-two").value !== "")
    playerTwoName = $("input#player-two").value;

  match.startNew(playerOneName, playerTwoName);
  $(".player-one-name").textContent = playerOneName;
  $(".player-two-name").textContent = playerTwoName;
  $(".player-form").style.display = "none";
  $(".score").style.display = "grid";
}

function resetEventHandler() {
  game.resetBoard();
  renderBoard();
}

function newRoundEventHandler() {
  game.resetBoard();
  renderBoard();
  Array.from($$(".cell")).forEach(cell => {
    cell.addEventListener("click", makePlayEventHandler);
  });
  $(".action-container").removeChild($(".action-container").firstChild);
  $(".action-container").insertBefore(
    getActionButton("reset"),
    $(".action-container").firstChild
  );
  $(".result").style.display = "none";
}

function newMatchEventHandler() {
  game.resetBoard();
  renderBoard();
  //Clears the result in the score-board
  $(".player-one-score").textContent = match.getPlayerOneScore();
  $(".player-two-score").textContent = match.getPlayerTwoScore();
  $(".result").style.display = "none";
  $(".result").textContent = "";
  $(".score").style.display = "none";
  //Renders the player form
  $(".player-form").style.display = "block";
  //Removes the buttons, renders a start button
  while ($(".action-container").hasChildNodes())
    $(".action-container").removeChild($(".action-container").firstChild);
  $(".action-container").appendChild(getActionButton("start"));
  /*Removes listeners so the players can no-longer play
  when the match is over*/
  Array.from($$(".cell")).forEach(cell => {
    cell.removeEventListener("click", makePlayEventHandler);
  });
}

function getActionButton(action) {
  const button = document.createElement("button");
  switch (action) {
    case "start":
      button.id = "start";
      button.textContent = "Start";
      button.addEventListener("click", startMatchEventHandler);
      break;

    case "reset":
      button.id = "reset";
      button.textContent = "Reset";
      button.addEventListener("click", resetEventHandler);
      break;

    case "play again":
      button.id = "play-again";
      button.textContent = "Play Again";
      button.addEventListener("click", newRoundEventHandler);
      break;

    case "new match":
      button.id = "new-match";
      button.textContent = "New Match";
      button.addEventListener("click", newMatchEventHandler);

    default:
      break;
  }
  return button;
}
