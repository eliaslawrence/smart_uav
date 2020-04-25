// Elias Lawrence

function Client(_x, _y, _w, _h, _graphics) {       
    this.w = _w;
    this.r = this.w;
    this.graphics = _graphics;
    
    if(_h){
        this.h = _h; 
    }else {
        this.h = this.w;
    }
    
    this.position = createVector(_x, _y);
    
    this.color = CLIENT_COLOR;
    
    this.contains = function(_x, _y) {
        
        return (this.position.x + this.w / 2) >= x_ && (this.position.x - this.w / 2) <= _x &&
               (this.position.y + this.h / 2) >= y_ && (this.position.y - this.w / 2) <= _y;
        
    };
        
    this.show = function() {        
        this.graphics.noStroke();
        this.graphics.fill(this.color);
        this.graphics.rect(this.position.x, this.position.y, this.w, this.h);         
    };    
    
}