// Elias Lawrence

function WFNode(_parent, _x, _y, _l, _type, _value) {  
        
    this.pnt    = createVector(_x, _y); 
    this.l      = _l;
    this.value  = _value;
    this.type   = _type;
    this.parent = _parent;
    
    this.setValue = function(_value) {
        return this.value = min(_value, this.value);      
    }
    
    this.visited = function() {
        return this.value != -1;      
    }
    
    this.propagate = function(_value, diagonal_movement, step, radius){
        if(!this.visited()){
            this.value = _value;
            
            let adjacents = this.adjacents(diagonal_movement, step, radius);
        
            for(adjacent of adjacents){
                adjacent.propagate(this.value + 1, diagonal_movement, step, radius);
            }
        }        
    }
    
    this.is_valid_x = function(x){
        if(x < 0){
            return false;
        }

        if(x >= this.parent.width){
            return false;
        }

        return true;
    };
    
    this.is_valid_y = function(y){
        if(y < 0){
            return false;
        }

        if(y >= this.parent.height){
            return false;
        }

        return true;
    };
    
    this.adjacents = function(diagonal_movement) /* returns a vector of adjacent valid points */
    {
        // Inicializando o array final
        let adjacents = [];

        // Variavel temporaria para guardar os pontos adjacentes
        let adjacent_x = 0,
            adjacent_y = 0;

        let step = 1;
        let min_hor = -step;
        let max_hor =  step;
        let min_ver = -step;
        let max_ver =  step;

        // Percorre na vertical
        for (let i = min_ver; i <= max_ver; i+=step)
        {
            // Percorre na horizontal
            for (let j = min_hor; j <= max_hor; j+=step)
            {
                // Not reference point
                if(i != 0 || j != 0){

                    // Reference point added loop value
                    adjacent_x = this.pnt.x + j;
                    adjacent_y = this.pnt.y + i;

                    // Inside matrix
                    if (this.is_valid_x(adjacent_x) && this.is_valid_y(adjacent_y)) {

                        // Valid movement
                        if ((!diagonal_movement && (i == 0 || j == 0)) || (diagonal_movement)) {
                            let node = this.parent.getNode2(adjacent_x, adjacent_y);

                            // Not prohibited
                            if(node.type != OBSTACLE_TYPE){

                                // Add node to vector
                                adjacents.push(node);
                            }
                        }
                    }
                }
            }
        }

        return adjacents;
    } 
    
    this.show = function(graphics, max){
        if(this.visited){
            var gr = OBSTACLE_COLOR;
            var rd = color(255,255,255);
            var col = lerpColor(rd, gr, this.value / max);

            graphics.fill(this.value / max * 255);
            graphics.stroke(0);
            graphics.strokeWeight(1);
            graphics.rect(this.pnt.x*this.l, this.pnt.y*this.l, this.l, this.l);
        }        
    }
    
    
    this.showPath = function(graphics){
        graphics.noStroke();
        graphics.fill(STATION_COLOR);
        graphics.rect(this.pnt.x*this.l, this.pnt.y*this.l, this.l, this.l);     
    }
    
}