// Elias Lawrence

function Sensor(_base, _vec, _type, _graphics) { 
    this.base   = _base;
    this.vector = _vec;
    
    this.graphics = _graphics;
    
    this.type = _type;
    
    this.color = OBSTACLE_COLOR;
    
    switch(this.type){
        case WAY_POINT_TYPE: 
            this.color = WAY_POINT_COLOR;
            break;
        case STATION_TYPE: 
            this.color = STATION_COLOR;
            break;
    }
    
    this.contains = function(_x, _y) {
        
        return (this.position.x + this.w / 2) >= _x && (this.position.x - this.w / 2) <= _x &&
               (this.position.y + this.h / 2) >= _y && (this.position.x - this.w / 2) <= _y;
        
    };
        
    this.show = function() {
        if(this.type != NOTHING_TYPE){
            this.graphics.push();
            this.graphics.stroke(this.color);
            this.graphics.strokeWeight(2);
            this.graphics.fill(this.color);
            this.graphics.translate(this.base.x, this.base.y);
            this.graphics.line(0, 0, this.vector.x, this.vector.y);
            this.graphics.rotate(this.vector.heading());

            let arrowSize = 7;

            this.graphics.translate(this.vector.mag() - arrowSize, 0);
            this.graphics.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
            this.graphics.pop();            
        }                
    };    
    
}