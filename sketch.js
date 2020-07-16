// Elias Lawrence

function setup() { 
    createCanvas(pgWidth, pgHeight);  
    pg = createGraphics(pgWidth, pgHeight);
        
    // Colors
    setColors();   
    
    // DOM manipulation
    setDOM();
    
    // Problem
    problem = new Problem();
    setProblemConfig();
            
//    initY = random(pgHeight);
//    initX = random(pgWidth);
    
    // BRKGA
    let chromoSize = getWeightsSize (nnInputSize, nnHiddens, nnHiddenSize, 4);
    let top  = 0.3;
    let cros = 0.3;
    let bot  = 0.1;
    let rho  = 0.9;//0.7;    
    
    decoder = new Decoder();
    brkga   = new BRKGA(numVehicles, chromoSize, top, cros, bot, rho, decoder);        
    
    // Checkbox
    setCheckboxes();            
    
    // Info
    currentIndP = createP();
    
    // Vehicle Index
    vehicleIndP = createP(); 
    setVehicleIndBt();
    
    // Loop Speed
    loopSpeedP = createP(); 
    setLoopSpeedBt();
    
    // GEN duration
    genDurP = createP(); 
    setGenDurBt();         
}

function draw() {       
    for(let n = 0; n < loopSpeed; n++){
        background(255);
//        pg.background(51);
        pg.background('#323232');  
//        pg.background(255);
        
//        if(astar){
//            astar.astar(); 
//            astar.show();
//        } 
        
        if(waveFrontDebug.checked() && waveFront){
            waveFront.show();
        }                        
        
        if(sectorsDebug.checked()){
            drawSectors();            
        } 
        
        problem.show();                      
          
        let nDead = 0;
        if(start){
            if(generation <= 100){
                bestGenDistRef = Infinity;
                bestDistRef = Infinity;
                for (var currInd = 0; currInd < vehiclesPop.length; currInd++) {
                    if(vehiclesPop[currInd].individual.isDead(currInd)){
                        nDead++;

    //                    if(vehiclesPop[currInd].individual.fitness > bestGenQtyWayPoints){
    //                        bestGenQtyWayPoints = vehiclesPop[currInd].individual.fitness;
    //                    }
    //
    //                    if(vehiclesPop[currInd].individual.fitness > bestQtyWayPoints){
    //                        bestQtyWayPoints = vehiclesPop[currInd].individual.fitness;            
    //                    }
                    } else {  
                        // Vehicles    
                        vehiclesPop[currInd].individual.update();

                        if(vehiclesPop[currInd].individual.fitness > bestGenQtyWayPoints){
                            bestGenQtyWayPoints = vehiclesPop[currInd].individual.fitness;
                        }

                        if(vehiclesPop[currInd].individual.fitness > bestQtyWayPoints){
                            bestQtyWayPoints = vehiclesPop[currInd].individual.fitness;            
                        }

                        if(vehiclesPop[currInd].individual.distance < bestGenFit){
                            bestGenFit = vehiclesPop[currInd].individual.distance;
                        }

                        if(vehiclesPop[currInd].individual.bestIndRef > bestGenIndRef){
                            bestGenIndRef = vehiclesPop[currInd].individual.bestIndRef;
                        }

                        if(vehiclesPop[currInd].individual.bestIndRef > bestIndRef){
                            bestIndRef = vehiclesPop[currInd].individual.bestIndRef;            
                        }

                        if(vehiclesPop[currInd].individual.distToRef < bestGenDistRef){
                            bestGenDistRef = vehiclesPop[currInd].individual.distToRef;
                        }

                        if(vehiclesPop[currInd].individual.distToRef < bestDistRef){
                            bestDistRef = vehiclesPop[currInd].individual.distToRef;            
                        }
                    }                                

                    if(!bestDebug.checked() || currInd == vehicleIndex){
                        if(sectorsVisitedDebug.checked()){
                            vehiclesPop[currInd].individual.drawSectors(); 
                        }                    
                        vehiclesPop[currInd].individual.show();
                    }
                }
                
            }else{
                console.log("END");
            }
            
            currentIndP.html("<h2>Generation: " + generation + "<\h2>" + "\n" +
                         "<h3>Best Points: "  + bestQtyWayPoints + "<\h3>" + "\n" +
                         "<h3>Best GEN Points: " + bestGenQtyWayPoints + "<\h3>" + "\n" +
                         "<h3>Alive: " + (vehiclesPop.length - nDead) + "<\h3>" + "\n");  
            
            if(nDead == vehiclesPop.length){
//                var randOriginPos = random();
                
//                if(randOriginPos < 0.1){
                
//                if((generation % 1) == 0){
//                    var randomX;
//                    var randomY;
//                    do{
//                        randomX = random(20, pg.width - 20);
//                        randomY = random(20, pg.height - 20);        
//                    }while(vehiclesPop[0].individual.map.containsObstacle(randomX, randomY,20) || vehiclesPop[0].individual.map.containsStation(randomX, randomY,20) || vehiclesPop[0].individual.map.containsWayPoint(randomX, randomY,20));
//                    
//                    problem.origin = new Origin(randomX, randomY, originMaxHeight, pg);
//                }
                
                vehiclesPop = brkga.exec(vehiclesPop, 1);
                generation++;
                bestGenQtyWayPoints = 0;
                bestGenFit = Infinity;
                bestGenIndRef = 0;
                bestGenDistRef = Infinity;
            }
        }                

        image(pg, 0, 0);

        // GEN duration
        genDurP.html("<h2>Gen Max Duration: " + genMaxDuration + "<\h2>"); 
        
        // Loop speed
        loopSpeedP.html("<h2>Loop Speed: " + loopSpeed + "<\h2>");  
        
        // Vehicle IndexvehicleIndP
        vehicleIndP.html("<h2>Vehicle Index: " + vehicleIndex + "<\h2>");  
        
//        currentIndP.html("<h2>Generation: "        + generation                   + "<\h2>" + "\n" +
//                         "<h3>Best Way Points: "      + bestQtyWayPoints               + "<\h3>" + "\n" +
//                         "<h3>Best GEN Distance: " + bestGenFit                   + "<\h3>" + "\n" +
//                         "<h3>Best Points: "  + bestQtyWayPoints            +
//                         "<h3>Best GEN Points: "  + bestGenQtyWayPoints            + "<\h3>" + "\n" +
//                         "<h3>Best INDEX reference: " + bestIndRef               + "<\h3>" + "\n" +                    
//                         "<h3>Best GEN INDEX reference: " + bestGenIndRef               + "<\h3>" + "\n" +
//                         "<h3>Best GEN distance reference: " + bestGenDistRef               + "<\h3>" + "\n" +
//                         "<h3>Best distance reference: " + bestDistRef               + "<\h3>" + "\n" +
//                         "<h3>Alive: "             + (vehiclesPop.length - nDead) + "<\h3>" + "\n");        
        
    }
}

function drawSectors(){
    pg.stroke(0);
    pg.strokeWeight(2);
    for (let i = 0; i < numSectorsX; i++) {
        pg.line(i*pgWidth/numSectorsX, 0, i*pgWidth/numSectorsX, pgHeight);
    }
    
    for (let i = 0; i < numSectorsY; i++) {
        pg.line(0, i*pgHeight/numSectorsY, pgWidth, i*pgHeight/numSectorsY);
    }
}