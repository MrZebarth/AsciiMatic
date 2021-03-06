module.exports = {
  boardSize: 8,
  sunkShips: 0,
  board: [],
  ships: {
    destroyer: {
      location: [
        // [x, y]
        [],
        [],
      ],
      hits: [false, false, false],
      length: 2,
    },
    cruiser: {
      location: [
        // [x, y]
        [],
        [],
        [],
      ],
      hits: [false, false, false],
      length: 3,
    },
    battleShip: {
      location: [
        // [x, y]
        [],
        [],
        [],
        [],
      ],
      hits: [false, false, false, false],
      length: 4,
    },
  },

  startGame: function () {
    this.resetShips();
    this.generateEmptyBoard();
    this.generateShipLocations();
  },

  generateEmptyBoard: function () {
    this.board = [];
    for (let i = 0; i < this.boardSize; i++) {
      this.board.push(new Array(this.boardSize).fill(0));
    }
  },

  resetShips: function () {
    this.sunkShips = 0;
    Object.entries(this.ships).forEach((ship) => {
      ship.hits = new Array(ship.length).fill(false);
    });
  },

  generateShipLocations: function () {
    // TODO: !!!!!!!!!! FIX THIS SERIOUS PERFORMANCE ISSUE !!!!!!!!!!
    do {
      this.generateShip(this.ships.battleShip);
      this.generateShip(this.ships.cruiser);
      this.generateShip(this.ships.destroyer);
    } while (this.collision());
  },

  generateShip: function (ship) {
    const direction = Math.floor(Math.random() * 2);
    let row, col;
    if (direction === 1) {
      // horizontal
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - ship.length + 1));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - ship.length + 1));
      col = Math.floor(Math.random() * this.boardSize);
    }

    for (let i = 0; i < ship.length; i++) {
      if (direction === 1) {
        // horizontal
        ship.location[i] = [row, col + i];
        this.board[col + i][row]++;
      } else {
        ship.location[i] = [row + i, col];
        this.board[col][row + i]++;
      }
    }
  },

  collision: function () {
    for (let y = 0; y < this.boardSize; y++) {
      for (let x = 0; x < this.boardSize; x++) {
        if (this.board[y][x] >= 2) return true;
      }
    }
    return false;
  },

  fire: function (coordinates) {
    if (coordinates.length !== 2) return 'Incorrect input!';
    coordinates = coordinates.split('');
    if (!coordinates[0].match(/[a-zA-Z]/) || !coordinates[1].match(/^\d+$/))
      return 'Incorrect input!';

    const yCoord = coordinates[0].toUpperCase().charCodeAt(0) - 65;
    const xCoord = parseInt(coordinates[1]);
    if (xCoord >= 8 || yCoord >= 8) return 'Incorrect input!';

    switch (this.board[yCoord][xCoord]) {
      case 0:
        // miss
        this.board[yCoord][xCoord]--;
        return 'Oof! Ya missed.';
      case 1:
        // hit
        this.board[yCoord][xCoord]++;
        return this.updateShipHit(xCoord, yCoord);
      case -1:
        // already missed here
        return "Oi Matey! You already missed 'ere!";
      default:
        // already hit here
        return "Oi Matey! You already hit 'ere!";
    }
  },

  updateShipHit: function (xCoord, yCoord) {
    console.log(xCoord, yCoord);
    const shipKeys = Object.keys(this.ships);
    let hitShipKey = '';
    for (let i = 0; i < shipKeys.length; i++) {
      console.log(this.ships[shipKeys[i]].location);
      // loop through ships
      const currShip = this.ships[shipKeys[i]];
      for (let j = 0; j < currShip.length; j++) {
        // loop through current ship's coordinates
        if (
          currShip.location[j][0] === xCoord && // compare x-coord
          currShip.location[j][1] === yCoord // compare y-coord
        ) {
          console.log('HIT!', xCoord, yCoord);
          currShip.hits[j] = true;
          hitShipKey = shipKeys[i];
        }
      }
    }
    if (this.ships[hitShipKey].hits.every((hit) => hit === true)) {
      // sunk
      this.sunkShips++;
      return 'Argh! You sunk my ship!';
    } else {
      return 'Argh! You hit my ship!';
    }
  },

  drawBoard: function () {
    let topRow = ['\\'];
    let boardRows = [];
    for (let i = 0; i < this.boardSize; i++) {
      topRow.push(`\t${i}`);
      let currRow = [];
      currRow.push(`${String.fromCharCode(i + 65)}\t`);
      for (let j = 0; j < this.boardSize; j++) {
        const state = this.board[i][j];
        switch (state) {
          case 0:
            // nothing
            currRow.push('?\t');
            break;
          case 1:
            // ship is here
            currRow.push('?\t');
            break;
          case -1:
            // miss
            currRow.push('O\t');
            break;
          case 2:
            // hit
            currRow.push('X\t');
            break;
        }
      }
      currRow.push('\n');
      boardRows.push(currRow.join(''));
    }
    boardRows = boardRows.join('');
    topRow.push('\n');
    topRow.push(boardRows);
    return topRow.join('');
  },
};
