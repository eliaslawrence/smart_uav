// Colors 
const OBSTACLE_RED   = 255; 	
const OBSTACLE_GREEN = 30;//0;
const OBSTACLE_BLUE  = 86;//0;
let   OBSTACLE_COLOR;

const STATION_RED   = 33;//0; 33, 191, 115
const STATION_GREEN = 191;//255;
const STATION_BLUE  = 115;//0;
let   STATION_COLOR;

const WAY_POINT_RED   = 253;
const WAY_POINT_GREEN = 196;
const WAY_POINT_BLUE  =   9;
let   WAY_POINT_COLOR;

const ORIGIN_RED   = 255;
const ORIGIN_GREEN = 255;
const ORIGIN_BLUE  = 255;
let   ORIGIN_COLOR;    

const WAY_POINT_TYPE = 3;
const OBSTACLE_TYPE  = 2;
const STATION_TYPE   = 1;
const NOTHING_TYPE   = 0;
/////

var vehiclesPop    = [];
var vehicles       = [];
var energystations = [];
var obstacles      = [];
var wayPoints      = [];

let problem;

var numVehicles  = 100;
var numStations  = 0;
var numObstacles = 0;
var numWayPoints = 0;

var vehicleSize  = 10;

var obstacleMaxHeight = 15;
var obstacleMaxWidth  = 15;

var energyStationHeight = 8;
var energyStationWidth  = 8;

var wayPointMaxHeight = 8;
var wayPointMaxWidth  = 8;

var originMaxHeight = 4;
var originMaxWidth  = 4;

let pg;
let nGraphicsLine = 4;
let pgWidth = 640;
let pgHeight = 360;
var mapa;

let brkga;
let decoder;
let currInd = 0;
let generation = 1;

let initY;
let initX;

let loopSpeedP;
let loopSpeed = 1;

var debug;
var bestDebug;
let currentIndP;
let bestQtyWayPoints = 0;
let bestGenQtyWayPoints = 0;
let bestGenFit = Infinity;
let slider;

let start = false;

function setColors () {
    OBSTACLE_COLOR  = color( OBSTACLE_RED,  OBSTACLE_GREEN,  OBSTACLE_BLUE);
    STATION_COLOR   = color(  STATION_RED,   STATION_GREEN,   STATION_BLUE);
    WAY_POINT_COLOR = color(WAY_POINT_RED, WAY_POINT_GREEN, WAY_POINT_BLUE); 
    ORIGIN_COLOR    = color(   ORIGIN_RED,    ORIGIN_GREEN,    ORIGIN_BLUE); 
}