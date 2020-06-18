// Elias Lawrence

function Map(_graphicsW, _graphicsH, _initX, _initY, _obstacles, _wayPoints, _energystations) {      
    this.graphicsW = _graphicsW;
    this.graphicsH = _graphicsH;
    this.map = [];

    this.initY = _initY;
    this.initX = _initX;
    
//    console.log(this.initY);
//    console.log(this.initX);
    for (let i = 0; i < this.graphicsW * this.graphicsH; i++) {  
        this.map[i] = NOTHING_TYPE;
    }
    
    // Obstacles
    for (let i = 0; i < _obstacles.length; i++) {
        let originX = parseInt(_obstacles[i].position.x);
        let originY = parseInt(_obstacles[i].position.y);
        let w = _obstacles[i].w;
        let h = _obstacles[i].h;
        
        for (let x = originX; x <= originX + w; x++) {
            for (let y = originY; y <= originY + h; y++) {  
                this.map[x + y * this.graphicsW] = OBSTACLE_TYPE;
            }
        }
    }
    
    // Way Points
    for (let i = 0; i < _wayPoints.length; i++) {
        let originX = parseInt(_wayPoints[i].position.x);
        let originY = parseInt(_wayPoints[i].position.y);
        let w = _wayPoints[i].w;
        let h = _wayPoints[i].h;
        
        for (let x = originX; x <= originX + w; x++) {
            for (let y = originY; y <= originY + h; y++) {  
                this.map[x + y * this.graphicsW] = WAY_POINT_TYPE;
            }
        }
    }
    
    // Stations
    for (let i = 0; i < _energystations.length; i++) {
        let originX = parseInt(_energystations[i].position.x);
        let originY = parseInt(_energystations[i].position.y);
        let w = _energystations[i].w;
        let h = _energystations[i].h;
        
        for (let x = originX; x <= originX + w; x++) {
            for (let y = originY; y <= originY + h; y++) {   
                this.map[x + y * this.graphicsW] = STATION_TYPE;
            }
        }
    }   
    
    this.isObstacle = function(x_, y_) {
        return this.map[parseInt(x_) + parseInt(y_) * this.graphicsW] == OBSTACLE_TYPE;      
    }
    
    this.containsObstacle = function(x_, y_, radius_) {
        let start_x = x_ - radius_;
        let start_y = y_ - radius_;
        
        for (let i = start_x; i < x_ + radius_; i++) {
            for (let j = start_y; j < y_ + radius_; j++) {
                let index = parseInt(i) + parseInt(j) * this.graphicsW;
                if(index > 0 && index < this.map.length){
                    if(this.map[index] == OBSTACLE_TYPE){
                       return true;
                    }
                }                
            }
        }
        
        return false;      
    }
    
    this.isStation = function(x_, y_) {
        return this.map[parseInt(x_) + parseInt(y_) * this.graphicsW] == STATION_TYPE;      
    }
    
    this.isWayPoint = function(x_, y_) {
        return this.map[parseInt(x_) + parseInt(y_) * this.graphicsW] == WAY_POINT_TYPE;      
    }
    
    this.update = function(_obstacles, _wayPoints, _energystations) {
//        console.log('update');
        for (let i = 0; i < this.graphicsW * this.graphicsH; i++) {  
            this.map[i] = NOTHING_TYPE;
        }
        
        // Obstacles
        for (let i = 0; i < _obstacles.length; i++) {
            let originX = parseInt(_obstacles[i].position.x);
            let originY = parseInt(_obstacles[i].position.y);
            let w = _obstacles[i].w;
            let h = _obstacles[i].h;

            for (let x = originX; x <= originX + w; x++) {
                for (let y = originY; y <= originY + h; y++) {  
                    this.map[x + y * this.graphicsW] = OBSTACLE_TYPE;
                }
            }
        }

        // Way Points
        for (let i = 0; i < _wayPoints.length; i++) {
            let originX = parseInt(_wayPoints[i].position.x);
            let originY = parseInt(_wayPoints[i].position.y);
            let w = _wayPoints[i].w;
            let h = _wayPoints[i].h;

            for (let x = originX; x <= originX + w; x++) {
                for (let y = originY; y <= originY + h; y++) {  
                    this.map[x + y * this.graphicsW] = WAY_POINT_TYPE;
                }
            }
        }

        // Stations
        for (let i = 0; i < _energystations.length; i++) {
            let originX = parseInt(_energystations[i].position.x);
            let originY = parseInt(_energystations[i].position.y);
            let w = _energystations[i].w;
            let h = _energystations[i].h;

            for (let x = originX; x <= originX + w; x++) {
                for (let y = originY; y <= originY + h; y++) {   
                    this.map[x + y * this.graphicsW] = STATION_TYPE;
                }
            }
        }             
    }
}