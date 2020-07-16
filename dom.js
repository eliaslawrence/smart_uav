// MAP
let pMap;
let pMap2;
let pMap3;
    
// MODEL
let pModel;
let pModelBtn;

// Checkbox
var debug;
var bestDebug;
var sectorsDebug;
var waveFrontDebug;
var sectorsVisitedDebug;

function mapFileSelected(file){  
    console.log("LOAD MAP");
    var reader = new FileReader();
    reader.readAsText(file.file);
    reader.onload = function () {
        problem.load(JSON.parse(reader.result));
        
        pMap.style('display', 'none');
        pMap2.style('display', 'block');
        pModel.style('display', 'block'); 
        pModelBtn.style('display', 'block');
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
}

function modelFileSelected(file){  
    console.log("LOAD MODEL");
    var reader = new FileReader();
    reader.readAsText(file.file);
    reader.onload = function () {
        vehiclesPop = brkga.loadInitialPopulation(JSON.parse(reader.result));  
        start = true;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
}

function setDOM(){
    // Paragraph
    pMap   = select('#p-map');
    pMap2  = select('#p-map-2');
    pMap3  = select('#p-map-3');
    
    pMap2.style('display', 'none');
    pMap3.style('display', 'none');
    
    pModel    = select('#p-model');
    pModelBtn = select('#p-model-btn');
    
    pModel.style('display', 'none');
    pModelBtn.style('display', 'none');    

    // BUTTONS
    let finishButton = select('#finish-map');    
    finishButton.mousePressed(function() {
        problem.finish();          
        
        let wpMapButton = select('#way-point-map');           
        let eMapButton  = select('#energy-station-map');            
        let oMapButton  = select('#obstacle-map'); 
        
        wpMapButton.addClass('white-bg');
        eMapButton.addClass('white-bg');
        oMapButton.addClass('white-bg');
        
        console.log("FINISH MAP");

        pMap3.style('display', 'none');
        pMap2.style('display', 'block');
        pModel.style('display', 'block'); 
        pModelBtn.style('display', 'block');
    });
    
    let newMapButton = select('#new-map');    
    newMapButton.mousePressed(function() {
        problem = new Problem(); 
        console.log("NEW MAP");

        pMap.style('display', 'none');
        pMap3.style('display', 'block');                
    });
    
    // LOAD MAP
    let input = createFileInput(mapFileSelected);
    input.id('input-map');

    let randomMapButton = select('#random-map');    
    randomMapButton.mousePressed(function() {
        console.log("RANDOM MAP");

        pMap.style('display', 'none');
        pMap2.style('display', 'block');
        pModel.style('display', 'block');
        pModelBtn.style('display', 'block');
    });

    let saveMapButton = select('#save-map');    
    saveMapButton.mousePressed(function() {
        problem.save();
        console.log("SAVE MAP");
    });

    let startButton = select('#start');    
    startButton.mousePressed(function() {
        vehiclesPop = brkga.generateInitialPopulation();
        start = true;
        console.log("START");        
    });

    // LOAD MODEL
    let inputModel = createFileInput(modelFileSelected);
    inputModel.id('input-model');
    
//    let loadButton = select('#load');    
//    loadButton.mousePressed(function() {
//        brkga.loadInitialPopulation();
//        start = true;
//        console.log("LOAD");
//    });

    let saveButton = select('#save');    
    saveButton.mousePressed(function() {
        brkga.savePopulation(vehiclesPop);
        console.log("SAVE");
    });
    
    let fitButton = select('#saveFit');    
    fitButton.mousePressed(function() {
        save(fitToSave, 'fitness.json');
        console.log("SAVE FITNESS");
    });

    let clearButton = select('#clear');    
    clearButton.mousePressed(function() {
        problem = new Problem(); 
        start = false;
        console.log("CLEAR");

        pMap.style     ('display', 'block');
        pModel.style   ('display', 'none');
        pModelBtn.style('display', 'none');
        pMap2.style    ('display', 'none');
    });
}

function setCheckboxes() {
    createP();
    debug               = createCheckbox('Show sensors');
    bestDebug           = createCheckbox('Just one');
    sectorsDebug        = createCheckbox('Show Sectors');
    sectorsVisitedDebug = createCheckbox('Sectors Visited');
    waveFrontDebug      = createCheckbox('Wave Front');
    createP();
}

function addLS() {
    loopSpeed = loopSpeed == 200 ? 200 : loopSpeed + 1;
}

function subLS() {
    loopSpeed = loopSpeed == 1 ? 1 : loopSpeed - 1;
}

function setLoopSpeedBt() {
    subLSBt = createButton('-');
    subLSBt.addClass('button');
    subLSBt.addClass('red-bg');
    subLSBt.addClass('border-rd-30');
    subLSBt.mousePressed(subLS);
    
    addLSBt = createButton('+');
    addLSBt.addClass('button');
    addLSBt.addClass('border-rd-30');
    addLSBt.addClass('margin-left-10');
    addLSBt.mousePressed(addLS);
}

function addGD() {
    genMaxDuration += 50;
}

function subGD() {
    genMaxDuration = genMaxDuration == 50 ? 50 : genMaxDuration - 50;
}

function setGenDurBt() {
    subLSBt = createButton('-');
    subLSBt.addClass('button');
    subLSBt.addClass('red-bg');
    subLSBt.addClass('border-rd-30');
    subLSBt.mousePressed(subGD);
    
    addLSBt = createButton('+');
    addLSBt.addClass('button');
    addLSBt.addClass('border-rd-30');
    addLSBt.addClass('margin-left-10');
    addLSBt.mousePressed(addGD);
}

function addVI() {
    vehicleIndex = vehicleIndex == vehiclesPop.length - 1 ? vehiclesPop.length - 1 : vehicleIndex + 1;
}

function subVI() {
    vehicleIndex = vehicleIndex == 0 ? 0 : vehicleIndex - 1;
}

function setVehicleIndBt() {
    subLSBt = createButton('-');
    subLSBt.addClass('button');
    subLSBt.addClass('red-bg');
    subLSBt.addClass('border-rd-30');
    subLSBt.mousePressed(subVI);
    
    addLSBt = createButton('+');
    addLSBt.addClass('button');
    addLSBt.addClass('border-rd-30');
    addLSBt.addClass('margin-left-10');
    addLSBt.mousePressed(addVI);
}