// Elias Lawrence

var mr          = 0.01;
var numSensors  = 7;

let numSectorsX = 8;
let numSectorsY = 5;
var nnInputSize = numSensors * 2 + 3 + numSectorsX * numSectorsY + 2;// + 1 + numSectorsX * numSectorsY + 2;//6;
//var nnInputSize = numSectorsX * numSectorsY + 1;//6;
var nnHiddenSize = 32;
var nnHiddens    = 2;

let maxWSensor    = 50; 
let maxHSensor    = 50; 
let maxSizeSensor = 50;

function Vehicle(_problem, _graphics, _initX, _initY) {
    this.acceleration = createVector(0, 0);
    this.velocity     = createVector(0, -2);
    this.direction    = createVector(0, -2);
    this.r = 5;
    this.rotationspeed = 0.02;
    this.maxspeed = 0.5;
    this.maxforce = 0.005;

    this.health = 1;
    
    // A *
    this.distToRef  = 0;
    this.bestIndRef = 0;           
    this.distWP     = Infinity;
    this.lastWP     = 0;
    this.sumWP      = 0;
    
    // Vision
    this.numSensors = numSensors;    
    this.sensors = [];
    this.vision = [];
    this.target = createVector(0, 0);
    
    // NN
    this.brain            = new NeuralNetwork(nnInputSize, nnHiddens, nnHiddenSize, 4);//1, 18, 4);
    this.lastWayPointTime = 0;
    this.time             = 0;
    this.fitness          = 0;
    this.qtyWayPoints     = 0;
    this.lastQtyWayPoints = 0;
    this.distance         = Infinity;
    this.collide          = false;
    
    this.graphics = _graphics;
    this.initX    = _initX;
    this.initY    = _initY;
    
    // Way Points
    this.wayPoints = [];
    this.distToWP  = [];
    
    for(let i = 0; i < _problem.wayPoints.length; i++){
        this.wayPoints.push(new WayPoint(_problem.wayPoints[i].x, _problem.wayPoints[i].y, wayPointMaxWidth, wayPointMaxHeight, this.graphics));
        this.distToWP.push(Infinity);
    }
    this.numWayPoints = this.wayPoints.length;
    
    // Energy Stations
    this.energystations = [];
    
    for(let i = 0; i < _problem.energystations.length; i++){
        this.energystations.push(new EnergyStation(_problem.energystations[i].x, _problem.energystations[i].y, energyStationWidth, energyStationHeight, this.graphics));
    }
    
    // Obstacles
    this.obstacles = [];
    
    for(let i = 0; i < _problem.obstacles.length; i++){
        this.obstacles.push(new Obstacle(_problem.obstacles[i].x, _problem.obstacles[i].y, _problem.obstacles[i].w, _problem.obstacles[i].h, this.graphics));
    }
    
    // Map
    this.map = new Map(this.graphics.width, this.graphics.height, this.initX, this.initY, this.obstacles, this.wayPoints, this.energystations);   
    
    // Origin Position
    this.position     = createVector(_problem.origin.x, _problem.origin.y); 
//    var randomX;
//    var randomY;
//    
//    do{
//        randomX = random(20, _graphics.width - 20);
//        randomY = random(20, _graphics.height - 20);        
//    }while(this.map.containsObstacle(randomX, randomY,20) || this.map.containsStation(randomX, randomY,20) || this.map.containsWayPoint(randomX, randomY,20));
//    
//    this.position     = createVector(randomX, randomY); 
    this.lastPosition = createVector(this.position.x, this.position.y);
    
    // Sectors    
    this.sectors = [];    
    for(let i = 0; i < numSectorsX * numSectorsY; i++){
        this.sectors.push(0);
    }
    this.numSectors    = 0;
    this.currentSector = this.map.getSector(this.position.x, this.position.y);
    this.sectorTarget  = this.currentSector;
    this.sectors[this.currentSector] = 1;
    
    this.loadPixels = true;
    // Method to update location
    this.update = function() {        
//        this.health -= 0.0005;
        this.time++;

        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset accelerationelertion to 0 each cycle
        this.acceleration.mult(0);

    //    this.lastPosition = createVector(this.position.x, this.position.y); 

        this.collisionDetection();
        
        if(this.time > genMaxDuration){
            this.health = 0;
        }
        
        if(this.health <= 0){
            this.updateFitByDistToWP();
        }
        
        // Reference
        this.setSectorVisited();
        this.calculateDistanceToWP();
//        this.calculateDistanceToReference();

        // NN
        this.look();
        this.think();                                   
//        this.seek(this.target);
    };
    
    // FITNESS
    this.operations = [];
    this.updateFitByDistToWP = function() {
//        let diagonal = Math.sqrt(this.graphics.width * this.graphics.width + this.graphics.height * this.graphics.height);
//        
//        for(dist of this.distToWP){
//            this.subFitness(dist/diagonal);
//        }
    }
        
    this.subFitness = function(value){
        this.fitness -= value;
        this.operations.push(-value);
    }
    
    this.addFitness = function(value){
        this.fitness += value;
        this.operations.push(value);
    }
    
    this.applyForce = function(force) {
        // We could add mass here if we want A = F / M
        this.acceleration.add(force);
    };
    
    // COMPARISON
    this.betterThan = function(b) {        
        return this.fitness > b.fitness;
    }
    
    this.betterThan2 = function(b) {
        if(this.qtyWayPoints > b.qtyWayPoints){
            return true;
        }else if(this.qtyWayPoints == b.qtyWayPoints){
            if(this.qtyWayPoints > 0){
//                return this.distance < b.distance;
               return this.lastWayPointTime < b.lastWayPointTime;
            } 
            
//            else if(this.collide){ // a collides
//                if(b.collide){ // a & b collide
//                    return this.distance < b.distance;
////                    return this.time < b.time;
//                }else{ // just a collides
//                    return false;
//                }                
//            } else if(b.collide){ // just b collides
//                return true;
//            }
            
            return this.distance < b.distance;
//            return this.time < b.time;   // a & b don't collide
        }
        
        return false;
    }
    
    // COLLISION
    this.collisionDetection = function() {
        this.obstacleCollision(this.obstacles);
        this.stationCollision(this.energystations, 0.5);
        this.wayPointCollision(this.wayPoints);
        this.edgeCollision();
    };
        
    this.wayPointCollision = function(list) {
        for (var i = list.length - 1; i >= 0; i--) {
            var d = this.position.dist(createVector(list[i].position.x + list[i].r/2, list[i].position.y + list[i].r/2));
            
            if(d < this.distToWP[i]){
               this.distToWP[i] = d;
            }
            
            if(d < this.distance){
                this.distance = d;
            }
            
            if (d < list[i].r/2 + this.r){//this.maxspeed) {
                list.splice(i, 1);
                this.distToWP.splice(i, 1);
                
                this.qtyWayPoints++;
//                this.addFitness(1);
                this.fitness = 2;
                this.lastWayPointTime = this.time;             
                   
                this.loadPixels = true;
                
                this.map.update(this.obstacles, this.wayPoints, this.energystations);
                break;
            } 
        }
    };
    
    this.stationCollision = function(list, nutrition) {
        for (var i = list.length - 1; i >= 0; i--) {
            var d = this.position.dist(createVector(list[i].position.x + list[i].r/2, list[i].position.y + list[i].r/2));
            
            if (d < list[i].r/2  + this.r) {
                this.health += nutrition;
                break;
            } 
        }
        
        this.health = Math.min(this.health, 1);
    };
    
    this.obstacleCollision = function(list) {
        for (var i = list.length - 1; i >= 0; i--) {                
            var d_x = this.position.dist(createVector(list[i].position.x + list[i].w/2, this.position.y));
            var d_y = this.position.dist(createVector(this.position.x, list[i].position.y + list[i].h/2));
            
            if (d_x < list[i].w/2 + this.r && d_y < list[i].h/2 + this.r) {
                this.health = 0;
                this.collide = true;
//                this.subFitness(this.numWayPoints/2);
                break;
            }                         
        }
    };
    
    this.edgeCollision = function() {            
        if (this.position.x > this.graphics.width  || this.position.x < 0 || 
            this.position.y > this.graphics.height || this.position.y < 0) {
            this.health = 0;
            this.collide = true;
//            this.subFitness(this.numWayPoints/2);
        } 
    };
    
    this.eat = function(list, nutrition, perception) {
        var record = Infinity;
        var closest = null;
        for (var i = list.length - 1; i >= 0; i--) {
            var d = this.position.dist(list[i].position);
            
            if (d < this.maxspeed) {
                list.splice(i, 1);
                this.health += nutrition;
            } else {
                if (d < record && d < perception) {
                    record = d;
                    closest = list[i];
                }
            }
        }
        
        // This is the moment of eating!
        
        if (closest != null) {
            return this.seek(closest.position);
        }
        
        return createVector(0, 0);
    };
    
    // A method that calculates a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    this.seek = function(target) {
        var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
        
        // Scale to maximum speed
        desired.setMag(this.maxspeed);
        
        // Steering = Desired minus velocity
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce); // Limit to maximum steering force
        
//        return steer;
        this.applyForce(steer);
    };
    
    this.ind;
    this.isDead = function(ind) {
        this.ind = ind;
//        let smallerDistance = Infinity;
//        let d;
//        for (let i = 0; i < this.wayPoints.length; i++) {
//            d = this.position.dist(this.wayPoints[i].position);
//            
//            if(d < smallerDistance){
//                smallerDistance = d;
//            }
//        }
//        
//        this.distance = smallerDistance;
        if(this.health <= 0){
//            this.calculateDistanceToWP();
            return true;
        }
        
        return this.wayPoints.length == 0;
    };
    
    // SENSORS    
    this.updateSensors2 = function() {
        var record = Infinity;
        var errorMargin;
        for (var i = 0; i < obstacles.length; i++) {
            let v = p5.Vector.sub(obstacles[i].position, vehicles[0].position);
            errorMargin = asin(obstacles[i].w / (2 * v.mag()));
            if(v.heading() <= vec.heading() + errorMargin && 
               v.heading() >= vec.heading() - errorMargin && 
               v.mag() < vec.mag()){
                myColor = 'red';
                vec.setMag(v.mag());
            }        
        }
    }
    
    this.updateSensors = function() { 
        let type;
        for(var index = 0; index < this.numSensors; index++){
            type = NOTHING_TYPE;//OBSTACLE_TYPE;
            
//            var angle = this.velocity.heading() + index * 2 * PI / this.numSensors;
            var angle = this.velocity.heading() + index * PI / (this.numSensors - 1) - PI / 2;            
        
            var tempX = this.position.x;
            var tempY = this.position.y;

            let deltaX = cos(angle);
            let deltaY = sin(angle);
            
            let sensorW = tempX - this.position.x;
            let sensorH = tempY - this.position.y;

            loop:
            while(Math.sqrt(sensorW*sensorW + sensorH*sensorH) < maxSizeSensor){
//                tempX < this.position.x + maxWSensor && tempX > this.position.x - maxWSensor &&
//                  tempY < this.position.y + maxHSensor && tempY > this.position.y - maxHSensor){
                
                if(!this.map.isValid(tempX, tempY) || this.map.isObstacle(tempX, tempY)){ 
                    type = OBSTACLE_TYPE;
                    break loop;
                } else if(this.map.isStation(tempX, tempY)){
                    type = STATION_TYPE;
                    break loop;                          
                } 
                else if(this.map.isWayPoint(tempX, tempY)){
                    type = WAY_POINT_TYPE;                                        
                    break loop;                          
                }
                
                

//                for (var i = 0; i < obstacles.length; i++) {
//                    if (obstacles[i].contains(tempX, tempY)) {
//                        myColor = 'red';
//                        break loop;
//                    }     
//                }

                tempX += deltaX;
                tempY += deltaY;
                
                sensorW += deltaX;
                sensorH += deltaY;
            }
//
            let vec = createVector(sensorW, sensorH);//tempX - this.position.x, tempY - this.position.y);
            
//            var record = Infinity;
//            var errorMargin;
//            for (var i = 0; i < obstacles.length; i++) {
//                let v = p5.Vector.sub(obstacles[i].position, this.position);
//                errorMargin = asin(obstacles[i].w / (2 * v.mag()));
//                if(v.heading() <= vec.heading() + errorMargin && 
//                   v.heading() >= vec.heading() - errorMargin && 
//                   v.mag() < vec.mag()){
//                    myColor = 'red';
//                    vec.setMag(v.mag());
//                }        
//            }

            
            
//            if(generation != 1 && this.ind == 0 && type != lastV.individual.sT[this.sT.length - 1]){
//               let test = 0;
//            }
//            
//            if(generation != 1 && this.ind == 0 && vec.mag() != lastV.individual.sM[this.sM.length - 1]){
//               let test = 0;
//            }
            
            this.sensors[index] = new Sensor(this.position, vec, type, this.graphics);
        }    

    }
    
    // DRAW
    
    this.drawSectors = function(){  
//        if (debug.checked() && sectorsDebug.checked()) {
            let secWidth  = this.graphics.width / numSectorsX;
            let secHeight = this.graphics.height / numSectorsY;

            pg.stroke(0);
            pg.strokeWeight(2);
            pg.fill(255);

            for (let i = 0; i < this.sectors.length; i++) {
                if(this.sectors[i] == 1){
                   pg.rect((i % numSectorsX) * secWidth, (Math.floor(i / numSectorsX)) * secHeight, pgWidth/numSectorsX, pgHeight/numSectorsY); 
                }
            }  

            // Obstacles
            for(let i = 0; i < this.obstacles.length; i++){
                this.obstacles[i].show();
            }  

            // Energy Stations
            for(let i = 0; i < this.energystations.length; i++){
                this.energystations[i].show();
            } 
//        }
    }
    
    this.show = function() {
        // Draw a triangle rotated in the direction of velocity
//        var angle = this.direction.heading() + PI / 2;
        var angle = this.velocity.heading() + PI / 2;
        
        
        // Obstacles
//        for(let i = 0; i < this.obstacles.length; i++){
//            this.obstacles[i].show();
//        }  
        
        // Energy Stations
//        for(let i = 0; i < this.energystations.length; i++){
//            this.energystations[i].show();
//        } 
        
        // Way Points
        for(let i = 0; i < this.wayPoints.length; i++){
            this.wayPoints[i].show();
        } 
        
        if(this.health > 0){
            if(this.loadPixels){ 
    //            image(this.graphics, this.initX, this.initY);
    //            loadPixels();            
    //            this.map.update(pixels);                      
                this.loadPixels = false;
            }

            // Sensors
            if (debug.checked()) {
                for(var i = 0; i < this.sensors.length; i++){
                    this.sensors[i].show();
                }
            }

            this.graphics.push();
            this.graphics.translate(this.position.x, this.position.y);
            this.graphics.rotate(angle);


    //        if (debug.checked()) {
    //            strokeWeight(2);
    //            stroke(0, 255, 0);
    //            noFill();        

    //            // Lines
    //            for(var i = 0; i < this.numlines; i++){
    ////                push();
    ////                rotate(i * 2 * PI / this.numlines);
    //                drawArrow(createVector(0, 0), 
    ////                          createVector(20 * cos(angle + i * 2 * PI / this.numlines), 20 * sin(angle + i * 2 * PI / this.numlines)),
    //                          createVector(0, -width),
    //                          'red');
    ////                line(0, 0, 0, -this.dna[0] * 25);
    ////                pop();
    //            }

                //        strokeWeight(2);
                //        ellipse(0, 0, this.dna[2] * 2);

                //        stroke(255, 0, 0);
                //        line(0, 0, 0, -this.dna[1] * 25);

                //        ellipse(0, 0, this.dna[3] * 2);
    //        }

    //        var gr = color(0, 255, 0);        
    //        var rd = color(255, 0, 0);
    //        var gr = color('#21bf73');
            var gr = color('#2ddb87');
    //        var rd = color('#fd5e53');
    //        var rd = color('#ffac41');
            var rd = color(255,255,255);
            var col = lerpColor(rd, gr, this.health);

            this.graphics.fill(col);
            this.graphics.stroke(col);
            this.graphics.strokeWeight(1);
            this.graphics.beginShape();
            this.graphics.vertex(0, -this.r);
            this.graphics.vertex(-this.r, this.r);
            this.graphics.vertex(this.r, this.r);
            this.graphics.endShape(CLOSE);

    //        this.graphics.rect(-this.r, -this.r, this.r*2, this.r*2);  

            this.graphics.pop();
        }
    };
    
//    this.clone = function() {
//        let cloneVehicle = new Vehicle(initX, initY, wayPoints, energystations, obstacles, pg, 0, 0);
//        cloneVehicle.brain = this.brain;
//        
//        return cloneVehicle;
//    }
    
    // MOVEMENT    
    this.brake = function() {
//        console.log('brake');
        var angle = this.direction.heading() - PI;
        var desired = createVector(cos(angle), sin(angle)); // A vector pointing from the location to the target
        
        // Scale to maximum speed
        desired.setMag(this.maxforce);
        
        this.applyForce(desired);
        
//        desired.setMag(this.maxspeed);
//        this.velocity = desired;
    }
    
    this.accelerate = function() {
        var angle = this.direction.heading();
        var desired = createVector(cos(angle), sin(angle)); // A vector pointing from the location to the target
        
        // Scale to maximum speed
        desired.setMag(this.maxforce);
        
        this.applyForce(desired);
        
//        desired.setMag(this.maxspeed);
//        this.velocity = desired;
    }
    
    this.turnRight = function() { 
        this.velocity.rotate(this.rotationspeed);
        this.direction.rotate(this.rotationspeed);
        
//        console.log('right');
//        var angle = this.velocity.heading() + PI / 2;
//        var desired = createVector(cos(angle), sin(angle)); // A vector pointing from the location to the target
//        
//        // Scale to maximum speed
//        desired.setMag(this.maxforce);
//        
//        this.applyForce(desired);
        
        
        
//        this.velocity.rotate(PI / 2);
    }
    
    this.turnLeft = function() {  
        this.velocity.rotate(-1*this.rotationspeed);
        this.direction.rotate(-1*this.rotationspeed);
        
//        var angle = this.velocity.heading() - PI / 2;
//        var desired = createVector(cos(angle), sin(angle)); // A vector pointing from the location to the target
//        
//        // Scale to maximum speed
//        desired.setMag(this.maxforce);
//        
//        this.applyForce(desired);
        
        
//        this.velocity.rotate(-PI / 2);
    }
    
    this.look2 = function() {
        if(!this.firstLoop){
            this.updateSensors();            
        } 
                
        
        for(let i = 0; i < this.sectors.length; i++) { 
            this.vision[i] = this.sectors[i];
        }
        
        this.vision[this.sectors.length]     = this.map.getSector(this.position.x, this.position.y);
    }
    
    this.look = function() {
        if(!this.firstLoop){
            this.updateSensors();            
        } 
        
        let visionInd;
        for(let i = 0; i < this.sensors.length; i++) {                     
            visionInd = 2*i;
            
            let wInd = visionInd;
            let sInd = visionInd;
            let oInd = visionInd+1;
            
            this.vision[wInd]   = -1; // way point?
//            this.vision[sInd] = -1; // energy station?
            this.vision[oInd] = -1; // prohibited?
            
            switch(this.sensors[i].type){
                    case WAY_POINT_TYPE:
                        this.vision[wInd] = 1/(this.sensors[i].vector.mag()); 
                        break;
//                    case STATION_TYPE:
//                        this.vision[sInd] = 1/(this.sensors[i].vector.mag()); 
//                        break;
                    case OBSTACLE_TYPE:
                        this.vision[oInd] = 1/(this.sensors[i].vector.mag()); 
                        break;
            }
        }
                
//        this.vision[this.sensors.length*2]     = this.health;
        
        // Vehicle position
        this.vision[this.sensors.length*2]     = this.position.x / this.graphics.width;
        this.vision[this.sensors.length*2 + 1] = this.position.y / this.graphics.height;
    
        
        this.vision[this.sensors.length*2 + 2] = this.direction.heading() / TWO_PI;
        
        // Sectors  
        for(let i = 0; i < this.sectors.length; i++) {
          this.vision[this.sensors.length*2 + 3 + i] = this.sectors[i];
        }
        
        // Way point position        
        if(this.wayPoints[0]){
            this.vision[this.sensors.length*2 + 3 + this.sectors.length] = this.wayPoints[0].position.x / this.graphics.width;
            this.vision[this.sensors.length*2 + 4 + this.sectors.length] = this.wayPoints[0].position.y / this.graphics.height;
        } else {
            this.vision[this.sensors.length*2 + 3 + this.sectors.length] = -1;
            this.vision[this.sensors.length*2 + 4 + this.sectors.length] = -1;
        }

    }
    
    this.think2 = function() {
        let decision = this.brain.output(this.vision);
        let maxIndex = 0;
        let max = 0;
        
        this.target.x = decision[0]*this.graphics.width;
        this.target.y = decision[1]*this.graphics.height;
    }
    
    this.out = [];    
    this.think = function() {                    
        let decision = this.brain.output(this.vision);        
        let maxIndex = 0;
        let max = 0;

        for(let i = 0; i < decision.length; i++) {
            this.out.push(decision[i]);
            if(decision[i] > max) {
                max = decision[i];
                maxIndex = i;
            }
        }        

//        let sector = this.map.getSector(this.position.x, this.position.y);
//        let secWidth  = this.graphics.width / numSectorsX;
//        let secHeight = this.graphics.height / numSectorsY;
//
//        let sectorX = (sector % numSectorsX) * secWidth + secWidth / 2;
//        let sectorY = (Math.floor(sector / numSectorsX)) * secHeight + secHeight / 2;

        switch(maxIndex) {
           case 0:                
//                this.target = createVector(sectorX, sectorY - secHeight);                
             this.accelerate();
             break;
           case 1:
//                this.target = createVector(sectorX + secWidth, sectorY);
             this.brake();
             break;
           case 2:
//                this.target = createVector(sectorX, sectorY + secHeight);
             this.turnLeft();
             break;
           case 3: 
//                this.target = createVector(sectorX - secWidth, sectorY);
             this.turnRight();
             break;
        } 
        
//        this.sectorTarget = this.map.getSector(this.target.x, this.target.y);
//        
//        if(this.sectorTarget == -1){
//            this.fitness -= 5;
//        } else if(this.sectors[this.sectorTarget] == 1){
//            this.fitness -= 0.4;
//        }
    }
    
    this.calculateDistanceToReference = function() {
        let record = Infinity;
        let index = 0;
        for(let i = astar.path.length - 1; i >= 0; i--){
//            if(astar.path.length - 1 - i > this.bestIndRef){
                let d = this.position.dist(astar.path[i]);
                if(d < record){
                    record = d;
                    index  = astar.path.length - 1 - i;
                }
//            }
        }
        
        this.distToRef += record;
        this.bestIndRef = max(index, this.bestIndRef);
    }
    
    this.calculateDistanceToWP = function() {        
        if(this.map.isValidPosition(this.position)){
            let node = waveFront.getNode(this.position.x, this.position.y);
            if(node.value > -1){
                this.lastWP = node.value;
                if(this.lastWP < this.distWP){
                    this.distWP  = this.lastWP; 
                    if(this.wayPoints.length > 0){
                        this.fitness = this.distWP == 0 ? 1 : 1/(this.distWP); 
                    }                    
                }                
//                if(this.collide){
//                   this.fitness -= 0.3;
//                }
            }            
        } 
        
        this.sumWP += this.lastWP; 
    }
    
    this.setSectorVisited = function() {
        let sector = this.map.getSector(this.position.x, this.position.y);
        
        // Sector different
        if(sector != this.currentSector){
            this.currentSector = sector;
            
            // Sector not visited
            if(this.sectors[this.currentSector] != 1){
                this.numSectors++;
//                this.addFitness(this.numWayPoints/this.sectors.length);
                // Set sector as visited
                this.sectors[this.currentSector] = 1;
            } else {
//                this.subFitness(this.numWayPoints/(2*this.sectors.length));
            }
            
        }                       
        
        // Se está no mesmo setor do way point
//        if(sector == this.map.getSector(this.wayPoints[0].position.x, this.wayPoints[0].position.y)){
//           this.wayPoints.splice(0, 1);
//        }
    }
}