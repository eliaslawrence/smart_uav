// Elias Lawrence
var obstacleMaxHeight = 15;
var obstacleMaxWidth  = 15;

function Obstacle(_x, _y, _w, _h, _graphics) {  
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.r = this.w;
    this.graphics = _graphics;
    
    if(_h){
        this.h = _h; 
    }else {
        this.h = this.w;
    }
    
    this.position = createVector(_x, _y);
    
    this.color = OBSTACLE_COLOR;
    
    this.contains = function(_x, _y) {
        
        return (this.position.x + this.w / 2) >= _x && (this.position.x - this.w / 2) <= _x &&
               (this.position.y + this.h / 2) >= _y && (this.position.y - this.w / 2) <= _y;
        
    };
        
    this.show = function() {        
        this.graphics.noStroke();
        this.graphics.fill(this.color);
        this.graphics.rect(this.position.x - 0 / 2, this.position.y - 0 / 2, this.w, this.h);         
    };    
    
}