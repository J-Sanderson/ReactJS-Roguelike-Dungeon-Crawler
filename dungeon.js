var BOARDSIZE = 45; //45
var MAXPASSAGELENGTH = 7; //7
var MINPASSAGELENGTH = 4; //2
var MAXROOMSIZE = 8; //8
var MINROOMSIZE = 3; //3
var MAXROOMS = 13; //15
var MINROOMS = 7; //10
var MAXITEM = 10; //# of items/monsters
var MINITEM = 6;
var WEAPONS = [{ name: "bare hands", strength: 0 }, { name: "pointed stick", strength: 10 }, { name: "L2 weapon", strength: 20 }, { name: "L3 weapon", strength: 30 }, { name: "sharp slice of mango", strength: 40 }];
var MONSTERS = [{ name: "Ubiquitous Bat", HP: 50, attack: 10 }, { name: "L2 monster", HP: 70, attack: 20 }, { name: "L3 monster", HP: 90, attack: 30 }, { name: "Killer Rabbit", HP: 110, attack: 40 }];

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
    //draw board etc if player is still alive
    if (this.props.playerStats.currHP > 0) {
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

      //place monsters
      for (var i = 0; i < this.props.monsters.length; i++) {if (window.CP.shouldStopExecution(3)){break;}
        if (this.props.monsters[i].display) {
          //only show undefeated monsters
          ctx.beginPath();
          ctx.fillStyle = "blue";
          ctx.rect(this.props.monsters[i].row * 10, this.props.monsters[i].col * 10, 10, 10);
          ctx.fill();
        }
      }
window.CP.exitedLoop(3);

      //place heals
      for (var i = 0; i < this.props.heals.length; i++) {if (window.CP.shouldStopExecution(4)){break;}
        if (this.props.heals[i].display) {
          ctx.beginPath();
          ctx.fillStyle = "purple";
          ctx.rect(this.props.heals[i].row * 10, this.props.heals[i].col * 10, 10, 10);
          ctx.fill();
        }
      }
window.CP.exitedLoop(4);

      //place weapon
      if (this.props.weaponPos.display) {
        ctx.beginPath();
        ctx.fillStyle = "gold";
        ctx.rect(this.props.weaponPos.col * 10, this.props.weaponPos.row * 10, 10, 10);
        ctx.fill();
      }
      //place stairs
      ctx.beginPath();
      ctx.fillStyle = "red";
      ctx.rect(this.props.stairPos.colPos * 10, this.props.stairPos.rowPos * 10, 10, 10);
      ctx.fill();
      //place player
      ctx.beginPath();
      ctx.fillStyle = "green";
      ctx.rect(this.props.playerPos.colPos * 10, this.props.playerPos.rowPos * 10, 10, 10);
      ctx.fill();
    } else {
      //render death screen?
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
    this.props.moveChar(event.target.id);
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
        toNextLevel: 100,
        maxHP: 50,
        currHP: 50,
        baseAttack: 10,
        weapon: WEAPONS[0]
      },
      monsters: [],
      heals: [],
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
        playerPos: this.state.playerPos,
        playerStats: this.state.playerStats,
        weaponPos: this.state.weaponPos,
        monsters: this.state.monsters,
        heals: this.state.heals
      }),
      React.createElement(Controls, { moveChar: this.moveChar })
    );
  }, //render

  boardSetup: function boardSetup() {
    //get level
    var level = this.state.level;
    //create new blank board
    var tempBoard = [];
    for (var i = 0; i < BOARDSIZE; i++) {if (window.CP.shouldStopExecution(6)){break;}
      var col = [];
      for (var j = 0; j < BOARDSIZE; j++) {if (window.CP.shouldStopExecution(5)){break;}
        col.push(false);
      }
window.CP.exitedLoop(5);

      tempBoard.push(col);
    }
window.CP.exitedLoop(6);


    //dig starter room
    var startRow = this.randomNum(10, BOARDSIZE - 10);
    var startCol = this.randomNum(10, BOARDSIZE - 10);
    var startHeight = this.randomNum(MAXROOMSIZE, MINROOMSIZE);
    var startWidth = this.randomNum(MAXROOMSIZE, MINROOMSIZE);
    for (var i = startRow; i < startRow + startWidth; i++) {if (window.CP.shouldStopExecution(8)){break;}
      for (var j = startCol; j < startCol + startHeight; j++) {if (window.CP.shouldStopExecution(7)){break;}
        tempBoard[i][j] = true;
      }
window.CP.exitedLoop(7);

    }
window.CP.exitedLoop(8);


    //get number of remaining rooms to dig...
    var numRooms = this.randomNum(MINROOMS, MAXROOMS);
    //..and dig them
    for (var i = 0; i < numRooms; i++) {if (window.CP.shouldStopExecution(16)){break;}
      //get wall tile next to clear tile to dig from
      var wallFound = false;
      while (!wallFound) {if (window.CP.shouldStopExecution(9)){break;}
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
            for (var j = 0; j < passageLength; j++) {if (window.CP.shouldStopExecution(10)){break;}
              tempBoard[randRow][randCol + j] = true;
            }
window.CP.exitedLoop(10);

            roomRow = this.randomNum(randRow - (roomWidth - 1), randRow);
            roomCol = randCol + passageLength;
            break;
          case "left":
            for (var j = 0; j < passageLength; j++) {if (window.CP.shouldStopExecution(11)){break;}
              tempBoard[randRow - j][randCol] = true;
            }
window.CP.exitedLoop(11);

            roomRow = randRow - (passageLength + (roomWidth - 1));
            roomCol = this.randomNum(randCol - roomHeight + 1, randCol);
            break;
          case "up":
            for (var j = 0; j < passageLength; j++) {if (window.CP.shouldStopExecution(12)){break;}
              tempBoard[randRow][randCol - j] = true;
            }
window.CP.exitedLoop(12);

            roomRow = this.randomNum(randRow - (roomWidth - 1), randRow);
            roomCol = randCol - passageLength - roomHeight + 1;
            break;
          case "right":
            for (var j = 0; j < passageLength; j++) {if (window.CP.shouldStopExecution(13)){break;}
              tempBoard[randRow + j][randCol] = true;
            }
window.CP.exitedLoop(13);

            roomRow = randRow + passageLength;
            roomCol = this.randomNum(randCol - roomHeight + 1, randCol);
            break;
          default:
            console.log("Tried to dig passage in invalid direction");
        }
        for (var k = roomRow; k < roomRow + roomWidth; k++) {if (window.CP.shouldStopExecution(15)){break;}
          for (var m = roomCol; m < roomCol + roomHeight; m++) {if (window.CP.shouldStopExecution(14)){break;}
            tempBoard[k][m] = true;
          }
window.CP.exitedLoop(14);

        }
window.CP.exitedLoop(15);

      } catch (err) {
        console.log("Room went out of bounds");
      }
    }
window.CP.exitedLoop(16);
 //end of room digging loop

    //increment level, messages
    //monster types depend on level
    //update status message
    var statusLog = this.state.statusLog;

    if (level === 0) {
      statusLog.push("Welcome to the dungeon! Find and kill the boss to win!");
    } else {
      statusLog.push("You head down the stairs...");
    }

    //place monsters
    var numMonsters = this.randomNum(MINITEM, MAXITEM);
    var monsterList = [];
    for (var i = 0; i < numMonsters; i++) {if (window.CP.shouldStopExecution(18)){break;}
      var monsterPlaced = false;
      while (!monsterPlaced) {if (window.CP.shouldStopExecution(17)){break;}
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

    }
window.CP.exitedLoop(18);
 //end of monster placement loop

    //place healing items
    var numHeals = this.randomNum(MINITEM, MAXITEM);
    var healList = [];
    for (var i = 0; i < numHeals; i++) {if (window.CP.shouldStopExecution(20)){break;}
      var healPlaced = false;
      while (!healPlaced) {if (window.CP.shouldStopExecution(19)){break;}
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

    }
window.CP.exitedLoop(20);


    //update level counter
    //after monster/item placement so arrays work properly
    //WEAPON[0] = no weapon
    level += 1;

    //place weapon
    var weaponPos = this.state.weaponPos;
    var weaponCol;
    var weaponRow;
    var weaponPlaced = false;
    while (!weaponPlaced) {if (window.CP.shouldStopExecution(21)){break;}
      weaponCol = this.randomNum(0, BOARDSIZE - 1);
      weaponRow = this.randomNum(0, BOARDSIZE - 1);
      if (tempBoard[weaponCol][weaponRow]) {
        weaponPos.col = weaponCol;
        weaponPos.row = weaponRow;
        weaponPos.type += 1; //get the next one in the list, fix for top weapon later
        weaponPos.display = true; //weapon is visible and can be collected
        weaponPlaced = true;
      }
    }
window.CP.exitedLoop(21);


    //place stairs
    var stairCol;
    var stairRow;
    //do not place stairs if on the final dungeon
    if (level < 4) {
      var stairsPlaced = false;
      while (!stairsPlaced) {if (window.CP.shouldStopExecution(22)){break;}
        stairCol = this.randomNum(0, BOARDSIZE - 1);
        stairRow = this.randomNum(0, BOARDSIZE - 1);
        if (
        //checking for clear space
        //add - do not spawn on top of a monster
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
window.CP.exitedLoop(22);

    } //end of stair placement

    //place player
    var playerCol;
    var playerRow;
    var playerPlaced = false;
    while (!playerPlaced) {if (window.CP.shouldStopExecution(23)){break;}
      playerCol = this.randomNum(1, BOARDSIZE - 1);
      playerRow = this.randomNum(1, BOARDSIZE - 1);
      //ensure player is on free space
      if (
      //add - do not spawn on top of a monster, item?
      tempBoard[playerCol][playerRow] && playerCol !== stairCol && playerRow !== stairRow) {
        playerPlaced = true;
      }
    }
window.CP.exitedLoop(23);
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
    if (playerCol === weapon.col && playerRow === weapon.row) {
      weapon.display = false;
      playerStats.weapon = WEAPONS[weapon.type];
      statusLog.push("You picked up a " + WEAPONS[weapon.type].name + "!");
    }

    //pick up heal
    var heals = this.state.heals;
    for (var i = 0; i < heals.length; i++) {if (window.CP.shouldStopExecution(24)){break;}
      if (playerCol === heals[i].row && playerRow === heals[i].col && heals[i].display) {
        //do not pick up if HP is full
        if (playerStats.currHP >= playerStats.maxHP) {
          statusLog.push("You found a healing potion, but your HP is already full.");
        } else {
          statusLog.push("You found a healing potion!");
          heals[i].display = false;
          playerStats.currHP += 25; //for now assume all heals are for 25HP
          //do not allow HP to go over the max
          if (playerStats.currHP > playerStats.maxHP) {
            playerStats.currHP = playerStats.maxHP;
          }
        }
      }
    }
window.CP.exitedLoop(24);


    //monster collision detection
    var monsters = this.state.monsters;
    var shouldMove = true; //don't move if bumping into a monster
    for (var i = 0; i < monsters.length; i++) {if (window.CP.shouldStopExecution(25)){break;}
      if (playerCol === monsters[i].row && playerRow === monsters[i].col && monsters[i].display) {
        //don't fight if monster is defeated
        shouldMove = false;
        this.fightMonster(monsters, i);
      }
    }
window.CP.exitedLoop(25);


    //stair collision detection
    var stairRow = this.state.stairPos.rowPos;
    var stairCol = this.state.stairPos.colPos;
    if (playerRow === stairRow && playerCol === stairCol) {
      //character moved into stair tile
      this.handleStairs();
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
    //open combat message
    statusLog.push("You are attacked by a " + monsters[index].species + " with " + monsters[index].HP + " HP!");
    //console.log(monsters[index]);
    //player attacks
    //base attack increases with level
    var playerAttack = playerStats.baseAttack + playerStats.weapon.strength;
    var playerDamage = this.randomNum(Math.round(playerAttack - playerAttack / 2), Math.round(playerAttack + playerAttack / 2));
    statusLog.push("You hit the " + monsters[index].species + " for " + playerDamage + "!");
    //decrement monster HP
    monsters[index].HP -= playerDamage;
    //did we defeat it?
    if (monsters[index].HP <= 0) {
      monsters[index].display = false;
      statusLog.push("You defeated the " + monsters[index].species + "!");
      //gain exp - temp using monster's attack stat as exp gain?
      playerStats.toNextLevel -= monsters[index].attack;
      //did we level up?
      if (playerStats.toNextLevel <= 0) {
        statusLog.push("You levelled up!");
        playerStats.level += 1;
        playerStats.toNextLevel = playerStats.level * 100;
        playerStats.maxHP += 20;
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
        //end game here
      }
    }
    this.setState({
      monsters: monsters,
      statusLog: statusLog,
      playerStats: playerStats
    });
  },

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