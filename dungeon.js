var BOARDSIZE = 45; //45
var MAXPASSAGELENGTH = 7; //7
var MINPASSAGELENGTH = 4; //2
var MAXROOMSIZE = 8; //8
var MINROOMSIZE = 3; //3
var MAXROOMS = 13; //15
var MINROOMS = 7; //10
var WEAPONS = [{ name: "bare hands", strength: 0 }, { name: "pointed stick", strength: 10 }];
var MONSTERS = [{ name: "Ubiquitous Bat", HP: 50 }];

var Status = React.createClass({
  displayName: "Status",

  render: function render() {
    return React.createElement(
      "div",
      { id: "status" },
      React.createElement(
        "p",
        null,
        "Floor: ",
        this.props.level
      ),
      React.createElement(
        "p",
        null,
        "Weapon: ",
        this.props.playerStats.weapon.name
      ),
      React.createElement(
        "p",
        null,
        "Current HP: ",
        this.props.playerStats.currHP
      ),
      React.createElement(
        "p",
        null,
        "Level up in (num) EXP"
      ),
      React.createElement(
        "div",
        { id: "statuslog" },
        this.props.statusLog
      )
    );
  }
});

var Screen = React.createClass({
  displayName: "Screen",

  componentDidUpdate: function componentDidUpdate() {
    var canvas = ReactDOM.findDOMNode(this.refs.gridCanvas);
    canvas.width = BOARDSIZE * 10;
    canvas.height = BOARDSIZE * 10;
    var ctx = canvas.getContext("2d");
    //draw the board
    for (var i = 0; i < this.props.board.length; i++) {if (window.CP.shouldStopExecution(2)){break;}
      for (var j = 0; j < this.props.board.length; j++) {if (window.CP.shouldStopExecution(1)){break;}
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.fillStyle = this.props.board[i][j] ? "white" : "grey";
        ctx.lineWidth = 0.1;
        ctx.rect(i * 10, j * 10, 10, 10);
        ctx.fill();
        ctx.stroke();
      }
window.CP.exitedLoop(1);

    }
window.CP.exitedLoop(2);

    //place stairs
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.rect(this.props.stairPos.colPos * 10, this.props.stairPos.rowPos * 10, 10, 10);
    ctx.fill();
    ctx.stroke();
    //place player
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.rect(this.props.playerPos.colPos * 10, this.props.playerPos.rowPos * 10, 10, 10);
    ctx.fill();
    ctx.stroke();
  }, //componentDidUpdate

  render: function render() {
    return React.createElement(
      "div",
      { id: "screen" },
      React.createElement("canvas", { id: "gridCanvas", ref: "gridCanvas" })
    );
  }
}); //Screen

var Controls = React.createClass({
  displayName: "Controls",

  render: function render() {
    return React.createElement(
      "div",
      { id: "controls" },
      React.createElement(
        "button",
        { id: "up", onClick: this.handleMove },
        "\u2191"
      ),
      React.createElement(
        "button",
        { id: "left", onClick: this.handleMove },
        "\u2190"
      ),
      React.createElement(
        "button",
        { id: "right", onClick: this.handleMove },
        "\u2192"
      ),
      React.createElement(
        "button",
        { id: "down", onClick: this.handleMove },
        "\u2193"
      )
    );
  }, //render

  handleMove: function handleMove(e) {
    e.preventDefault();
    this.props.moveChar(event.target.id);
  } //handleMove
}); //Controls

var App = React.createClass({
  displayName: "App",

  getInitialState: function getInitialState() {
    return {
      board: [],
      level: 0,
      stairPos: { rowPos: 0, colPos: 0 },
      playerPos: { rowPos: 0, colPos: 0 },
      playerStats: {
        level: 1,
        maxHP: 50,
        currHP: 50,
        weapon: WEAPONS[0]
      },
      statusLog: []
    };
  }, //getInitialState

  componentDidMount: function componentDidMount() {
    this.boardSetup();
  }, //componentDidMount

  render: function render() {
    return React.createElement(
      "div",
      { id: "main" },
      React.createElement(Status, {
        level: this.state.level,
        playerStats: this.state.playerStats,
        statusLog: this.state.statusLog
      }),
      React.createElement(Screen, {
        board: this.state.board,
        stairPos: this.state.stairPos,
        playerPos: this.state.playerPos
      }),
      React.createElement(Controls, { moveChar: this.moveChar })
    );
  }, //render

  boardSetup: function boardSetup() {
    //get level
    var level = this.state.level;
    //create new blank board
    var tempBoard = [];
    for (var i = 0; i < BOARDSIZE; i++) {if (window.CP.shouldStopExecution(4)){break;}
      var col = [];
      for (var j = 0; j < BOARDSIZE; j++) {if (window.CP.shouldStopExecution(3)){break;}
        col.push(false);
      }
window.CP.exitedLoop(3);

      tempBoard.push(col);
    }
window.CP.exitedLoop(4);


    //dig starter room
    var startRow = this.randomNum(10, BOARDSIZE - 10);
    var startCol = this.randomNum(10, BOARDSIZE - 10);
    var startHeight = this.randomNum(MAXROOMSIZE, MINROOMSIZE);
    var startWidth = this.randomNum(MAXROOMSIZE, MINROOMSIZE);
    for (var i = startRow; i < startRow + startWidth; i++) {if (window.CP.shouldStopExecution(6)){break;}
      for (var j = startCol; j < startCol + startHeight; j++) {if (window.CP.shouldStopExecution(5)){break;}
        tempBoard[i][j] = true;
      }
window.CP.exitedLoop(5);

    }
window.CP.exitedLoop(6);


    //get number of remaining rooms to dig...
    var numRooms = this.randomNum(MINROOMS, MAXROOMS);
    //..and dig them
    for (var i = 0; i < numRooms; i++) {if (window.CP.shouldStopExecution(14)){break;}
      //get wall tile next to clear tile to dig from
      var wallFound = false;
      while (!wallFound) {if (window.CP.shouldStopExecution(7)){break;}
        //pick random tile
        var randCol = this.randomNum(1, BOARDSIZE - 2);
        var randRow = this.randomNum(1, BOARDSIZE - 2);
        //is it a wall tile?
        if (!tempBoard[randRow][randCol]) {
          //is it next to a clear tile?
          if (tempBoard[randRow - 1][randCol] || tempBoard[randRow][randCol - 1] || tempBoard[randRow][randCol + 1] || tempBoard[randRow + 1][randCol]) {
            wallFound = true;
            //determine direction to dig
            var direction;
            if (tempBoard[randRow - 1][randCol]) {
              direction = "right";
            } else if (tempBoard[randRow][randCol - 1]) {
              direction = "down";
            } else if (tempBoard[randRow][randCol + 1]) {
              direction = "up";
            } else if (tempBoard[randRow + 1][randCol]) {
              direction = "left";
            }
          }
        }
      }
window.CP.exitedLoop(7);
 //end of finding wall loop

      //determine length of passage to dig
      var passageLength = this.randomNum(MAXPASSAGELENGTH, MINPASSAGELENGTH);
      //determine new room size
      var roomHeight = this.randomNum(MAXROOMSIZE, MINROOMSIZE);
      var roomWidth = this.randomNum(MAXROOMSIZE, MINROOMSIZE);
      var roomRow;
      var roomCol;
      //dig
      try {
        switch (direction) {
          case "down":
            for (var j = 0; j < passageLength; j++) {if (window.CP.shouldStopExecution(8)){break;}
              tempBoard[randRow][randCol + j] = true;
            }
window.CP.exitedLoop(8);

            roomRow = this.randomNum(randRow - (roomWidth - 1), randRow);
            roomCol = randCol + passageLength;
            break;
          case "left":
            for (var j = 0; j < passageLength; j++) {if (window.CP.shouldStopExecution(9)){break;}
              tempBoard[randRow - j][randCol] = true;
            }
window.CP.exitedLoop(9);

            roomRow = randRow - (passageLength + (roomWidth - 1));
            roomCol = this.randomNum(randCol - roomHeight + 1, randCol);
            break;
          case "up":
            for (var j = 0; j < passageLength; j++) {if (window.CP.shouldStopExecution(10)){break;}
              tempBoard[randRow][randCol - j] = true;
            }
window.CP.exitedLoop(10);

            roomRow = this.randomNum(randRow - (roomWidth - 1), randRow);
            roomCol = randCol - passageLength - roomHeight + 1;
            break;
          case "right":
            for (var j = 0; j < passageLength; j++) {if (window.CP.shouldStopExecution(11)){break;}
              tempBoard[randRow + j][randCol] = true;
            }
window.CP.exitedLoop(11);

            roomRow = randRow + passageLength;
            roomCol = this.randomNum(randCol - roomHeight + 1, randCol);
            break;
          default:
            console.log("Tried to dig passage in invalid direction");
        }
        for (var k = roomRow; k < roomRow + roomWidth; k++) {if (window.CP.shouldStopExecution(13)){break;}
          for (var m = roomCol; m < roomCol + roomHeight; m++) {if (window.CP.shouldStopExecution(12)){break;}
            tempBoard[k][m] = true;
          }
window.CP.exitedLoop(12);

        }
window.CP.exitedLoop(13);

      } catch (err) {
        console.log("Room went out of bounds");
      }
    }
window.CP.exitedLoop(14);
 //end of room digging loop

    //place stairs
    var stairCol;
    var stairRow;
    //do not place stairs if on the final dungeon
    if (level < 4) {
      var stairsPlaced = false;
      while (!stairsPlaced) {if (window.CP.shouldStopExecution(15)){break;}
        stairCol = this.randomNum(0, BOARDSIZE - 1);
        stairRow = this.randomNum(0, BOARDSIZE - 1);
        if (
        //checking for clear space
        tempBoard[stairCol][stairRow] && //centre
        tempBoard[stairCol - 1][stairRow - 1] && //top left
        tempBoard[stairCol][stairRow - 1] && //top middle
        tempBoard[stairCol + 1][stairRow - 1] && //top right
        tempBoard[stairCol - 1][stairRow] && //left
        tempBoard[stairCol + 1][stairRow] && //right
        tempBoard[stairCol - 1][stairRow + 1] && //bottom left
        tempBoard[stairCol][stairRow + 1] && //bottom middle
        tempBoard[stairCol + 1][stairRow + 1] //bottom right
        ) {
            stairsPlaced = true;
          }
      }
window.CP.exitedLoop(15);

    }

    //place player
    var playerCol;
    var playerRow;
    var playerPlaced = false;
    while (!playerPlaced) {if (window.CP.shouldStopExecution(16)){break;}
      playerCol = this.randomNum(1, BOARDSIZE - 1);
      playerRow = this.randomNum(1, BOARDSIZE - 1);
      //ensure player is on free space
      if (tempBoard[playerCol][playerRow] && playerCol !== stairCol && playerRow !== stairRow) {
        playerPlaced = true;
      }
    }
window.CP.exitedLoop(16);


    //update status message
    var statusLog = this.state.statusLog;

    if (level === 0) {
      statusLog.push("Welcome to the dungeon! Find and kill the boss to win!");
    } else {
      statusLog.push("You head down the stairs...");
    }

    //update level counter
    level += 1;

    //board complete, set state
    this.setState({
      stairPos: { rowPos: stairRow, colPos: stairCol },
      playerPos: { rowPos: playerRow, colPos: playerCol },
      level: level,
      board: tempBoard,
      statusLog: statusLog
    });
  }, //boardSetup

  moveChar: function moveChar(dir) {
    //get current player loc from state
    var playerRow = this.state.playerPos.rowPos;
    var playerCol = this.state.playerPos.colPos;

    //movement and wall collision detection
    switch (dir) {
      case "up":
        if (this.state.board[playerCol][playerRow - 1]) {
          playerRow -= 1;
        } //add a "can't move" sound?
        break;
      case "left":
        if (this.state.board[playerCol - 1][playerRow]) {
          playerCol -= 1;
        }
        break;
      case "right":
        if (this.state.board[playerCol + 1][playerRow]) {
          playerCol += 1;
        }
        break;
      case "down":
        if (this.state.board[playerCol][playerRow + 1]) {
          playerRow += 1;
        }
        break;
      default:
        console.log("Tried to move in invalid direction");
    }

    //stair collision detection
    var stairRow = this.state.stairPos.rowPos;
    var stairCol = this.state.stairPos.colPos;
    if (playerRow === stairRow && playerCol === stairCol) {
      //character moved into stair tile
      this.handleStairs();
    } else {
      //update state with new position
      this.setState({
        playerPos: { rowPos: playerRow, colPos: playerCol }
      });
    }
  }, //moveChar

  handleStairs: function handleStairs() {
    if (confirm("Go down the stairs?")) {
      this.boardSetup();
      return;
      //update state with new position
    }
  }, //handleStairs

  randomNum: function randomNum(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  } //randomNum
});

ReactDOM.render(React.createElement(App, null), document.getElementById("root"));