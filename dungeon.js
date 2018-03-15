//board rendering parameters
var BOARDSIZE = 45; //45
var MAXPASSAGELENGTH = 7; //7
var MINPASSAGELENGTH = 4; //2
var MAXROOMSIZE = 8; //8
var MINROOMSIZE = 3; //3
var MAXROOMS = 15; //15
var MINROOMS = 10; //10
//items and monsters
var MAXITEM = 10; //# of items/monsters
var MINITEM = 6;
var WEAPONS = [{ name: "bare hands", strength: 0 }, //default when starting
{ name: "pointed stick", strength: 10 }, { name: "dagger", strength: 20 }, { name: "really cool sword", strength: 30 }, { name: "sharp slice of mango", strength: 40 }];
var MONSTERS = [{ name: "Ubiquitous Bat", HP: 40, attack: 10 }, { name: "Goblin", HP: 60, attack: 20 }, { name: "Cave Crocodile", HP: 80, attack: 30 }, { name: "Killer Rabbit", HP: 100, attack: 40 }, { name: "Dragon", HP: 200, attack: 80 //boss, 200/80
}];

//death screen
var Death = React.createClass({
  displayName: "Death",

  render: function render() {
    if (this.props.display) {
      return React.createElement(
        "div",
        { id: "deathmessage" },
        React.createElement(
          "p",
          null,
          "You died!"
        ),
        React.createElement(
          "button",
          { id: "restartdeath", onClick: this.playAgain },
          "Play again?"
        )
      );
    } else {
      return null;
    }
  }, //render

  playAgain: function playAgain(e) {
    e.preventDefault();
    this.props.resetGame();
  } //playAgain
});

//win screen
var Victory = React.createClass({
  displayName: "Victory",

  render: function render() {
    if (this.props.display) {
      return React.createElement(
        "div",
        { id: "winmessage" },
        React.createElement(
          "p",
          null,
          "You won!"
        ),
        React.createElement(
          "button",
          { id: "restartwin", onClick: this.playAgain },
          "Play again?"
        )
      );
    } else {
      return null;
    }
  }, //render

  playAgain: function playAgain(e) {
    e.preventDefault();
    this.props.resetGame();
  } //playAgain
});

//pops up when player can choose to go down stairs
var Stairs = React.createClass({
  displayName: "Stairs",

  render: function render() {
    if (this.props.display) {
      return React.createElement(
        "div",
        { id: "stairmessage" },
        React.createElement(
          "p",
          null,
          "Go down the stairs?"
        ),
        React.createElement(
          "button",
          { id: "stairyes", onClick: this.stairs },
          "Yes"
        ),
        React.createElement(
          "button",
          { id: "stairno", onClick: this.stairs },
          "No"
        )
      );
    } else {
      return null;
    }
  },

  stairs: function stairs(e) {
    e.preventDefault();
    this.props.handleStairs(e.target.id);
  }
});

var Status = React.createClass({
  displayName: "Status",

  render: function render() {
    var log = this.props.statusLog.map(function (item) {
      return React.createElement(
        "li",
        null,
        item
      );
    });
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
        "HP: ",
        this.props.playerStats.currHP,
        "/",
        this.props.playerStats.maxHP
      ),
      React.createElement(
        "p",
        null,
        "Level up in ",
        this.props.playerStats.toNextLevel,
        " EXP"
      ),
      React.createElement(
        "div",
        { id: "statuslog" },
        React.createElement(
          "ul",
          null,
          log
        )
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
    //draw board etc if player is still alive
    if (this.props.playerStats.currHP > 0) {
      //fill in background
      ctx.beginPath();
      ctx.fillStyle = "brown";
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fill();
      //get starting position to draw from
      var colStart = this.props.playerPos.colPos - 10;
      var rowStart = this.props.playerPos.rowPos - 10;
      //draw the board
      for (var i = 0; i < BOARDSIZE; i++) {if (window.CP.shouldStopExecution(2)){break;}if (window.CP.shouldStopExecution(2)){break;}
        for (var j = 0; j < BOARDSIZE; j++) {if (window.CP.shouldStopExecution(1)){break;}if (window.CP.shouldStopExecution(1)){break;}
          if (colStart + i < BOARDSIZE && rowStart + j < BOARDSIZE && colStart + i > 0 && rowStart + j > 0) {
            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.fillStyle = this.props.board[colStart + i][rowStart + j] ? "tan" : "brown";
            ctx.lineWidth = 0.1;
            ctx.rect(i * 20, j * 20, 20, 20);
            ctx.fill();
            ctx.stroke();
          }
        }
window.CP.exitedLoop(1);

window.CP.exitedLoop(1);

      }
window.CP.exitedLoop(2);

window.CP.exitedLoop(2);

      //place player - will always be at the centre
      ctx.beginPath();
      ctx.fillStyle = "green";
      ctx.rect(200, 200, 20, 20);
      ctx.fill();
      //place heals
      for (var i = 0; i < this.props.heals.length; i++) {if (window.CP.shouldStopExecution(3)){break;}if (window.CP.shouldStopExecution(3)){break;}
        if (this.props.heals[i].display) {
          ctx.beginPath();
          ctx.fillStyle = "purple";
          ctx.rect((this.props.heals[i].row - colStart) * 20, (this.props.heals[i].col - rowStart) * 20, 20, 20);
          ctx.fill();
        }
      }
window.CP.exitedLoop(3);

window.CP.exitedLoop(3);

      //place weapon
      if (this.props.weaponPos.display) {
        ctx.beginPath();
        ctx.fillStyle = "gold";
        ctx.rect((this.props.weaponPos.col - colStart) * 20, (this.props.weaponPos.row - rowStart) * 20, 20, 20);
        ctx.fill();
      }
      //place stairs
      ctx.beginPath();
      ctx.fillStyle = "red";
      ctx.rect((this.props.stairPos.colPos - colStart) * 20, (this.props.stairPos.rowPos - rowStart) * 20, 20, 20);
      ctx.fill();
      //place monsters
      for (var i = 0; i < this.props.monsters.length; i++) {if (window.CP.shouldStopExecution(4)){break;}if (window.CP.shouldStopExecution(4)){break;}
        if (this.props.monsters[i].display) {
          ctx.beginPath();
          ctx.fillStyle = this.props.monsters[i].species === "Dragon" ? "black" : "blue";
          ctx.rect((this.props.monsters[i].row - colStart) * 20, (this.props.monsters[i].col - rowStart) * 20, 20, 20);
          ctx.fill();
        }
      }
window.CP.exitedLoop(4);

window.CP.exitedLoop(4);

    } else {
      //basic death screen
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fill();
    }
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
    //don't move if game is over
    if (!this.props.isDead && !this.props.isWinner) {
      this.props.moveChar(event.target.id);
    }
  } //handleMove
}); //Controls

var App = React.createClass({
  displayName: "App",

  getInitialState: function getInitialState() {
    return {
      board: [],
      level: 0, //dungeon floor
      stairPos: { rowPos: 0, colPos: 0 },
      playerPos: { rowPos: 0, colPos: 0 },
      weaponPos: { rowPos: 0, colPos: 0, type: 0, display: true },
      playerStats: {
        level: 1,
        toNextLevel: 50,
        maxHP: 50,
        currHP: 50,
        baseAttack: 10,
        weapon: WEAPONS[0]
      },
      monsters: [],
      heals: [],
      statusLog: [],
      displayStairMessage: false,
      displayWinScreen: false,
      displayDeathScreen: false
    };
  }, //getInitialState

  componentDidMount: function componentDidMount() {
    this.boardSetup();
  }, //componentDidMount

  render: function render() {
    return React.createElement(
      "div",
      { id: "main" },
      React.createElement(Death, {
        display: this.state.displayDeathScreen,
        resetGame: this.resetGame
      }),
      React.createElement(Victory, {
        display: this.state.displayWinScreen,
        resetGame: this.resetGame
      }),
      React.createElement(Stairs, {
        display: this.state.displayStairMessage,
        handleStairs: this.handleStairs
      }),
      React.createElement(Status, {
        level: this.state.level,
        playerStats: this.state.playerStats,
        statusLog: this.state.statusLog
      }),
      React.createElement(Screen, {
        board: this.state.board,
        stairPos: this.state.stairPos,
        playerPos: this.state.playerPos,
        playerStats: this.state.playerStats,
        weaponPos: this.state.weaponPos,
        monsters: this.state.monsters,
        heals: this.state.heals
      }),
      React.createElement(Controls, {
        moveChar: this.moveChar,
        isDead: this.state.displayDeathScreen,
        isWinner: this.state.displayWinScreen
      })
    );
  }, //render

  boardSetup: function boardSetup() {
    //get level
    var level = this.state.level;
    //create new blank board
    var tempBoard = [];
    for (var i = 0; i < BOARDSIZE; i++) {if (window.CP.shouldStopExecution(6)){break;}if (window.CP.shouldStopExecution(6)){break;}
      var col = [];
      for (var j = 0; j < BOARDSIZE; j++) {if (window.CP.shouldStopExecution(5)){break;}if (window.CP.shouldStopExecution(5)){break;}
        col.push(false);
      }
window.CP.exitedLoop(5);

window.CP.exitedLoop(5);

      tempBoard.push(col);
    }
window.CP.exitedLoop(6);

window.CP.exitedLoop(6);


    //dig starter room
    var startRow = this.randomNum(10, BOARDSIZE - 10);
    var startCol = this.randomNum(10, BOARDSIZE - 10);
    var startHeight = this.randomNum(MAXROOMSIZE, MINROOMSIZE);
    var startWidth = this.randomNum(MAXROOMSIZE, MINROOMSIZE);
    for (var i = startRow; i < startRow + startWidth; i++) {if (window.CP.shouldStopExecution(8)){break;}if (window.CP.shouldStopExecution(8)){break;}
      for (var j = startCol; j < startCol + startHeight; j++) {if (window.CP.shouldStopExecution(7)){break;}if (window.CP.shouldStopExecution(7)){break;}
        tempBoard[i][j] = true;
      }
window.CP.exitedLoop(7);

window.CP.exitedLoop(7);

    }
window.CP.exitedLoop(8);

window.CP.exitedLoop(8);


    //get number of remaining rooms to dig...
    var numRooms = this.randomNum(MINROOMS, MAXROOMS);
    //..and dig them
    for (var i = 0; i < numRooms; i++) {if (window.CP.shouldStopExecution(16)){break;}if (window.CP.shouldStopExecution(16)){break;}
      //get wall tile next to clear tile to dig from
      var wallFound = false;
      while (!wallFound) {if (window.CP.shouldStopExecution(9)){break;}if (window.CP.shouldStopExecution(9)){break;}
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
window.CP.exitedLoop(9);

window.CP.exitedLoop(9);
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
            for (var j = 0; j < passageLength; j++) {if (window.CP.shouldStopExecution(10)){break;}if (window.CP.shouldStopExecution(10)){break;}
              tempBoard[randRow][randCol + j] = true;
            }
window.CP.exitedLoop(10);

window.CP.exitedLoop(10);

            roomRow = this.randomNum(randRow - (roomWidth - 1), randRow);
            roomCol = randCol + passageLength;
            break;
          case "left":
            for (var j = 0; j < passageLength; j++) {if (window.CP.shouldStopExecution(11)){break;}if (window.CP.shouldStopExecution(11)){break;}
              tempBoard[randRow - j][randCol] = true;
            }
window.CP.exitedLoop(11);

window.CP.exitedLoop(11);

            roomRow = randRow - (passageLength + (roomWidth - 1));
            roomCol = this.randomNum(randCol - roomHeight + 1, randCol);
            break;
          case "up":
            for (var j = 0; j < passageLength; j++) {if (window.CP.shouldStopExecution(12)){break;}if (window.CP.shouldStopExecution(12)){break;}
              tempBoard[randRow][randCol - j] = true;
            }
window.CP.exitedLoop(12);

window.CP.exitedLoop(12);

            roomRow = this.randomNum(randRow - (roomWidth - 1), randRow);
            roomCol = randCol - passageLength - roomHeight + 1;
            break;
          case "right":
            for (var j = 0; j < passageLength; j++) {if (window.CP.shouldStopExecution(13)){break;}if (window.CP.shouldStopExecution(13)){break;}
              tempBoard[randRow + j][randCol] = true;
            }
window.CP.exitedLoop(13);

window.CP.exitedLoop(13);

            roomRow = randRow + passageLength;
            roomCol = this.randomNum(randCol - roomHeight + 1, randCol);
            break;
          default:
            console.log("Tried to dig passage in invalid direction");
        }
        for (var k = roomRow; k < roomRow + roomWidth; k++) {if (window.CP.shouldStopExecution(15)){break;}if (window.CP.shouldStopExecution(15)){break;}
          for (var m = roomCol; m < roomCol + roomHeight; m++) {if (window.CP.shouldStopExecution(14)){break;}if (window.CP.shouldStopExecution(14)){break;}
            tempBoard[k][m] = true;
          }
window.CP.exitedLoop(14);

window.CP.exitedLoop(14);

        }
window.CP.exitedLoop(15);

window.CP.exitedLoop(15);

      } catch (err) {
        console.log("Room went out of bounds");
      }
    }
window.CP.exitedLoop(16);

window.CP.exitedLoop(16);
 //end of room digging loop

    //increment level, messages
    //monster types depend on level
    //update status message
    var statusLog = this.state.statusLog;

    if (level === 0) {
      statusLog.push("Welcome to the dungeon! Find and kill the dragon to win!");
    } else {
      statusLog.push("You head down the stairs...");
    }

    //place monsters
    var numMonsters = this.randomNum(MINITEM, MAXITEM);
    var monsterList = [];
    for (var i = 0; i < numMonsters; i++) {if (window.CP.shouldStopExecution(18)){break;}if (window.CP.shouldStopExecution(18)){break;}
      var monsterPlaced = false;
      while (!monsterPlaced) {if (window.CP.shouldStopExecution(17)){break;}if (window.CP.shouldStopExecution(17)){break;}
        var monsterCol = this.randomNum(1, BOARDSIZE - 1);
        var monsterRow = this.randomNum(1, BOARDSIZE - 1);
        if (tempBoard[monsterRow][monsterCol]) {
          monsterList.push({
            col: monsterCol,
            row: monsterRow,
            species: MONSTERS[level].name,
            HP: MONSTERS[level].HP,
            attack: MONSTERS[level].attack,
            display: true
          }); //true = undefeated
          monsterPlaced = true;
        }
      }
window.CP.exitedLoop(17);

window.CP.exitedLoop(17);

    }
window.CP.exitedLoop(18);

window.CP.exitedLoop(18);
 //end of monster placement loop

    //note: items etc may spawn on top of monsters. keep it that way?

    //place healing items
    var numHeals = this.randomNum(MINITEM, MAXITEM);
    var healList = [];
    for (var i = 0; i < numHeals; i++) {if (window.CP.shouldStopExecution(20)){break;}if (window.CP.shouldStopExecution(20)){break;}
      var healPlaced = false;
      while (!healPlaced) {if (window.CP.shouldStopExecution(19)){break;}if (window.CP.shouldStopExecution(19)){break;}
        var healCol = this.randomNum(1, BOARDSIZE - 1);
        var healRow = this.randomNum(1, BOARDSIZE - 1);
        if (tempBoard[healRow][healCol]) {
          healList.push({
            col: healCol,
            row: healRow,
            display: true
          });
          healPlaced = true;
        }
      }
window.CP.exitedLoop(19);

window.CP.exitedLoop(19);

    }
window.CP.exitedLoop(20);

window.CP.exitedLoop(20);


    //update level counter
    //after monster/item placement so arrays work properly
    //WEAPON[0] = no weapon (aka "bare hands")
    level += 1;

    //place boss monster if on final floor
    if (level === 4) {
      var bossCol;
      var bossRow;
      var bossPlaced = false;
      while (!bossPlaced) {if (window.CP.shouldStopExecution(21)){break;}if (window.CP.shouldStopExecution(21)){break;}
        bossCol = this.randomNum(0, BOARDSIZE - 1);
        bossRow = this.randomNum(0, BOARDSIZE - 1);
        if (tempBoard[bossRow][bossCol]) {
          monsterList.push({
            col: bossCol,
            row: bossRow,
            species: MONSTERS[4].name,
            HP: MONSTERS[4].HP,
            attack: MONSTERS[4].attack,
            display: true
          });
          bossPlaced = true;
        }
      }
window.CP.exitedLoop(21);

window.CP.exitedLoop(21);

    }

    //place weapon
    var weaponPos = this.state.weaponPos;
    var weaponCol;
    var weaponRow;
    var weaponPlaced = false;
    while (!weaponPlaced) {if (window.CP.shouldStopExecution(22)){break;}if (window.CP.shouldStopExecution(22)){break;}
      weaponCol = this.randomNum(0, BOARDSIZE - 1);
      weaponRow = this.randomNum(0, BOARDSIZE - 1);
      if (tempBoard[weaponCol][weaponRow]) {
        weaponPos.col = weaponCol;
        weaponPos.row = weaponRow;
        weaponPos.type += 1; //get the next one in the list
        weaponPos.display = true; //weapon is visible and can be collected
        weaponPlaced = true;
      }
    }
window.CP.exitedLoop(22);

window.CP.exitedLoop(22);


    //place stairs
    var stairCol;
    var stairRow;
    //do not place stairs if on the final dungeon
    if (level < 4) {
      var stairsPlaced = false;
      while (!stairsPlaced) {if (window.CP.shouldStopExecution(23)){break;}if (window.CP.shouldStopExecution(23)){break;}
        stairCol = this.randomNum(0, BOARDSIZE - 1);
        stairRow = this.randomNum(0, BOARDSIZE - 1);
        if (
        //checking for clear space
        //add - do not spawn on top of the weapon!
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
window.CP.exitedLoop(23);

window.CP.exitedLoop(23);

    } //end of stair placement

    //place player
    var playerCol;
    var playerRow;
    var playerPlaced = false;
    while (!playerPlaced) {if (window.CP.shouldStopExecution(24)){break;}if (window.CP.shouldStopExecution(24)){break;}
      playerCol = this.randomNum(1, BOARDSIZE - 1);
      playerRow = this.randomNum(1, BOARDSIZE - 1);
      //ensure player is on free space
      if (
      //add - do not spawn on top of the weapon
      tempBoard[playerCol][playerRow] && playerCol !== stairCol && playerRow !== stairRow) {
        playerPlaced = true;
      }
    }
window.CP.exitedLoop(24);

window.CP.exitedLoop(24);
 //end of player placement

    //board complete, set state
    this.setState({
      stairPos: { rowPos: stairRow, colPos: stairCol },
      playerPos: { rowPos: playerRow, colPos: playerCol },
      level: level,
      board: tempBoard,
      monsters: monsterList,
      heals: healList,
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

    //pick up weapon
    var statusLog = this.state.statusLog;
    var playerStats = this.state.playerStats;
    var weapon = this.state.weaponPos;
    if (playerCol === weapon.col && playerRow === weapon.row && weapon.display) {
      weapon.display = false;
      playerStats.weapon = WEAPONS[weapon.type];
      statusLog.push("You picked up a " + WEAPONS[weapon.type].name + "!");
    }

    //pick up heal
    var heals = this.state.heals;
    for (var i = 0; i < heals.length; i++) {if (window.CP.shouldStopExecution(25)){break;}if (window.CP.shouldStopExecution(25)){break;}
      if (playerCol === heals[i].row && playerRow === heals[i].col && heals[i].display) {
        //do not pick up if HP is full
        if (playerStats.currHP >= playerStats.maxHP) {
          statusLog.push("You found a healing potion, but your HP is already full.");
        } else {
          statusLog.push("You found a healing potion!");
          heals[i].display = false;
          //amount healed is dependent on the dungeon floor
          playerStats.currHP += 25 + (this.state.level - 1) * 10;
          //do not allow HP to go over the max
          if (playerStats.currHP > playerStats.maxHP) {
            playerStats.currHP = playerStats.maxHP;
          }
        }
      }
    }
window.CP.exitedLoop(25);

window.CP.exitedLoop(25);


    //monster collision detection
    var monsters = this.state.monsters;
    var shouldMove = true; //don't move if bumping into a monster
    for (var i = 0; i < monsters.length; i++) {if (window.CP.shouldStopExecution(26)){break;}if (window.CP.shouldStopExecution(26)){break;}
      if (playerCol === monsters[i].row && playerRow === monsters[i].col && monsters[i].display //don't fight if monster is defeated
      ) {
          shouldMove = false;
          this.fightMonster(monsters, i);
        }
    }
window.CP.exitedLoop(26);

window.CP.exitedLoop(26);


    //stair collision detection
    var stairRow = this.state.stairPos.rowPos;
    var stairCol = this.state.stairPos.colPos;
    if (playerRow === stairRow && playerCol === stairCol) {
      //character moved into stair tile
      this.setState({ displayStairMessage: true });
    } else {
      //update state with new position
      if (shouldMove) {
        this.setState({
          playerPos: {
            rowPos: playerRow,
            colPos: playerCol,
            weaponPos: weapon,
            statusLog: statusLog
          }
        });
      }
    }
  }, //moveChar

  fightMonster: function fightMonster(monsters, index) {
    //get status log
    var statusLog = this.state.statusLog;
    var playerStats = this.state.playerStats;
    //determines if the victory or death screen will display afterwards
    var showWinScreen = false;
    var showDeathScreen = false;
    //is this a boss fight?
    var isBoss = monsters[index].species === "Dragon" ? true : false;
    //open combat message
    if (isBoss) {
      statusLog.push("You have encountered the Dragon!");
    } else {
      statusLog.push("You are attacked by a " + monsters[index].species + " with " + monsters[index].HP + " HP!");
    }
    //player attacks
    var playerAttack = playerStats.baseAttack + playerStats.weapon.strength;
    var playerDamage = this.randomNum(Math.round(playerAttack - playerAttack / 2), Math.round(playerAttack + playerAttack / 2));
    statusLog.push("You hit the " + monsters[index].species + " for " + playerDamage + "!");
    //decrement monster HP
    monsters[index].HP -= playerDamage;
    //did we defeat it?
    if (monsters[index].HP <= 0) {
      monsters[index].display = false;
      if (isBoss) {
        statusLog.push("You have defeated the dragon and beaten the dungeon! Congratulations!");
        showWinScreen = true;
      } else {
        statusLog.push("You defeated the " + monsters[index].species + "!");
        //gain exp based off monster's attack stat
        playerStats.toNextLevel -= monsters[index].attack;
        //did we level up?
        if (playerStats.toNextLevel <= 0) {
          statusLog.push("You levelled up!");
          playerStats.level += 1;
          playerStats.toNextLevel = playerStats.level * 50;
          playerStats.maxHP += 20;
          playerStats.attack += 10;
        }
      }
    } else {
      //if we did not defeat it, the monster attacks us next
      var monsterDamage = this.randomNum(Math.round(monsters[index].attack - monsters[index].attack / 2), Math.round(monsters[index].attack + monsters[index].attack / 2));
      statusLog.push("The " + monsters[index].species + " hits for " + monsterDamage + "!");
      //decrement player HP
      playerStats.currHP -= monsterDamage;
      //are we dead?
      if (playerStats.currHP <= 0) {
        statusLog.push("You died!");
        showDeathScreen = true;
      }
    }
    this.setState({
      monsters: monsters,
      statusLog: statusLog,
      playerStats: playerStats,
      displayWinScreen: showWinScreen,
      displayDeathScreen: showDeathScreen
    });
  },

  handleStairs: function handleStairs(decide) {
    if (decide === "stairyes") {
      this.boardSetup();
    }
    this.setState({ displayStairMessage: false });
  }, //handleStairs

  resetGame: function resetGame() {
    //reset all stats to default
    this.setState({
      level: 0, //dungeon floor
      stairPos: { rowPos: 0, colPos: 0 },
      playerPos: { rowPos: 0, colPos: 0 },
      weaponPos: { rowPos: 0, colPos: 0, type: 0, display: true },
      playerStats: {
        level: 1,
        toNextLevel: 50,
        maxHP: 50,
        currHP: 50,
        baseAttack: 10,
        weapon: WEAPONS[0]
      },
      monsters: [],
      heals: [],
      statusLog: [],
      displayStairMessage: false,
      displayWinScreen: false,
      displayDeathScreen: false
    }, function () {
      this.boardSetup();
    });
  }, //resetGame

  randomNum: function randomNum(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  } //randomNum
});

ReactDOM.render(React.createElement(App, null), document.getElementById("root"));