#ifndef CONTROLLER_H
#define CONTROLLER_H

#include "drone.h"
#include "guidelines.h"
#include "obstacle.h"
#include "energystation.h"
#include "client.h"
#include "score.h"

#include <QGraphicsView>
#include <QGraphicsScene>
#include <QWidget>
#include <vector>

class Controller: public QGraphicsView
{
public:
    Controller(QWidget * parent = 0);

    QGraphicsScene * scene;
    Obstacle * obstacle;
    Obstacle * obstacle2;

    // Drones
    int numDrones = 50;
    std::vector<Drone *> drones;

    // Borders
    Obstacle * nBorder;
    Obstacle * sBorder;
    Obstacle * eBorder;
    Obstacle * wBorder;

    EnergyStation * energyStation1;
    EnergyStation * energyStation2;

    Client * client1;
    Client * client2;

    Score * score;

    int minX = 0;
    int minY = 0;
    int maxX = 800;
    int maxY = 600;

    void increaseScore();

    void update();
    void setDrones();
    void droneDead();
};

#endif // CONTROLLER_H
