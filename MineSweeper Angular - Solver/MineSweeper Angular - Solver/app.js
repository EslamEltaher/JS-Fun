angular.module('MinesweeperApp', []);
angular.module('MinesweeperApp').controller('MineSweeperCtrl', MineSweeperCtrl);

MineSweeperCtrl.$inject = ['$scope', '$timeout', '$interval', '$timeout'];
function MineSweeperCtrl($scope, $timeout, $interval, $timeout) {
    var vm = this;

    vm.rowCount = 20;
    vm.colCount = 40;
    vm.putBomb = putBomb;
    vm.showCell = showCell;
    vm.showAll = showAll;
    vm.hideAll = hideAll;
    vm.checkGameOver = checkGameOver;
    vm.isGameOver = false;
    vm.handleClick = handleClick;
    var l = 0;

    vm.step = 0;
    vm.solverArr = [];
    function handleClick(ev, cell) {
        switch(ev.which) {
            case 1:
                console.log('left');
                // increment(); // this is left click
                break;
            case 2:
                middleClick(cell);
                // in case you need some middle click things
                break;
            case 3:
                console.log('right');
                cell.isMarked = !cell.isMarked;
                // decrement(); // this is right click
                break;
            default:
                alert("you have a strange mouse!");
                break;
        }
    }
    function middleClick(cell) {
        var b = 0;
        console.log('middle');
        aroundCell(cell.i, cell.j, function(_cell){
            if(_cell.isMarked && _cell.isBomb) b++;
        });
        if(cell.bombCount == b) aroundCell(cell.i, cell.j, function(_cell){
            vm.showCell(_cell.i, _cell.j);
        })
    }
    function checkGameOver() {
        var over = false;

        // console.log(++l);
        if(!vm.creator && !vm.isGameOver) {
            over = true;
            loopGrid(function(cell) { if(!cell.show && !cell.isBomb) over=false; });
        }
        vm.isGameOver = over;
        if(over) alert('You Won');
        console.log(over);
        return over;
    }
    function InitGrid() {
        vm.rows = [];
        for(var i = 0; i < vm.rowCount; i++) {
            vm.rows[i] = [];
            for(var j = 0; j < vm.colCount; j++)
                vm.rows[i][j] = new Cell(i,j, Math.random()>0.8);
        }
        loopGrid(function(cell){
            calcNeighbourBombs(cell.i, cell.j);
        });
    }
    function calcNeighbourBombs(i,j){
        var b = 0;
        aroundCell(i,j, function(_cell){
            if(_cell.isBomb) b++;
        })
        cellFunction(i,j,function(cell){
            cell.bombCount = b;
        })
    }
    function loopGrid(f) {
        for(var i = 0; i < vm.rowCount; i++)
            for(var j = 0; j < vm.colCount; j++)
                f(vm.rows[i][j]);
    }
    function putBomb(i,j) {
        cellFunction(i, j, function(cell) { 
            if(!cell.isBomb) {
                cell.isBomb = true;
                aroundCell(i, j, function(cell) { cell.bombCount++ });
            }
        });
    }
    function showCell(i, j) {
        if(!vm.rows[i][j].isMarked)
            cellFunction(i,j, (function(x,y){
                return function(cell){
                    if(cell.show) return;
                    cell.show = true;
        
                    if(!cell.isBomb && cell.bombCount == 0)
                        aroundCell(x,y, function(_cell) { showCell(_cell.i,_cell.j) });

                    if(!vm.isGameOver)      vm.checkGameOver();
                };
            })(i,j));
    }
    function cellFunction(i, j, f) {
        i = (i < vm.rowCount && i > -1) ? i : null;
        j = (j < vm.colCount && j > -1) ? j : null;
        if(i !== null && i !== undefined && j !== null && j !== undefined) {
            // $scope.$apply(() => f(vm.rows[i][j]));
            f(vm.rows[i][j]);
        }
    }
    function aroundCell(i, j, f) {
        for(var ii = i - 1; ii <= i + 1; ii++)
        for(var jj = j - 1; jj <= j + 1; jj++)
            if(ii != i || jj != j)
                cellFunction(ii,jj,f);

        // var ii = i-1;
        // var jj = j-1;
        // var tmr =
        // setInterval(function() {
        //     if(ii <= i +1) {
        //         if(jj <= j +1)
        //         $scope.$apply(function(){cellFunction(ii,jj,f);})
                
        //         else {
        //             jj = j-1;
        //             ii++;
        //         }
        //     }
        //     else clearInterval(tmr);
        // }, 100);
        
    }
    function showAll() {
        loopGrid(function(cell) {cell.show = true;});
        vm.creator = true;
    }
    function hideAll() {
        vm.creator = false;
        loopGrid(function (cell) {cell.show = false;  });
    }
    function getRandomCell() {
        var i = Math.random();
        var j = Math.random();

        i *= vm.rowCount + 1;
        j *= vm.colCount + 1;

        i = Math.floor(i);
        j = Math.floor(j);
        
        i = Math.min(i, vm.rowCount - 1);
        j = Math.min(j, vm.colCount - 1);

        return vm.rows[i][j];
    }
    function analyzeCell(cell, fun) {
        var hidden = 0;
        var marked = 0;

        aroundCell(cell.i, cell.j, function(_cell) {
            if(!_cell.show)     hidden++;
            if(_cell.isMarked)  marked++;
        });


        if(cell.bombCount == hidden) {
            aroundCell(cell.i, cell.j, function(_cell){
                if(!_cell.show) {
                    _cell.isMarked = true;
                    fun && fun();
                }
            });
        }

        if(cell.bombCount == marked) { 
            middleClick(cell);
            cell.isFinished = true;
            fun && fun();
            vm.solverArr = vm.solverArr.filter((x) => x != cell);
        }
        // aroundCell(cell.i, cell.j, function(cell){
        //     if(marked == hidden) cell.isFinished = true;
        // })

    }
    var count = 0;
    var handle;
    
    function aymanSolve() {
        // if(vm.isGameOver) 
        //     clearInterval(handle);
        
        // vm.step++;

        // if(vm.step >= vm.solverArr.length) {
        //     vm.step = 0;
            
        //     if(vm.solverArr.length == 0) {
        //         var cell = getRandomCell();
    
        //         while(vm.solverArr.indexOf(cell) > -1) 
        //             cell = getRandomCell();
    
        //         vm.solverArr.push(cell);
        //     }
        // }

        // var cell = vm.solverArr[vm.step];
        // // if(cell) { 
        // //     vm.showCell(cell.i, cell.j);
        // //     analyzeCell(cell);
        // // }
        // vm.solverArr = [];
        // var count2 = 0;
        // loopGrid(function(cell){
        //     if(cell.show && !cell.isBomb) vm.solverArr.push(cell);
        //     if(cell.show)   { 
        //         analyzeCell(cell);
        //         count2 ++; 
        //     } 
        // });

        // if(count2 == count && !vm.isGameOver)  { 
        //     var cell = getRandomCell();
        //     while(cell.show || cell.isBomb) cell = getRandomCell();
        //     if(!cell.isBomb)
        //     vm.showCell(cell.i, cell.j);
        // }
        // count = count2;
    }

    var pushFlag;
    var run  = -1;
    var lastTime = -1;
    var flag = false;
    vm.step = 0;

    function solve() {
        run++;
        if(vm.isGameOver)  { 
            clearInterval(handle);
            return;
        }
        vm.step++;

        
        if(vm.step >= vm.solverArr.length) {
            vm.step = 0;
            if(!flag){
                console.warn('flag', flag);
                var cell = getRandomCell();
    
                while(cell.isPushed|| cell.isMarked)
                    cell = getRandomCell();
    
                pushCell(cell);

                if(!cell.show && !cell.isMarked)      vm.showCell(cell.i, cell.j);
                //flag = true;
            } else {
                flag = false;
            }
        }
        var cell = vm.solverArr[vm.step];

        if(cell.bombCount)  { 
            if(!cell.isFinished) {
                cell.isCurrent = true;
                analyzeCell(cell, () => flag =true);
                $timeout( function () { return function () { cell.isCurrent = false;} } (cell), 100)
            }
        }

        loopGrid(function(cell) {
            if(cell.show && !cell.isPushed)  { 
                pushCell(cell);
                // vm.step = 0;
            }
        })

        function pushCell(cell) {
            vm.solverArr.push(cell);
            cell.isPushed = true;
            flag=true;
        }

    }
    x = vm;
    InitGrid();
    // for(var i=0; i <10000; i++) solve();
    handle = $interval(solve, 1);

    function Cell(i, j, bomb, show) {
        this.i = i;
        this.j = j;
        this.isBomb = bomb || false;
        this.bombCount = 0;
        this.show = show;
    }
}
var x;