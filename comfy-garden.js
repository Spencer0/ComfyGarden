'use-strict';

const gridX = 250;
const gridY= 150;
const cellX = 16;
const cellY = 16;

document.addEventListener('DOMContentLoaded', function(event) {
    onInitalize();
    
})

function onInitalize(){
    console.log("Being programming");
    let layerZero = new CanvasLayerZero();
    console.log(layerZero.context);
}


//CLASSES 

//Controller
function CellManager(ctx){
    this.context = ctx;
    this.cells = [];
    this.currentTool = "shovel";

    const drawCell = (cell) =>{
        switch(cell.cellValue){
            case 'W':
                this.context.fillStyle = 'rgb(0, 232, 200)';
                break;
            case 'G':
                this.context.fillStyle = 'rgb(0, 232, 0)';
                break;
            default:
                this.context.fillStyle = 'rgb(50,100,50)';
                break;

        }
        this.context.fillRect(cell.cellPos.x, cell.cellPos.y, cell.cellSize.x, cell.cellSize.y);
    }

    const updateCell = (cell) => {
        console.log(this.currentTool)
        switch(this.currentTool){
            case 'shovel':
                if(cell.cellValue === 'D'){
                    cell.cellValue = 'W';
                }
                break;
            case 'seed':
                if(cell.cellValue ==='D'){
                    cell.cellValue = 'G';
                }
                break;
            case 'rake':
                if(cell.cellValue === 'G'){
                    cell.cellValue = 'D';
                }
                break;
            case 'bucket':
                if(cell.cellValue === 'W'){
                    cell.cellValue = 'D';
                }
                break;
        }
        return cell;
    }

    const init = () =>{
        for(let i = 0; i < (gridX); i++){
            this.cells[i] = [];
            for(let j = 0; j < (gridY); j++){
                //Random for now, in future this is where the fetch goes to the DB
                let newCell = new Cell({x: i*16, y: j*16})
                let coinFlip = Math.random();
                if(coinFlip <= 0.3){
                    newCell.cellValue = 'W'
                }else if(coinFlip <= 0.6){
                    newCell.cellValue = 'G'
                }else{
                    newCell.cellValue = 'D'
                }
                drawCell(newCell);
                this.cells[i][j] = newCell;
            }
        }
    }

    const gardenClickEvent = () => {
        let managerContext = this;
        document.getElementById('layer-zero').addEventListener('click', function(e){
            let x = parseInt(e.offsetX / 16);
            let y = parseInt(e.offsetY / 16);
            updateCell(managerContext.cells[x][y]);
            drawCell(managerContext.cells[x][y])
        });
    }

    const setCurrentTool = (x) => this.currentTool = x;
    init()
    gardenClickEvent();
    setEventListeners();
    
    function setEventListeners(){
        let managerContext = this;
        document.getElementById('tool-select').addEventListener('change', function(e){
            let garden = document.getElementById('garden');
            let cursorClasses = ['hoe-cursor', 'shovel-cursor', 'seed-cursor', 'bucket-cursor']
            cursorClasses.forEach(function(e){
                garden.classList.remove(e)
            })
            let newTool = e.srcElement.options[e.srcElement.selectedIndex].value;
            setCurrentTool(newTool);
            console.log(garden.classList, e, this.currentTool);
            switch(newTool){
                case 'rake':
                    garden.classList.add('hoe-cursor');
                    break;
                case 'seed':
                    garden.classList.add('seed-cursor');
                    break;
                case 'shovel':
                    garden.classList.add('shovel-cursor');
                    break;
                case 'bucket':
                    garden.classList.add('bucket-cursor');
                    break;
                default:
                    break;
            }
            console.log(garden.classList, e, this.currentTool);
        });
        this.currentTool = managerContext.currentTool;
    }

}

//View
function CanvasLayerZero(){
    this.canvas = document.getElementById('layer-zero');
    this.canvas.width = gridX * cellX;
    this.canvas.height =gridY * cellY;
    this.context = this.canvas.getContext('2d');
    this.cellManager = new CellManager(this.context);

};

//Model
function Cell(cellPos, cellSize = {x:cellX, y:cellY}, cellValue = 'D'){
    this.cellSize = cellSize;
    this.cellPos = cellPos;
    this.cellValue = cellValue;
}


//SPEC
//50 by 50 canvas
//Three tools
//Grass seed [Dirt -> Grass]
//Shovel [Dirt -> Water]
//Hoe [Grass -> Dirt]

//Canvas should have a list of cells, it should call draw on each cell
