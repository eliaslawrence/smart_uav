mapButtonSelected      = 0;
WAY_POINT_BUTTON       = 1;
ENERGY_STATION_BUTTON  = 2;
OBSTACLE_BUTTON        = 3;
ORIGIN_BUTTON          = 4;
lastInserted           = [];

let astar     = undefined;
let waveFront = undefined;

function setProblemConfig(){            
    // BUTTONS
    let wpMapButton = select('#way-point-map');           
    let eMapButton  = select('#energy-station-map');            
    let oMapButton  = select('#obstacle-map');   
    let orMapButton = select('#origin-map');
    let uMapButton  = select('#undo-map');    
    
    wpMapButton.mousePressed(function() {
        wpMapButton.removeClass('white-bg');
        
        switch(mapButtonSelected){              
            case ENERGY_STATION_BUTTON:
                eMapButton.addClass('white-bg');
                break;
            case OBSTACLE_BUTTON:
                oMapButton.addClass('white-bg');
                break;
            case ORIGIN_BUTTON:
                orMapButton.addClass('white-bg');
                break;
        } 
        
        mapButtonSelected = WAY_POINT_BUTTON;
    });
    
    eMapButton.mousePressed(function() {
        eMapButton.removeClass('white-bg');
        
        switch(mapButtonSelected){  
            case WAY_POINT_BUTTON:
                wpMapButton.addClass('white-bg');
                break;
            case OBSTACLE_BUTTON:
                oMapButton.addClass('white-bg');
                break;
            case ORIGIN_BUTTON:
                orMapButton.addClass('white-bg');
                break;
        } 
        
        mapButtonSelected = ENERGY_STATION_BUTTON;      
    });
    
    oMapButton.mousePressed(function() {
        oMapButton.removeClass('white-bg');
        
        switch(mapButtonSelected){  
            case WAY_POINT_BUTTON:
                wpMapButton.addClass('white-bg');
                break;
            case ENERGY_STATION_BUTTON:
                eMapButton.addClass('white-bg');
                break;
            case ORIGIN_BUTTON:
                orMapButton.addClass('white-bg');
                break;
        } 
        
        mapButtonSelected = OBSTACLE_BUTTON;    
    });
    
    orMapButton.mousePressed(function() {
        orMapButton.removeClass('white-bg');
        
        switch(mapButtonSelected){  
            case WAY_POINT_BUTTON:
                wpMapButton.addClass('white-bg');
                break;
            case ENERGY_STATION_BUTTON:
                eMapButton.addClass('white-bg');
                break;
            case OBSTACLE_BUTTON:
                oMapButton.addClass('white-bg');
                break;
        } 
        
        mapButtonSelected = ORIGIN_BUTTON;    
    });
    
    uMapButton.mousePressed(function() {
        problem.undo(); 
    });
}

function mousePressed() {
    if(mouseX > 0 && mouseX < pgWidth && mouseY > 0 && mouseY < pgHeight){  
        if(mapButtonSelected != OBSTACLE_BUTTON){
            problem.insert(mapButtonSelected, mouseX, mouseY);
        }                
    }
    
    // prevent default
    return false;
}

function mouseDragged() {
    if(mouseX > 0 && mouseX < pgWidth && mouseY > 0 && mouseY < pgHeight){   
        if(mapButtonSelected == OBSTACLE_BUTTON){
            problem.insert(mapButtonSelected, mouseX, mouseY);
        }       
    }
    
    // prevent default
    return false;
}

function Problem() {   
    this.insertions     = [];
    
    this.energystations = [];
    this.obstacles      = [];
    this.wayPoints      = [];
    this.origin         = undefined;
    
    this.map;
    
    this.undo = function() {
        let last = this.insertions.pop();
        switch(last){
            case WAY_POINT_BUTTON:
                this.wayPoints.pop();
                break;
            case ENERGY_STATION_BUTTON:
                this.energystations.pop();
                break;
            case OBSTACLE_BUTTON:
                this.obstacles.pop();
                break;
            case ORIGIN_BUTTON:
                this.origin = undefined;
                break;
        }  
        
        return;
    }    
    
    this.finish = function() {
        mapButtonSelected = 0;
        this.insertions   = [];
        
        this.setMap();
        
        return;
    }
    
    this.insert = function(pType, x, y) {
        switch(pType){
            case WAY_POINT_BUTTON:
                this.wayPoints.push(new WayPoint(x, y, wayPointMaxWidth, wayPointMaxHeight, pg));
                this.insertions.push(WAY_POINT_BUTTON);
                break;
            case ENERGY_STATION_BUTTON:
                this.energystations.push(new EnergyStation(x, y, energyStationWidth, energyStationHeight, pg));
                this.insertions.push(ENERGY_STATION_BUTTON);
                break;
            case OBSTACLE_BUTTON:
                this.obstacles.push(new Obstacle(x, y, obstacleMaxWidth, obstacleMaxHeight, pg));
                this.insertions.push(OBSTACLE_BUTTON);
                break;
            case ORIGIN_BUTTON:
                this.origin = new Origin(x, y, originMaxHeight, pg);
                this.insertions.push(ORIGIN_BUTTON);
                break;
        }
        
        return;
    }
    
    this.show = function() {
        // Obstacles
        for(let i = 0; i < this.obstacles.length; i++){
            this.obstacles[i].show();
        }  

        // Energy Stations
        for(let i = 0; i < this.energystations.length; i++){
            this.energystations[i].show();
        } 

        // Way Points
        for(let i = 0; i < this.wayPoints.length; i++){
            this.wayPoints[i].show();
        } 
        
        // Origin
        if(this.origin){
            this.origin.show();
        }        
        
        return;
    }
    
    this.save = function() {
        let problemToSave = {};
        problemToSave.energystations = [];
        problemToSave.obstacles      = [];
        problemToSave.wayPoints      = [];
        problemToSave.origin         = {};
        
        // Obstacles
        for(let i = 0; i < this.obstacles.length; i++){
            let o = {};
            o.x = this.obstacles[i].x;
            o.y = this.obstacles[i].y;
            problemToSave.obstacles.push(o);
        }  

        // Energy Stations
        for(let i = 0; i < this.energystations.length; i++){
            let e = {};
            e.x = this.energystations[i].x;
            e.y = this.energystations[i].y;
            problemToSave.energystations.push(e);
        } 

        // Way Points
        for(let i = 0; i < this.wayPoints.length; i++){
            let w = {};
            w.x = this.wayPoints[i].x;
            w.y = this.wayPoints[i].y;
            problemToSave.wayPoints.push(w);
        } 
        
        // Origin
        let or = {};
        or.x = this.origin.x;
        or.y = this.origin.y;
        
        problemToSave.origin = or;
        
        save(problemToSave, 'problem.json');
        
        return;
    }
    
    this.load = function(data) {
//        var request = new XMLHttpRequest();
//        request.open("GET", path, false);
//        request.send(null)
        
        let problemLoaded   = data;//request.responseText);
        this.energystations = [];
        this.obstacles      = [];
        this.wayPoints      = [];
        this.origin         = {};
        
        // Obstacles
        for(let i = 0; i < problemLoaded.obstacles.length; i++){
            this.obstacles.push(new Obstacle(problemLoaded.obstacles[i].x, problemLoaded.obstacles[i].y, obstacleMaxWidth, obstacleMaxHeight, pg));
        }  

        // Energy Stations
        for(let i = 0; i < problemLoaded.energystations.length; i++){
            this.energystations.push(new EnergyStation(problemLoaded.energystations[i].x, problemLoaded.energystations[i].y, energyStationWidth, energyStationHeight, pg));
        } 

        // Way Points
        for(let i = 0; i < problemLoaded.wayPoints.length; i++){
             this.wayPoints.push(new WayPoint(problemLoaded.wayPoints[i].x, problemLoaded.wayPoints[i].y, wayPointMaxWidth, wayPointMaxHeight, pg));
        }
        
        // Origin
        this.origin = new Origin(problemLoaded.origin.x, problemLoaded.origin.y, originMaxHeight, pg);
        
        this.setMap();
        
        return;
    }
    
    this.setMap = function(){
        this.map = new Map(pg.width, pg.height, this.origin.x, this.origin.y, this.obstacles, this.wayPoints, this.energystations);
        
//        astar = new AStar(this.origin.x, this.origin.y, this.wayPoints[0].x, this.wayPoints[0].y, 10, 10);
        
        waveFront = new WaveFront(pg, this.wayPoints[0].x, this.wayPoints[0].y, true, 10, 5, 4);
               
//        console.log(astar.astar());
    }
}