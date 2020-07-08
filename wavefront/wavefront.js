// Elias Lawrence

function WaveFront(_graphics, origin_x, origin_y, _diagonal_movement, _step, _radius, _scale) {      
    this.graphics          = _graphics;
    this.map               = [];    
    this.neighbors         = [];
    this.visited           = [];
    this.step              = _step;
    this.radius            = _radius;
    this.scale             = _scale;
    this.width             = this.graphics.width/this.scale;
    this.height            = this.graphics.height/this.scale;
//    this.dH                = parseInt(this.compression * this.graphics.height);
//    this.dW                = parseInt(this.compression * this.graphics.width);
//    this.radius            = sqrt(this.dH*this.dH + this.dW*this.dW)/2;
//    this.step              = this.radius;
    this.diagonal_movement = _diagonal_movement;
    this.maxValue          = 0;
    this.origin_x          = origin_x;
    this.origin_y          = origin_y;        
    
    let i = 0;
    for (let y = 0; y < this.graphics.height; y+=this.scale) { 
        for (let x = 0; x < this.graphics.width; x+=this.scale) {  
            let type = NOTHING_TYPE;
            next_iteration:for (let indY = 0; indY < this.scale && y + indY < this.graphics.height; indY++) {   
                for (let indX = 0; indX < this.scale && x + indX < this.graphics.width; indX++) {   
                      if(problem.map.isObstacle(x + indX, y + indY)) {
                          type = OBSTACLE_TYPE;
                          break next_iteration;
                      }           
                }              
            }
            this.map[i] = new WFNode(this, parseInt(x/this.scale), parseInt(y/this.scale), this.scale, type, -1);
            i++;
        }
    }         
           
    this.neighbors.push(this.map[parseInt(origin_x/this.scale) + parseInt(origin_y/this.scale) * parseInt(this.graphics.width/this.scale)]);
    
    this.currentNode = this.map[parseInt(problem.origin.position.x/this.scale) + parseInt(problem.origin.position.y/this.scale) * parseInt(this.width)];
    
    this.path = [];
    
    this.getNode = function(x, y) {
        return this.map[parseInt(x/this.scale) + parseInt(y/this.scale) * parseInt(this.graphics.width/this.scale)];      
    }
    
    this.getNode2 = function(x, y) {
        return this.map[parseInt(x) + parseInt(y) * parseInt(this.width)];      
    }
    
    this.setNode = function(x, y, value) {
        return this.map[parseInt(x) + parseInt(y) * parseInt(this.graphics.width)] = min(value, this.map[parseInt(x) + parseInt(y) * parseInt(this.graphics.width)]);      
    }
    
    this.propagateGraphics = function(){
        if(this.neighbors.length > 0){
            
            for (let i = this.neighbors.length-1; i >= 0; i--) { 
                if(!this.neighbors[i].visited()){
                    this.neighbors[i].value = this.maxValue;                    
                    let adjacents = this.neighbors[i].adjacents(this.diagonal_movement, 1, this.radius);
                    
                    let visited = this.neighbors.splice(i, 1)[0];
                    if(visited){
                        this.visited.push(visited);
                    }
                    
                    this.neighbors = this.neighbors.concat(adjacents);
                } else {
                    this.neighbors.splice(i, 1);
                }                
            }
            
            this.maxValue++;                        
        } else {
            this.path.push(this.currentNode);
            
            let index     = 0;
            let record    = Infinity;
            let adjacents = this.currentNode.adjacents(this.diagonal_movement, 1, this.radius);
            for (let i = adjacents.length-1; i >= 0; i--) { 
                if(adjacents[i].visited()){
                    let v = adjacents[i].value;                    
                    
                    if(v < record){
                        index = i;
                        record = v;
                    }
                }
            }
            
            this.currentNode = adjacents[index];
        }
    }
    
    this.propagate = function(){
        while(this.neighbors.length > 0){            
            for (let i = this.neighbors.length-1; i >= 0; i--) { 
                if(!this.neighbors[i].visited()){
                    this.neighbors[i].value = this.maxValue;                    
                    let adjacents = this.neighbors[i].adjacents(this.diagonal_movement, 1, this.radius);
                    
                    let visited = this.neighbors.splice(i, 1)[0];
                    if(visited){
                        this.visited.push(visited);
                    }
                    
                    this.neighbors = this.neighbors.concat(adjacents);
                } else {
                    this.neighbors.splice(i, 1);
                }                
            }
            
            this.maxValue++;                        
        } 
    }
    
    this.show = function(){
        for (let i = 0; i < this.visited.length; i++) { 
            this.visited[i].show(this.graphics, this.maxValue);
        } 
        
        for (let i = 0; i < this.path.length; i++) { 
            this.path[i].showPath(this.graphics);
        } 
    }
}