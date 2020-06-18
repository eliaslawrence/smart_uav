// Elias Lawrence

function AStarNode(_parent, _x, _y) {  
    
    this.f = 0;
    this.g = 0;
    this.h = 0;
    
    this.pnt = createVector(_x, _y);
    
    this.parent = _parent;
    
    this.adjacents = function(diagonal_movement, step, radius) /* returns a vector of adjacent valid points */
    {
        // Inicializando o array final
        let adjacents = [];

        // Variavel temporaria para guardar os pontos adjacentes
        let adjacent_x = 0,
            adjacent_y = 0;

        let min_hor = -step;
        let max_hor =  step;
        let min_ver = -step;
        let max_ver =  step;

        let is_valid_x = function(x){
            if(x < 0){
                return false;
            }

            if(x >= problem.map.graphicsW){
                return false;
            }

            return true;
        };

        let is_valid_y = function(y){
            if(y < 0){
                return false;
            }

            if(y >= problem.map.graphicsH){
                return false;
            }

            return true;
        };

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
                    if (is_valid_x(adjacent_x) && is_valid_y(adjacent_y)) {

                        // Valid movement
                        if ((!diagonal_movement && (i == 0 || j == 0)) || (diagonal_movement)) {

                            // Not prohibited
                            if(!problem.map.containsObstacle(adjacent_x, adjacent_y, radius)){

                                // Add node to vector
                                adjacents.push(new AStarNode(this, adjacent_x, adjacent_y));
                            }
                        }
                    }
                }
            }
        }

        return adjacents;
    } 
    
    this.equals = function(other){
        return this.pnt.x == other.pnt.x && this.pnt.y == other.pnt.y;
    }
    
    this.insideRadius = function(other, radius){
        return this.pnt.dist(other.pnt) <= radius;
    }
    
}