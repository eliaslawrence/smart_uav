// Elias Lawrence

const OBSTACLE_RED = 255; 	
const OBSTACLE_GREEN = 30;//0;
const OBSTACLE_BLUE = 86;//0;
let OBSTACLE_COLOR;

const STATION_RED   = 33;//0; 33, 191, 115
const STATION_GREEN = 191;//255;
const STATION_BLUE  = 115;//0;
let STATION_COLOR;

const CLIENT_RED   = 255;
const CLIENT_GREEN = 255;
const CLIENT_BLUE  = 255;
let CLIENT_COLOR;

const CLIENT_TYPE   = 3;
const OBSTACLE_TYPE = 2;
const STATION_TYPE  = 1;
const NOTHING_TYPE  = 0;
/////

var vehiclesPop    = [];
var vehicles       = [];
var energystations = [];
var obstacles      = [];
var clients        = [];

var numVehicles  = 100;
var numStations  = 10;
var numObstacles = 0;
var numClients   = 10;

var vehicleSize  = 10;

var obstacleMaxHeight = 15;
var obstacleMaxWidth  = 15;

var energyStationHeight = 8;
var energyStationWidth  = 8;

var clientMaxHeight = 8;
var clientMaxWidth  = 8;

let pg;
let nGraphicsLine = 4;
let pgWidth = 640;
let pgHeight = 360;
var mapa;

let brkga;
let decoder;
let currInd = 0;
let generation = 1;

let initY;
let initX;

var debug;
var bestDebug;
let currentIndP;
let bestQtyClients = 0;
let bestGenQtyClients = 0;
let bestGenFit = Infinity;
let slider;

function setup() {
    
    // Colors
    OBSTACLE_COLOR = color(OBSTACLE_RED, OBSTACLE_GREEN, OBSTACLE_BLUE);
    STATION_COLOR = color(STATION_RED, STATION_GREEN, STATION_BLUE);
    CLIENT_COLOR = color(CLIENT_RED, CLIENT_GREEN, CLIENT_BLUE);  
    
    
    let floorHeight = floor((numVehicles - 1) / nGraphicsLine) + 1;
    
//    createCanvas(pgWidth*nGraphicsLine, floorHeight*pgHeight); 
    
    createCanvas(pgWidth, pgHeight); 
    
//    console.log(floorHeight);
//    console.log(pgHeight);
//    console.log(floorHeight*pgHeight);
//    
//    console.log(height);
//    console.log(width);
    
//    mapa = new Map(width, height, pgWidth, pgHeight, pixels);
        
    for (var i = 0; i < numStations; i++) {
        var x = random(2*vehicleSize, pgWidth - 2*vehicleSize);
        var y = random(2*vehicleSize, pgHeight - 2*vehicleSize);
        energystations[i] = createVector(x, y);
    } 

    for (var i = 0; i < numObstacles; i++) {
        var x = random(2*vehicleSize, pgWidth - 2*vehicleSize);
        var y = random(2*vehicleSize, pgHeight - 2*vehicleSize);
        obstacles[i] = createVector(x, y);
    }    
    
    for (var i = 0; i < numClients; i++) {
        var x = random(2*vehicleSize, pgWidth - 2*vehicleSize);
        var y = random(2*vehicleSize, pgHeight - 2*vehicleSize);
        clients[i] = createVector(x, y);
    }
    
    pg = createGraphics(pgWidth, pgHeight)
    
    initY = random(pgHeight);
    initX = random(pgWidth);
    
    // BRKGA
    let chromoSize = getWeightsSize (37, 1, 18, 4);
    let top = 0.3;
    let bot = 0.3;
    let rho = 0.7;//0.7;    
    
    decoder = new Decoder();
    brkga   = new BRKGA(numVehicles, chromoSize, top, bot, rho, decoder);
    
    vehiclesPop = brkga.generateInitialPopulation();
        
    
//    let vehicleX = random(pgWidth);
//    let vehicleY = random(pgHeight);
//    for (var i = 0; i < numVehicles; i++) {
//        pg.push(createGraphics(pgWidth, pgHeight));
//        
//        let floorIndex = floor(i / nGraphicsLine);
//        let initY = floorIndex * pg[i].height;
//        let initX = (i - nGraphicsLine * floorIndex) * pg[i].width;
//        
//        vehicles[i] = new Vehicle(vehicleX, vehicleY, clients, energystations, obstacles, pg[i], initX, initY);
//    }    
    
    debug = createCheckbox();
    bestDebug = createCheckbox();
    slider = createSlider(1, 200, 1);
    currentIndP = createP();
}

//function mouseDragged() {
//  vehicles.push(new Vehicle(mouseX, mouseY, clients));
//}

//function mousePressed() {
//  vehicles[0].turnRight();
//}
//
//function keyPressed() {
//  if (keyCode === LEFT_ARROW) {
//    vehicles[0].turnLeft();
//  } else if (keyCode === RIGHT_ARROW) {
//    vehicles[0].turnRight();
//  } else if (keyCode === UP_ARROW) {
//    vehicles[0].accelerate();
//  } else if (keyCode === DOWN_ARROW) {
//    vehicles[0].brake();
//  }
//}

function draw() {
    for(let n = 0; n < slider.value(); n++){
        background(255);
//        pg.background(51);
        pg.background('#323232');
        
        let nDead = 0;
        for (currInd = 0; currInd < numVehicles; currInd++) {
//            console.log(currInd);
            if(vehiclesPop[currInd].individual.dead()){
                nDead++;
            } else {  
                // Vehicles    
                vehiclesPop[currInd].individual.update();
                
                if(vehiclesPop[currInd].individual.distance < bestGenFit){
                    bestGenFit = vehiclesPop[currInd].individual.distance;
                }
                
                if(vehiclesPop[currInd].individual.qtyClients > bestGenQtyClients){
                    bestGenQtyClients = vehiclesPop[currInd].individual.qtyClients;
                }

                if(vehiclesPop[currInd].individual.qtyClients > bestQtyClients){
                    bestQtyClients = vehiclesPop[currInd].individual.qtyClients;            
                }
            }
            
            if(!bestDebug.checked() || currInd == 0){
                vehiclesPop[currInd].individual.show();
            }
        }                
        
        image(pg, 0, 0);
        

        currentIndP.html("<h2>Generation: "        + generation                   + "<\h2>" + "\n" +
                         "<h3>Best Clients: "      + bestQtyClients               + "<\h3>" + "\n" +
                         "<h3>Best GEN Distance: " + bestGenFit                   + "<\h3>" + "\n" +
                         "<h3>Best GEN Clients: "  + bestGenQtyClients            + "<\h3>" + "\n" +
                         "<h3>Alive: "             + (vehiclesPop.length - nDead) + "<\h3>" + "\n");
        
        if(nDead == vehiclesPop.length){
            vehiclesPop = brkga.exec(vehiclesPop, 1);
            generation++;
//            currInd = 0;
            bestGenQtyClients = 0;
            bestGenFit = Infinity;
        }
    }
    
//    for (var i = vehicles.length - 1; i >= 0; i--) {
//        // Control
//        if (keyIsDown(LEFT_ARROW)) {
//          vehicles[i].turnLeft();
//        } else if (keyIsDown(RIGHT_ARROW)) {
//          vehicles[i].turnRight();
//        } else if (keyIsDown(UP_ARROW)) {
//          vehicles[i].accelerate();
//        } else if (keyIsDown(DOWN_ARROW)) {
//          vehicles[i].brake();
//        }
//
////        vehicles[i].boundaries();
////        vehicles[i].behaviors(energystations, obstacles);
//        vehicles[i].update();
//        vehicles[i].show();
//    
//        var newVehicle = vehicles[i].clone();
//        if (newVehicle != null) {
//            vehicles.push(newVehicle);
//        }
//    
//        if (vehicles[i].dead()) {
//            var x = vehicles[i].position.x;
//            var y = vehicles[i].position.y;
//            energystations.push(new EnergyStation(x, y, energyStationWidth));
//            vehicles.splice(i, 1);
//        }
//    }
//    
//    for (var i = 0; i < numVehicles; i++) {
//        image(pg[i], vehicles[i].initX, vehicles[i].initY);
//    }
}

//function draw() {
//    for(let n = 0; n < slider.value(); n++){
//        background(255);
//        pg.background(51);
//    //    for (var i = 0; i < numVehicles; i++) {
//    //        pg[i].background(51);
//    //    }
//
//
//
//    //    if (random(1) < 0.1) {
//    //      var x = random(width);
//    //      var y = random(height);
//    //      energystations.push(new EnergyStation(x, y, energyStationWidth));
//    //    }
//
//    //  if (random(1) < 0.01) {
//    //    var x = random(width);
//    //    var y = random(height);
//    //    poison.push(createVector(x, y));
//    //  }
//
//        // Energy Station
//    //    for (var i = 0; i < energystations.length; i++) {
//    //        energystations[i].show();
//    //    } 
//
//        // Obstacles
//    //    for (var i = 0; i < obstacles.length; i++) {
//    //        obstacles[i].show();
//    //    } 
//
//    //    image(pg, 0, 0);
//
//        // Vehicles    
//        vehiclesPop[currInd].individual.update();
//        vehiclesPop[currInd].individual.show();
//
//        if (vehiclesPop[currInd].individual.dead()) {                        
//            if(vehiclesPop[currInd].individual.distance < bestGenFit){
//                bestGenFit = vehiclesPop[currInd].individual.distance;
//            }
//            
////            if(bestGenFit == 0){
////                console.log("debug");
////            }
//
//            currInd++;
//            if(currInd >= vehiclesPop.length){
//                vehiclesPop = brkga.exec(vehiclesPop, 1);
//                console.log("next gen");
//                console.log(vehiclesPop[0].rk);
//                console.log(vehiclesPop[0].individual.brain.layers[1].neurons[0].weights);
//                generation++;
//                currInd = 0;
//                bestGenQtyClients = 0;
//                bestGenFit = Infinity;
//            }
//        }
//        
//        if(vehiclesPop[currInd].individual.qtyClients > bestGenQtyClients){
//            bestGenQtyClients = vehiclesPop[currInd].individual.qtyClients;
//        }
//
//        if(vehiclesPop[currInd].individual.qtyClients > bestQtyClients){
//            bestQtyClients = vehiclesPop[currInd].individual.qtyClients;            
//        }
//
//        currentIndP.html("<h2>Generation: " + generation + "<\h2>" + "\n" +
//                         "<h3>Individual: " + currInd + "<\h3>" + "\n" +
//                         "<p>Health: " + vehiclesPop[currInd].individual.health + "<\p>" + "\n" +
//                         "<p>Clients: " + vehiclesPop[currInd].individual.qtyClients + "<\p>" + "\n" +
//                         "<p>Fitness: " + vehiclesPop[currInd].individual.fitness + "<\p>" + "\n" +
//                         "<p>Distance: " + vehiclesPop[currInd].individual.distance + "<\p>" + "\n" +
//                         "<p>Best Clients: " + bestQtyClients + "<\p>" + "\n" +
//                         "<p>Best GEN Distance: " + bestGenFit + "<\p>" + "\n" +
//                         "<p>Best GEN Clients: " + bestGenQtyClients + "<\p>" + "\n");
//
//        image(pg, 0, 0);
//    }
//    
////    for (var i = vehicles.length - 1; i >= 0; i--) {
////        // Control
////        if (keyIsDown(LEFT_ARROW)) {
////          vehicles[i].turnLeft();
////        } else if (keyIsDown(RIGHT_ARROW)) {
////          vehicles[i].turnRight();
////        } else if (keyIsDown(UP_ARROW)) {
////          vehicles[i].accelerate();
////        } else if (keyIsDown(DOWN_ARROW)) {
////          vehicles[i].brake();
////        }
////
//////        vehicles[i].boundaries();
//////        vehicles[i].behaviors(energystations, obstacles);
////        vehicles[i].update();
////        vehicles[i].show();
////    
////        var newVehicle = vehicles[i].clone();
////        if (newVehicle != null) {
////            vehicles.push(newVehicle);
////        }
////    
////        if (vehicles[i].dead()) {
////            var x = vehicles[i].position.x;
////            var y = vehicles[i].position.y;
////            energystations.push(new EnergyStation(x, y, energyStationWidth));
////            vehicles.splice(i, 1);
////        }
////    }
////    
////    for (var i = 0; i < numVehicles; i++) {
////        image(pg[i], vehicles[i].initX, vehicles[i].initY);
////    }
//}