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
    let chromoSize = getWeightsSize (nnInputSize, 1, 18, 4);
    let top = 0.3;
    let bot = 0.3;
    let rho = 0.7;//0.7;    
    
    decoder = new Decoder();
    brkga   = new BRKGA(numVehicles, chromoSize, top, bot, rho, decoder);        
    
    // Checkbox
    setCheckboxes();
    
    // Info
    loopSpeedP = createP();
    
    // Slider    
    setSlider();
    
    // Info
    currentIndP = createP();
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
        
        if(waveFront){
            waveFront.propagate(); 
            waveFront.show();
        } 
        
        problem.show();                
          
        let nDead = 0;
        if(start){
            bestGenDistRef = Infinity;
            bestDistRef = Infinity;
            for (currInd = 0; currInd < numVehicles; currInd++) {
                if(vehiclesPop[currInd].individual.isDead()){
                    nDead++;
                } else {  
                    // Vehicles    
                    vehiclesPop[currInd].individual.update();

                    if(vehiclesPop[currInd].individual.distance < bestGenFit){
                        bestGenFit = vehiclesPop[currInd].individual.distance;
                    }

                    if(vehiclesPop[currInd].individual.qtyWayPoints > bestGenQtyWayPoints){
                        bestGenQtyWayPoints = vehiclesPop[currInd].individual.qtyWayPoints;
                    }

                    if(vehiclesPop[currInd].individual.qtyWayPoints > bestQtyWayPoints){
                        bestQtyWayPoints = vehiclesPop[currInd].individual.qtyWayPoints;            
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

                if(!bestDebug.checked() || currInd == 0){
                    vehiclesPop[currInd].individual.show();
                }
            }
            
            if(nDead == vehiclesPop.length){
                vehiclesPop = brkga.exec(vehiclesPop, 1);
                generation++;
                bestGenQtyWayPoints = 0;
                bestGenFit = Infinity;
                bestGenIndRef = 0;
                bestGenDistRef = Infinity;
            }
        }                

        image(pg, 0, 0);


        loopSpeedP.html("<h2>Loop Speed: " + loopSpeed + "<\h2>");  
        
        currentIndP.html("<h2>Generation: "        + generation                   + "<\h2>" + "\n" +
//                         "<h3>Best Way Points: "      + bestQtyWayPoints               + "<\h3>" + "\n" +
//                         "<h3>Best GEN Distance: " + bestGenFit                   + "<\h3>" + "\n" +
                         "<h3>Best GEN Way Points: "  + bestGenQtyWayPoints            + "<\h3>" + "\n" +
                         "<h3>Best INDEX reference: " + bestIndRef               + "<\h3>" + "\n" +                    
                         "<h3>Best GEN INDEX reference: " + bestGenIndRef               + "<\h3>" + "\n" +
//                         "<h3>Best GEN distance reference: " + bestGenDistRef               + "<\h3>" + "\n" +
//                         "<h3>Best distance reference: " + bestDistRef               + "<\h3>" + "\n" +
                         "<h3>Alive: "             + (vehiclesPop.length - nDead) + "<\h3>" + "\n");        
        
    }
}