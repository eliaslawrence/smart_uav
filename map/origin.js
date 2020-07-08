// Elias Lawrence

function Origin(_x, _y, _w, _graphics) {  
    this.x        = _x;
    this.y        = _y;
    this.w        = _w;
    this.graphics = _graphics;
    
    this.angle     = TWO_PI / this.npoints;
    this.halfAngle = this.angle / 2.0;
    
    this.position = createVector(_x, _y);
    
    this.color = ORIGIN_COLOR;
        
    this.show = function() {        
        this.graphics.noStroke();
        this.graphics.fill(this.color);         
        this.graphics.rect(this.position.x, this.position.y - this.w, this.w, 3*this.w);
        this.graphics.rect(this.position.x - this.w, this.position.y, 3*this.w, this.w);        
        
//        this.graphics.circle(this.position.x, this.position.y, this.w);
    };    
    
}