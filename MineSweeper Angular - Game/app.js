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
        i = i < vm.rowCount && i > -1 ? i : null;
        j = j < vm.colCount && j > -1 ? j : null;
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
    var count = 0;
    var handle;
    
   
    
    x = vm;
    InitGrid();
    // for(var i=0; i <10000; i++) solve();
    

    function Cell(i, j, bomb, show) {
        this.i = i;
        this.j = j;
        this.isBomb = bomb || false;
        this.bombCount = 0;
        this.show = show;
    }
}
var x;