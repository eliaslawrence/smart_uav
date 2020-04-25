# smart_uav
Developed using P5.js. Program base on SNAKE game to emulate a smart UAV that should visit determined points, avoid the charge to end. 

## Neural Network
![](https://github.com/eliaslawrence/smart_uav/blob/master/example.gif)

It was developed a simple Neural Network and the UAV learns through reinforcement method. 

The vehicle receive as input distance in each direction to:
- Obstacles
- Recharge points
- Food (points it should visit)

## Genetic Algorithm

Each generation the genes of the vehicles undergo mutation and crossover.