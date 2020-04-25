#include "controller.h"

#include <qdebug.h>
#include <QTimer>

Controller::Controller(QWidget * parent)
{
    // create the scene
    scene = new QGraphicsScene();
    scene->setSceneRect(0,0,800,600); // make the scene 800x600 instead of infinity by infinity

    setScene(scene);
    setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    setFixedSize(800,600);

    setBackgroundBrush(QBrush(Qt::black, Qt::SolidPattern));

    // create drone
    setDrones();

    // create borders
    nBorder = new Obstacle(width(), 50);
    nBorder->setPos(0, - nBorder->boundingRect().height());

    sBorder = new Obstacle(width(), 50);
    sBorder->setPos(0, height());

    eBorder = new Obstacle(50, height());
    eBorder->setPos(width(), 0);

    wBorder = new Obstacle(50, height());
    wBorder->setPos(- wBorder->boundingRect().width(), 0);

    scene->addItem(nBorder); // add north border to the scene
    scene->addItem(sBorder); // add south border to the scene
    scene->addItem(wBorder); // add west  border to the scene
    scene->addItem(eBorder); // add east  border to the scene

    // create obstacles
    obstacle = new Obstacle();
    obstacle->setPos(width()/2 - obstacle->boundingRect().width()/2,
                     50);
    obstacle2 = new Obstacle();
    obstacle2->setPos(width()  - obstacle2->boundingRect().width(),
                      height() - obstacle2->boundingRect().height());

    scene->addItem(obstacle); // add obstacle to the scene
    scene->addItem(obstacle2); // add obstacle to the scene

    // create energy stations
    energyStation1 = new EnergyStation();
    energyStation1->setPos(0, 0);
    energyStation2 = new EnergyStation();
    energyStation2->setPos(width()  - energyStation2->boundingRect().width(),
                           0);

    scene->addItem(energyStation1); // add energy station to the scene
    scene->addItem(energyStation2); // add energy station to the scene

    // create clients
    client1 = new Client();
    client1->setPos(0, 200);
    client2 = new Client();
    client2->setPos(width()  - client2->boundingRect().width(),
                    200);

    scene->addItem(client1); // add energy station to the scene
    scene->addItem(client2); // add energy station to the scene

    // create score
    score = new Score();
    scene->addItem(score);    

    show();
}

void Controller::increaseScore()
{
    score->increase();
}

void Controller::setDrones()
{
    for (int i = 0; i < numDrones; i++) {
        Drone * drone = new Drone();

        drone->setPos(10,//width()/2 - drone->rect().width()/2,
                      height() - drone->boundingRect().height() - 10);

        // if an object is on focus, it can rspond to events
//        drone->setFlag(QGraphicsItem::ItemIsFocusable);
//        drone->setFocus();

        drones.emplace_back(drone);
        scene->addItem(drone); // add drone to the scene
//        drone->addGuideLines();
    }
}

void Controller::droneDead(){
    numDrones--;
    if(numDrones == 0)
        qDebug() << "ALL DEAD";
}
