#include "canvas.h"

Canvas::Canvas(Controller * control, QWidget * parent): control(control)
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
    control->drone = new Drone();
    control->drone->setPos(10,//width()/2 - drone->rect().width()/2,
                  height() - control->drone->boundingRect().height() - 10);

    // if an object is on focus, it can rspond to events
    control->drone->setFlag(QGraphicsItem::ItemIsFocusable);
    control->drone->setFocus();
    //    drone->draw(); // add drone to the scene

    scene->addItem(control->drone); // add drone to the scene
    control->drone->addGuideLines();

    // create borders
    control->nBorder = new Obstacle(width(), 50);
    control->nBorder->setPos(0, - control->nBorder->boundingRect().height());

    control->sBorder = new Obstacle(width(), 50);
    control->sBorder->setPos(0, height());

    control->eBorder = new Obstacle(50, height());
    control->eBorder->setPos(width(), 0);

    control->wBorder = new Obstacle(50, height());
    control->wBorder->setPos(- control->wBorder->boundingRect().width(), 0);

    scene->addItem(control->nBorder); // add north border to the scene
    scene->addItem(control->sBorder); // add south border to the scene
    scene->addItem(control->wBorder); // add west  border to the scene
    scene->addItem(control->eBorder); // add east  border to the scene

    // create obstacles
    control->obstacle = new Obstacle();
    control->obstacle->setPos(width()/2 - control->obstacle->boundingRect().width()/2,
                     50);
    control->obstacle2 = new Obstacle();
    control->obstacle2->setPos(width()  - control->obstacle2->boundingRect().width(),
                      height() - control->obstacle2->boundingRect().height());

    scene->addItem(control->obstacle); // add obstacle to the scene
    scene->addItem(control->obstacle2); // add obstacle to the scene

    // create energy stations
    control->energyStation1 = new EnergyStation();
    control->energyStation1->setPos(0, 0);
    control->energyStation2 = new EnergyStation();
    control->energyStation2->setPos(width()  - control->energyStation2->boundingRect().width(),
                           0);

    scene->addItem(control->energyStation1); // add energy station to the scene
    scene->addItem(control->energyStation2); // add energy station to the scene

    // create clients
    control->client1 = new Client();
    control->client1->setPos(0, 200);
    control->client2 = new Client();
    control->client2->setPos(width()  - control->client2->boundingRect().width(),
                    200);

    scene->addItem(control->client1); // add energy station to the scene
    scene->addItem(control->client2); // add energy station to the scene

    // create score
    control->score = new Score();
    scene->addItem(control->score);

    show();
}
