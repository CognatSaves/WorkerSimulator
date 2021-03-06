"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function incapsulation() {
  var height = 600;
  var width = 800;
  var GameEx;

  function createField(res) {
    function createGrids(res) {
      for (var i = 0; i < res.gridMass.length; i++) {
        for (var j = 0; j < res.gridMass[i].length; j++) {
          var grid = document.createElement('div');
          var color = "green";
          var storage_image = "Storage.jpg";
          var exit_image = "Fura.jpg";
          if (res.gridMass[i][j].isStorage > 0) {
            color = "yellow";
          }
          if (res.gridMass[i][j].isStorage == 0) {
            color = "blue";
          }
          grid.innerHTML = '<div id=' + i + '_' + j + ' style="position:absolute; width:' + res.size.w + 'px; height: ' + res.size.h + 'px; top:' + res.gridMass[i][j].yPosition + 'px; left:' + res.gridMass[i][j].xPosition + 'px;' + ' background: ' + color + '; border: solid 1px">';
          if (res.gridMass[i][j].passable == false) {
            grid.style.visibility = "hidden";
          }

          document.getElementById("gameBlock").appendChild(grid);
          if (res.gridMass[i][j].isStorage > 0) {
            document.getElementById(i + '_' + j).innerText = res.storageValue[res.gridMass[i][j].isStorage];
            document.getElementById(i + '_' + j).style.background = 'url(' + storage_image + ') no-repeat center';
            document.getElementById(i + '_' + j).style.backgroundSize = '100%';
          }
          if (res.gridMass[i][j].isStorage == 0) {
            document.getElementById(i + '_' + j).innerText = 0;
            document.getElementById(i + '_' + j).style.background = 'url(' + exit_image + ') no-repeat center';
          }

          document.getElementById(i + '_' + j).style.backgroundSize = '100%';
        }
      }
    }

    function createPlayerChestsInfo(maxChestCarry) {
      var pChIBlock = document.createElement('div');
      pChIBlock.innerHTML = '<div id="pChIBlock" class="playerChestsInfo">';
      document.getElementById("body").appendChild(pChIBlock);
      var info1 = document.createElement('div');
      info1.innerText = "Количество ящиков в инвентаре (макс = " + maxChestCarry + "):";
      document.getElementById("pChIBlock").appendChild(info1);
      var text1 = document.createElement('div');
      text1.innerHTML = '<div id="chestCarryInfo">0</div>';
      document.getElementById("pChIBlock").appendChild(text1);
    }

    console.log("Вызвана функция создания поля");
    var gameBlock = document.createElement('div');
    gameBlock.innerHTML = '<div class="gameBlock"; id="gameBlock"; onkeypress="alert()" style="background-color: red; width: ' + width + 'px;' + ' height: ' + height + 'px; text-align: right">';
    document.getElementById("body").appendChild(gameBlock);
    createGrids(res);
    createPlayerChestsInfo(res.maxChestCarry);
  }

  var Game = function () {
    function Game(data) {
      _classCallCheck(this, Game);

      function gridSize(res) {
        var gridW = width / (res.x + 1);
        var gridH = height / (res.y + 1);
        return { w: gridW, h: gridH };
      }

      //this.storageDataMass=data.storageDataMass;
      this.gridMass = []; //массив, хранящий все клетки картинки (включая недопустимые)
      this.numberXGrid = Number.parseInt(data.x) + 1; //размеры по х
      this.numberYGrid = Number.parseInt(data.y) + 2; //размеры по у
      this.size = gridSize({ x: this.numberXGrid, y: this.numberYGrid }); // высота и ширина 1 клетки
      this.maxChestCarry = data.personNumber; //сколько можно переносить - передаётся в Person
      this.storageValue = data.storageValue; //информация о хранилищах
      this.personPosition = { xPos: this.numberXGrid - 1, yPos: this.numberYGrid - 1 }; //первоначальное положение игрока

      for (var i = 0; i <= this.numberXGrid; i++) {
        this.gridMass[i] = [];
        for (var j = 0; j <= this.numberYGrid; j++) {
          this.gridMass[i][j] = { passable: true, isStorage: -1, xPosition: i * this.size.w, yPosition: j * this.size.h };
          //passable - можно ли перейти в клетку, isStorage - если -1, то нет, 0 = выход, иначе - номер хранилища
          //1-я координата по х, 2-я по у
        }
      }
      for (var _i = 0; _i <= this.numberXGrid; _i++) {
        this.gridMass[_i][0].passable = false; //первая строка
        this.gridMass[_i][this.numberYGrid].passable = false; //последная строка
        this.gridMass[_i][this.numberYGrid - 1].passable = false; //предпоследная строка
      }
      this.gridMass[this.numberXGrid - 1][this.numberYGrid - 1].passable = true; //это выход
      for (var _i2 = 0; _i2 <= this.numberYGrid; _i2++) {
        this.gridMass[0][_i2].passable = false; //первый столбец
        this.gridMass[this.numberXGrid][_i2].passable = false; //последний столбец
      }

      for (var _i3 = 1; _i3 < data.storageMass.length; _i3++) {
        this.gridMass[data.storageMass[_i3].x][data.storageMass[_i3].y].isStorage = _i3; //выставляем хранилища
      }
      this.gridMass[this.numberXGrid - 1][this.numberYGrid - 1].isStorage = 0; //обозначаем нужную клетку как выход

      //создаём игровое поле
      createField({
        gridMass: this.gridMass,
        size: this.size,
        storageValue: this.storageValue,
        maxChestCarry: this.maxChestCarry
      });
      //создаём игрока и рисуем его на выходе
      this.player = new Player({ size: this.size, maxChestCarry: this.maxChestCarry });
      this.player.drawPlayer({
        xPPosition: this.gridMass[this.numberXGrid - 1][this.numberYGrid - 1].xPosition,
        yPPosition: this.gridMass[this.numberXGrid - 1][this.numberYGrid - 1].yPosition
      });
    }

    _createClass(Game, [{
      key: "isPassable",
      value: function isPassable(i, j) {
        return this.gridMass[this.personPosition.xPos + i][this.personPosition.yPos + j].passable; //можно ли посетить следующую клетку
      }
    }, {
      key: "onKeyDown",
      value: function onKeyDown(code) {
        function chestOnHandsShow(numberP, numberG, position) {
          document.getElementById("chestCarryInfo").innerText = numberP;
          var id = "" + position.x + "_" + position.y;
          document.getElementById(id).innerText = numberG;
        }

        if (this.player.isCanMove()) {
          //если не двигается
          if (code === "Space") {
            if (this.gridMass[this.personPosition.xPos][this.personPosition.yPos].isStorage == 0) {
              //если это выход
              if (this.player.isCanDrop()) {
                this.player.chestCarry--;
                this.storageValue[0]++;
                chestOnHandsShow(this.player.chestCarry, this.storageValue[0], {
                  x: this.personPosition.xPos,
                  y: this.personPosition.yPos
                });
              }
            }
            if (this.gridMass[this.personPosition.xPos][this.personPosition.yPos].isStorage > 0) {
              if (this.player.isCanTake() && this.storageValue[this.gridMass[this.personPosition.xPos][this.personPosition.yPos].isStorage] > 0) {
                //если можем взять и там что-то есть))
                this.player.chestCarry++;
                this.storageValue[this.gridMass[this.personPosition.xPos][this.personPosition.yPos].isStorage]--;
                chestOnHandsShow(this.player.chestCarry, this.storageValue[this.gridMass[this.personPosition.xPos][this.personPosition.yPos].isStorage], { x: this.personPosition.xPos, y: this.personPosition.yPos });
              }
            }
          }
          if (code == "ArrowUp") {
            // 0 -1
            if (this.isPassable(0, -1) == true) {
              //если доступен
              this.personPosition.yPos = this.personPosition.yPos - 1;
              this.player.moveX(-1);
            }
          }
          if (code == "ArrowDown") {
            // 0 1
            if (this.isPassable(0, 1) == true) {
              this.personPosition.yPos = this.personPosition.yPos + 1;
              this.player.moveX(1);
            }
          }
          if (code == "ArrowLeft") {
            // -1 0
            if (this.isPassable(-1, 0) == true) {
              this.personPosition.xPos = this.personPosition.xPos - 1;
              this.player.moveY(-1);
            }
          }
          if (code == "ArrowRight") {
            // 1 0
            if (this.isPassable(1, 0) == true) {
              this.personPosition.xPos = this.personPosition.xPos + 1;
              this.player.moveY(1);
            }
          }
        } else {
          console.log("can not move now");
        }
      }
    }]);

    return Game;
  }();

  var Player = function () {
    function Player(data) {
      _classCallCheck(this, Player);

      this.canMove = true; //для анимации - если false, не должен обрабатывать сообщения пробел и стрелочки
      this.chestCarry = 0; //изначально пуст
      this.maxChestCarry = data.maxChestCarry; //макс грузоподъёмность
      this.size = data.size; //размеры клетки
      var size = this.size.h; //размерность человечка -ниже вычисляется
      if (size > this.size.w) {
        size = this.size.w;
      }
      this.pictureSize = size;
      this.standartSpeed = 10;
    }

    _createClass(Player, [{
      key: "isCanMove",
      value: function isCanMove() {
        return this.canMove;
      }
    }, {
      key: "isCanTake",
      value: function isCanTake() {
        return this.maxChestCarry - this.chestCarry > 0;
      }
    }, {
      key: "isCanDrop",
      value: function isCanDrop() {
        return this.chestCarry > 0;
      }
    }, {
      key: "drawPlayer",
      value: function drawPlayer(position) {
        var player = document.createElement("div");
        player.innerHTML = '<div id="player"; class="player"; style="position:absolute; top:' + position.yPPosition + 'px;' + ' left:' + position.xPPosition + 'px; width:' + this.size.w + 'px; height: ' + this.size.h + 'px; background-size:' + this.pictureSize + 'px">';
        document.getElementById("gameBlock").appendChild(player);
        this.lastStay = { top: position.yPPosition, left: position.xPPosition };
      }
    }, {
      key: "moveX",
      value: function moveX(type) {
        //type == -1 - up, type == 1 - down
        function makeStep() {
          player.style.top = classEl.lastStay.top + classEl.standartSpeed * Math.sign(way) + "px";
          classEl.lastStay.top = classEl.lastStay.top + classEl.standartSpeed * Math.sign(way);
          time++;
          if (time < standartStepsNumber) {
            setTimeout(makeStep, 10);
          } else {
            player.style.top = classEl.lastStay.top + lastStep * Math.sign(way) + "px";
            classEl.lastStay.top = classEl.lastStay.top + lastStep * Math.sign(way);
            classEl.canMove = true;
          }
        }

        this.canMove = false;
        var player = document.getElementById("player");
        var way = this.size.h * type;

        var standartStepsNumber = Math.abs(Number.parseInt(way / this.standartSpeed)); //используем одинаковую скорость
        var lastStep = Math.abs(way) - standartStepsNumber * this.standartSpeed; //последний шаг
        var time = 0;
        var classEl = this;
        setTimeout(makeStep, 10);
      }
    }, {
      key: "moveY",
      value: function moveY(type) {
        //type == -1 -left, type ==1 - right
        function makeStep() {
          player.style.left = classEl.lastStay.left + classEl.standartSpeed * Math.sign(way) + "px";
          classEl.lastStay.left = classEl.lastStay.left + classEl.standartSpeed * Math.sign(way);
          time++;
          if (time < standartStepsNumber) {
            setTimeout(makeStep, 10);
          } else {
            player.style.left = classEl.lastStay.left + lastStep * Math.sign(way) + "px";
            classEl.lastStay.left = classEl.lastStay.left + lastStep * Math.sign(way);
            classEl.canMove = true;
          }
        }

        this.canMove = false;
        var player = document.getElementById("player");
        var way = this.size.w * type;

        var standartStepsNumber = Math.abs(Number.parseInt(way / this.standartSpeed));
        var lastStep = Math.abs(way) - standartStepsNumber * this.standartSpeed;
        var time = 0;
        var classEl = this;
        setTimeout(makeStep, 10);
      }
    }]);

    return Player;
  }();

  function startFunc() {
    function isCorrect() {
      if (tempX < 1 || tempY < 1 || tempX > 10 || tempY > 10) {
        console.log("grid error");
        return false;
      }
      if (tempSN < 1 || tempSN == undefined || tempSN > tempX * tempY) {
        console.log("storage error");
        return false;
      }
      if (tempCN < 1 || tempCN == undefined) {
        console.log("chest error");
        return false;
      }
      if (tempPN < 1 || tempPN == undefined) {
        console.log("person error");
        return false;
      }
      return true;
    }

    var tempX = document.getElementById("input1").value;
    var tempY = document.getElementById("input2").value;
    var tempSN = document.getElementById("input3").value;
    var tempCN = document.getElementById("input4").value;
    var tempPN = document.getElementById("input5").value;
    if (isCorrect()) {
      document.getElementById("startBlock").style.visibility = "hidden";
      dataCreator([tempX, tempY, tempSN, tempCN, tempPN]);
    } else {
      alert("Неправильные данные - проверьте их по комментариям");
    }
  }

  function dataCreator(data) {
    function getRandomInRange(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var storageMass = [];
    var set = new Set();
    storageMass[0] = { x: 1 * data[0], y: 1 * data[1] + 1 };
    for (var i = 1; i <= data[2]; i++) {
      var ax = getRandomInRange(1, data[0]);
      var ay = getRandomInRange(1, data[1]);
      var temp = ax * 1000 + ay;
      //создаём сравнимые для сет-а элементы таким невменяемым образом
      var len = set.size;
      set.add(temp);
      if (len != set.size) {
        storageMass[i] = { x: ax, y: ay };
      } else {
        i--; //add exsisted element
      }
    }
    var storageValue = [];

    storageValue[0] = 0; //на выходе пусто
    for (var _i4 = 1; _i4 <= data[2]; _i4++) {
      storageValue[_i4] = getRandomInRange(1, data[3]);
    }
    GameEx = new Game({
      storageMass: storageMass,
      storageValue: storageValue,
      x: data[0],
      y: data[1],
      personNumber: data[4]
    });
  }

  function onKeyDownCommon() {
    console.log(event.code);
    if (GameEx) {
      //если игра началась))
      GameEx.onKeyDown(event.code);
    }
  }
  return {
    startFunc: startFunc,
    onKeyDownCommon: onKeyDownCommon
  };
}
var work = incapsulation();