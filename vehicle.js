// Elias Lawrence

var mr = 0.01;

function Vehicle(x, y, _clients, _energystations, _obstacles, _graphics, _initX, _initY) {
    this.acceleration = createVector(0, 0);
    this.velocity  = createVector(0, -2);
    this.direction = createVector(0, -2);
    this.position = createVector(x, y);
    this.lastPosition = createVector(x, y);
    this.r = 5;
    this.rotationspeed = 0.02;
    this.maxspeed = 0.5;
    this.maxforce = 0.005;

    this.health = 1;
    
    // Vision
    this.numSensors = 12;    
    this.sensors = [];
    this.vision = [];
    
    // NN
    this.brain          = new NeuralNetwork(this.numSensors * 3 + 1, 1, 18, 4);
    this.lastClientTime = 0;
    this.time           = 0;
    this.fitness        = 0;
    this.qtyClients     = 0;
    this.lastQtyClients = 0;
    this.distance       = Infinity;
    this.collide        = false;
    
    this.graphics = _graphics;
    this.initX    = _initX;
    this.initY    = _initY;
    
    // Clients
    this.clients = [];
    
    for(let i = 0; i < _clients.length; i++){
        this.clients.push(new Client(_clients[i].x, _clients[i].y, clientMaxWidth, clientMaxHeight, this.graphics));
    }
    
    // Energy Stations
    this.energystations = [];
    
    for(let i = 0; i < _energystations.length; i++){
        this.energystations.push(new EnergyStation(_energystations[i].x, _energystations[i].y, energyStationWidth, energyStationHeight, this.graphics));
    }
    
    // Obstacles
    this.obstacles = [];
    
    for(let i = 0; i < _obstacles.length; i++){
//        let randomObstacleMaxWidth = random(obstacleMaxWidth);
        this.obstacles.push(new Obstacle(_obstacles[i].x, _obstacles[i].y, obstacleMaxWidth, obstacleMaxWidth, this.graphics));
    }
    
    // Map
//    this.map = new Map(width, height, this.graphics.width, this.graphics.height, pixels, this.initX, this.initY);
    this.map = new Map(this.graphics.width, this.graphics.height, this.initX, this.initY, this.obstacles, this.clients, this.energystations);    
    
    this.loadPixels = true;
    // Method to update location
    this.update = function() {
        this.health -= 0.0005;
        this.fitness++;
        this.time++;
        
        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset accelerationelertion to 0 each cycle
        this.acceleration.mult(0);
//        this.acceleration = createVector(0, 0);
        
//        this.lastPosition = createVector(this.position.x, this.position.y); 
        
        this.collisionDetection();
        
        if(this.fitness > 2500){
            this.health = 0;
        }
        
        // NN
        this.look();
        this.think();
    };
    
    this.applyForce = function(force) {
        // We could add mass here if we want A = F / M
        this.acceleration.add(force);
    };
    
    this.betterThan = function(b) {
        if(this.qtyClients > b.qtyClients){
            return true;
        }else if(this.qtyClients == b.qtyClients){
            if(this.qtyClients > 0){
               return this.lastClientTime < b.lastClientTime;
            }
            
            return this.distance < b.distance;
//            if(this.collide){ // a collides
//                if(b.collide){ // a & b collide
//                    return this.time < b.time;
//                }else{ // just a collides
//                    return false;
//                }                
//            } else if(b.collide){ // just b collides
//                return true;
//            }
//            
//            return this.time < b.time;   // a & b don't collide
        }
        
        return false;
    }
    
    this.collisionDetection = function() {
        this.obstacleCollision(this.obstacles);
        this.stationCollision(this.energystations, 0.5);
        this.clientCollision(this.clients);
        this.edgeCollision();
    };
        
    this.clientCollision = function(list) {
        for (var i = list.length - 1; i >= 0; i--) {
            var d = this.position.dist(createVector(list[i].position.x + list[i].r/2, list[i].position.y + list[i].r/2));
            
            if (d < list[i].r/2 + this.r){//this.maxspeed) {
                list.splice(i, 1);
                this.qtyClients++;
                this.fitness = 0;
                this.lastClientTime = this.time;             
                   
                this.loadPixels = true;
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
            var d = this.position.dist(createVector(list[i].position.x + list[i].r/2, list[i].position.y + list[i].r/2));
            
            if (d < list[i].r/2 + this.r) {
                this.health = 0;
                this.collide = true;
                break;
            } 
        }
    };
    
    this.edgeCollision = function() {            
        if (this.position.x > this.graphics.width  || this.position.x < 0 || 
            this.position.y > this.graphics.height || this.position.y < 0) {
            this.health = 0;
            this.collide = true;
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
        
        return steer;
        //this.applyForce(steer);
    };
    
    this.dead = function() {
        let smallerDistance = Infinity;
        let d;
        for (let i = 0; i < this.clients.length; i++) {
            d = this.position.dist(this.clients[i].position);
            
            if(d < smallerDistance){
                smallerDistance = d;
            }
        }
        
        this.distance = smallerDistance;
        
        return this.health <= 0;
    };
    
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
            type = OBSTACLE_TYPE;
            
            var angle = this.velocity.heading() + index * 2 * PI / this.numSensors;
        
            var tempX = this.position.x;
            var tempY = this.position.y;
//
            let deltaX = cos(angle);
            let deltaY = sin(angle);
//
            loop:
            while(tempX < this.graphics.width  && tempX > 0 &&
                  tempY < this.graphics.height && tempY > 0){
                
                if(this.map.isObstacle(tempX, tempY)){  
                    break loop;
                } else if(this.map.isStation(tempX, tempY)){
                    type = STATION_TYPE;
                    break loop;                          
                } else if(this.map.isClient(tempX, tempY)){
                    type = CLIENT_TYPE;
                    break loop;                          
                }
//
//                for (var i = 0; i < obstacles.length; i++) {
//                    if (obstacles[i].contains(tempX, tempY)) {
//                        myColor = 'red';
//                        break loop;
//                    }     
//                }
//
                tempX += deltaX;
                tempY += deltaY;          
            }
//
            let vec = createVector(tempX - this.position.x, tempY - this.position.y);
            
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

            this.sensors[index] = new Sensor(this.position, vec, type, this.graphics);
        }    

    }
    
    this.show = function() {
        // Draw a triangle rotated in the direction of velocity
        var angle = this.direction.heading() + PI / 2;
//        console.log(this.velocity.mag());
        
        
        // Obstacles
        for(let i = 0; i < this.obstacles.length; i++){
            this.obstacles[i].show();
        }  
        
        // Energy Stations
        for(let i = 0; i < this.energystations.length; i++){
            this.energystations[i].show();
        } 
        
        // Clients
        for(let i = 0; i < this.clients.length; i++){
            this.clients[i].show();
        } 
        
        if(this.health > 0){
            if(this.loadPixels){ 
    //            image(this.graphics, this.initX, this.initY);
    //            loadPixels();            
    //            this.map.update(pixels);      
                this.map.update(this.obstacles, this.clients, this.energystations);
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
    
    this.clone = function() {
        let cloneVehicle = new Vehicle(initX, initY, clients, energystations, obstacles, pg, 0, 0);
        cloneVehicle.brain = this.brain;
        
        return cloneVehicle;
    }
    
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
    
    this.look = function() {
        if(!this.firstLoop){
            this.updateSensors();            
        } 
        
        let visionInd;
        for(let i = 0; i < this.sensors.length; i++) {
//            visionInd = 4*i;
//            this.vision[visionInd]   = this.sensors[i].type == CLIENT_TYPE   ? 1 : 0; // client?
//            this.vision[visionInd+1] = this.sensors[i].type == STATION_TYPE  ? 1 : 0; // energy station?
//            this.vision[visionInd+2] = this.sensors[i].type == OBSTACLE_TYPE ? 1 : 0; // prohibited?
//            this.vision[visionInd+3] = 1/(this.sensors[i].vector.mag());              // distance
            
            visionInd = 3*i;
            this.vision[visionInd]   = -1; // client?
            this.vision[visionInd+1] = -1; // energy station?
            this.vision[visionInd+2] = -1; // prohibited?
            
            switch(this.sensors[i].type){
                    case CLIENT_TYPE:
                        this.vision[visionInd]   = 1/(this.sensors[i].vector.mag()); // client?
                        break;
                    case STATION_TYPE:
                        this.vision[visionInd+1] = 1/(this.sensors[i].vector.mag()); // client?
                        break;
                    case OBSTACLE_TYPE:
                        this.vision[visionInd+2] = 1/(this.sensors[i].vector.mag()); // client?
                        break;
            }
        }
        
        this.vision[this.sensors.length*3] = this.health;
    }
    
    this.think = function() {
        let decision = this.brain.output(this.vision);
        let maxIndex = 0;
        let max = 0;
        
        for(let i = 0; i < decision.length; i++) {
          if(decision[i] > max) {
            max = decision[i];
            maxIndex = i;
          }
        }

        switch(maxIndex) {
           case 0:
             this.accelerate();
             break;
           case 1:
             this.brake();
             break;
           case 2:
             this.turnLeft();
             break;
           case 3: 
             this.turnRight();
             break;
        }
    }
    
    // Vehicle s close to the borders?
    this.boundaries = function() {
//        var d = 25;
//        
//        var desired = null;
//        
//        // close to the border horizontally
//        if (this.position.x < d) {
//            desired = createVector(this.maxspeed, this.velocity.y);
//        } else if (this.position.x > width - d) {
//            desired = createVector(-this.maxspeed, this.velocity.y);
//        }
//        
//        // close to the border vertically
//        if (this.position.y < d) {
//            desired = createVector(this.velocity.x, this.maxspeed);
//        } else if (this.position.y > height - d) {
//            desired = createVector(this.velocity.x, -this.maxspeed);
//        }
//        
//        if (desired !== null) {
//            desired.normalize();
//            desired.mult(this.maxspeed);
//            var steer = p5.Vector.sub(desired, this.velocity);
//            steer.limit(this.maxforce);
//            this.applyForce(steer);
//        }
    };
}