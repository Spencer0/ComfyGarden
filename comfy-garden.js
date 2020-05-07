'use-strict';

//API Call to set these (so i can configure from the database)
const gridX = 125;
const gridY = 75;
const cellX = 16;
const cellY = 16;

document.addEventListener('DOMContentLoaded', function(event) {
    onInitalize();
})

function onInitalize(){
    let layerZero = new CanvasLayerZero();
    let cellManager = new CellManager(layerZero.context);
}


//CLASSES 

//Controller
function CellManager(ctx){
    this.context = ctx;
    this.cells = [];
    this.currentTool = "shovel";
    const setCurrentTool = (x) => this.currentTool = x;
    const setCurrentCells = (x) => this.cells = x;

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

    const parseMapArrayAndDraw = (map) => {
        let i = 0;
        let j = 0;
        for(cellRow of map){
            this.cells[i] = [];
            for(cell of cellRow){
                let cellPos = cell.cellPos;
                let cellValue = cell.cellValue;
                let newCell = new Cell(cellPos, cellSize = {x:cellX, y:cellY}, cellValue = cellValue)
                this.cells[i][j] = newCell;
                drawCell(cell)
                j++;
            }
            i++;
            j = 0;
        }
    }

    const randomlyGenerateMap = () =>{
        for(let i = 0; i < (gridX); i++){
            this.cells[i] = [];
            for(let j = 0; j < (gridY); j++){
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

    const init = () =>{
        
        fetch("https://d6jiz6o9h1.execute-api.us-east-1.amazonaws.com/garden", {
            mode: 'cors',
            headers: {
              'Access-Control-Allow-Origin':'*',
              'Access-Control-Allow-Headers':'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
            }
          }) 
        .then(response => response.json())
        .then(data => {
            parseMapArrayAndDraw(data.body.map);
        })
        .catch(function(e) {
            console.log(e)
            randomlyGenerateMap()
            saveMap()
        });
        
    }

    const gardenClickEvent = () => {
        let managerContext = this;
        document.getElementById('layer-zero').addEventListener('click', function(e){
            let x = parseInt(e.offsetX / 16);
            let y = parseInt(e.offsetY / 16);
            
            updateCell(managerContext.cells[x][y]);
            drawCell(managerContext.cells[x][y]);
            setCurrentCells(managerContext.cells);
            saveMap()
            
        });
        
    }

    const saveMap = () =>{
        fetch('https://d6jiz6o9h1.execute-api.us-east-1.amazonaws.com/garden', {
            headers: { 'Content-Type': 'application/json',  'Access-Control-Allow-Origin':'*' }, // tells the server we have json
            method:'PUT', // can be POST
            body: JSON.stringify({"body" : {"map": this.cells}}), // json is sent to the server as text
          }).then(response => response.json())
          .then(data => {
              console.log(data)
          })
          .catch(function(e) {
              console.log(e)
          });
          /*
        fetch("https://d6jiz6o9h1.execute-api.us-east-1.amazonaws.com/garden", {
            mode: 'cors',
            method: 'PUT',
            body: {"body" : {"map": this.cells} },
            headers: {
              'Access-Control-Allow-Origin':'*',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Headers':'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
            }
          }) 
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(function(e) {
            console.log(e)
        });
        */
    }

    init();
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
        });
        this.currentTool = managerContext.currentTool;
    }
}

//View
function CanvasLayerZero(){
    this.canvas = document.getElementById('layer-zero');
    this.canvas.width = gridX * cellX;
    this.canvas.height = gridY * cellY;
    this.context = this.canvas.getContext('2d');
}

//Model
function Cell(cellPos, cellSize = {x:cellX, y:cellY}, cellValue = 'D'){
    this.cellSize = cellSize;
    this.cellPos = cellPos;
    this.cellValue = cellValue;
}

