// Elias Lawrence

function Map(_graphicsW, _graphicsH, _initX, _initY, _obstacles, _clients, _energystations) {      
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
    
    // Clients
    for (let i = 0; i < _clients.length; i++) {
        let originX = parseInt(_clients[i].position.x);
        let originY = parseInt(_clients[i].position.y);
        let w = _clients[i].w;
        let h = _clients[i].h;
        
        for (let x = originX; x <= originX + w; x++) {
            for (let y = originY; y <= originY + h; y++) {  
                this.map[x + y * this.graphicsW] = CLIENT_TYPE;
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
    
    this.isStation = function(x_, y_) {
        return this.map[parseInt(x_) + parseInt(y_) * this.graphicsW] == STATION_TYPE;      
    }
    
    this.isClient = function(x_, y_) {
        return this.map[parseInt(x_) + parseInt(y_) * this.graphicsW] == CLIENT_TYPE;      
    }
    
    this.update = function(_obstacles, _clients, _energystations) {
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

        // Clients
        for (let i = 0; i < _clients.length; i++) {
            let originX = parseInt(_clients[i].position.x);
            let originY = parseInt(_clients[i].position.y);
            let w = _clients[i].w;
            let h = _clients[i].h;

            for (let x = originX; x <= originX + w; x++) {
                for (let y = originY; y <= originY + h; y++) {  
                    this.map[x + y * this.graphicsW] = CLIENT_TYPE;
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

//function Map(_canvasW, _canvasH, _graphicsW, _graphicsH, pixels, _initX, _initY) {  
//    this.canvasW = _canvasW;
//    this.canvasH = _canvasH;
//    this.graphicsW = _graphicsW;
//    this.graphicsH = _graphicsH;
//    this.map = [];
//
//    this.initY = _initY;
//    this.initX = _initX;
//    
////    console.log(this.initY);
////    console.log(this.initX);
//    
//    var index;
//    var c;
//    let d = pixelDensity();
//    for (let x = 0; x < this.graphicsW; x++) {
//        for (let y = 0; y < this.graphicsH; y++) {   
//            
//            index = 4 * d * (this.canvasW * (y + this.initY) + (x + this.initX));
//
//            c = color(pixels[index], pixels[index+1], pixels[index+2]);
//
//            if(pixels[index] == OBSTACLE_RED && pixels[index+1] == OBSTACLE_GREEN && pixels[index+2] == OBSTACLE_BLUE){
//                this.map[x + y * this.graphicsW] = OBSTACLE_TYPE;
//            } else if(pixels[index] == STATION_RED && pixels[index+1] == STATION_GREEN && pixels[index+2] == STATION_BLUE){
//                this.map[x + y * this.graphicsW] = STATION_TYPE; 
//            } else if(pixels[index] == CLIENT_RED && pixels[index+1] == CLIENT_GREEN && pixels[index+2] == CLIENT_BLUE){
//                this.map[x + y * this.graphicsW] = CLIENT_TYPE; 
//            } else {
//                this.map[x + y * this.graphicsW] = NOTHING_TYPE;
//            }       
//        }
//    }    
//    
//    this.isObstacle = function(x_, y_) {
//        return this.map[parseInt(x_) + parseInt(y_) * this.graphicsW] == OBSTACLE_TYPE;      
//    }
//    
//    this.isStation = function(x_, y_) {
//        return this.map[parseInt(x_) + parseInt(y_) * this.graphicsW] == STATION_TYPE;      
//    }
//    
//    this.isClient = function(x_, y_) {
//        return this.map[parseInt(x_) + parseInt(y_) * this.graphicsW] == CLIENT_TYPE;      
//    }
//    
//    this.update = function(pixels) {
////        console.log('update');
//        var index;
//        var c;
//        let d = pixelDensity();
//        for (let x = 0; x < this.graphicsW; x++) {
//            for (let y = 0; y < this.graphicsH; y++) {   
//
//                index = 4 * d * (this.canvasW * (y + this.initY) + (x + this.initX));
//
//                c = color(pixels[index], pixels[index+1], pixels[index+2]);
//
//                if(pixels[index] == OBSTACLE_RED && pixels[index+1] == OBSTACLE_GREEN && pixels[index+2] == OBSTACLE_BLUE){
//                    this.map[x + y * this.graphicsW] = OBSTACLE_TYPE;
//                } else if(pixels[index] == STATION_RED && pixels[index+1] == STATION_GREEN && pixels[index+2] == STATION_BLUE){
//                    this.map[x + y * this.graphicsW] = STATION_TYPE; 
//                } else if(pixels[index] == CLIENT_RED && pixels[index+1] == CLIENT_GREEN && pixels[index+2] == CLIENT_BLUE){
//                    this.map[x + y * this.graphicsW] = CLIENT_TYPE; 
//                } else {
//                    this.map[x + y * this.graphicsW] = NOTHING_TYPE;
//                }       
//            }
//        }          
//    }
//}

//function Map(_canvasW, _canvasH, _graphicsW, _graphicsH, pixels) {  
//    this.canvasW = _canvasW;
//    this.canvasH = _canvasH;
//    this.graphicsW = _graphicsW;
//    this.graphicsH = _graphicsH;
//    this.map = [];
//    
//    var index;
//    var c;
//    let d = pixelDensity();
//    for (let x = 0; x < this._graphicsW; x++) {
//        for (let y = 0; y < this._graphicsH; y++) {
//            for (let i = 0; i < d; i++) {
//              for (let j = 0; j < d; j++) {
//                  // loop over
//                  index = 4 * ((y * d + j) * this.canvasW * d + (x * d + i));
//
//                  c = color(pixels[index], pixels[index+1], pixels[index+2]);
//
//                  if(pixels[index] == obstacleR && pixels[index+1] == obstacleG && pixels[index+2] == obstacleB){
////                      console.log(x + ', ' + y);
//                      this.map[parseInt(x) * this._graphicsH + parseInt(y)] = OBSTACLE_TYPE;
//                  } else if(pixels[index] == stationR && pixels[index+1] == stationG && pixels[index+2] == stationB){
//                      this.map[parseInt(x) * this._graphicsH + parseInt(y)] = STATION_TYPE; 
//                  } else if(pixels[index] == clientR && pixels[index+1] == clientG && pixels[index+2] == clientB){
//                      this.map[parseInt(x) * this._graphicsH + parseInt(y)] = CLIENT_TYPE; 
//                  } else {
//                      this.map[parseInt(x) * this._graphicsH + parseInt(y)] = NOTHING_TYPE;
//                  }                  
//              }
//            }
//        }
//    }    
//    
//    this.isObstacle = function(x_, y_) {
//        return this.map[parseInt(x_) * this.h + parseInt(y_)] == OBSTACLE_TYPE;      
//    }
//    
//    this.isStation = function(x_, y_) {
//        return this.map[parseInt(x_) * this.h + parseInt(y_)] == STATION_TYPE;      
//    }
//    
//    this.isClient = function(x_, y_) {
//        return this.map[parseInt(x_) * this.h + parseInt(y_)] == CLIENT_TYPE;      
//    }
//    
//    this.update = function(pixels) {
//        var index;
//        var c;
//        let d = pixelDensity();
//        for (let x = 0; x < this._graphicsW; x++) {
//            for (let y = 0; y < this._graphicsH; y++) {
//                for (let i = 0; i < d; i++) {
//                  for (let j = 0; j < d; j++) {
//                      // loop over
//                      index = 4 * ((y * d + j) * this.canvasW * d + (x * d + i));
//
//                      c = color(pixels[index], pixels[index+1], pixels[index+2]);
//
//                      if(pixels[index] == obstacleR && pixels[index+1] == obstacleG && pixels[index+2] == obstacleB){
//                          this.map[parseInt(x) * this._graphicsH + parseInt(y)] = OBSTACLE_TYPE;
//                      } else if(pixels[index] == stationR && pixels[index+1] == stationG && pixels[index+2] == stationB){
//                          this.map[parseInt(x) * this._graphicsH + parseInt(y)] = STATION_TYPE; 
//                      } else if(pixels[index] == clientR && pixels[index+1] == clientG && pixels[index+2] == clientB){
//                          this.map[parseInt(x) * this._graphicsH + parseInt(y)] = CLIENT_TYPE; 
//                      } else {
//                          this.map[parseInt(x) * this._graphicsH + parseInt(y)] = NOTHING_TYPE;
//                      }                   
//                  }
//                }
//            }
//        }        
//    }
//}