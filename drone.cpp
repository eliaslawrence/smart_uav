#include "drone.h"
#include "obstacle.h"
#include "energystation.h"
#include "client.h"
#include "controller.h"

#include <QTimer>
#include <qmath.h>
#include <QGraphicsScene>
#include <qdebug.h>
#include <QKeyEvent>
#include <QPainter>
#include <limits>
#include <iostream>

extern Controller * controller;

Drone::Drone()
{
    // draw
//    setRect(0,0,100,50);
//    setRotation(90);

    // connect
    QTimer * timer = new QTimer();
    connect(timer, SIGNAL(timeout()),this,SLOT(loop()));

    timer->start(1000/30);


    for (unsigned i = 0; i < (unsigned) QTY_LINES; i++) {
        GuideLines * line = new GuideLines();
        guideLines.emplace_back(line);

        esDist.emplace_back(0);
        obsDist.emplace_back(0);
        cliDist.emplace_back(0);
    }

    //DNA
    for (unsigned i = 0; i < (unsigned) DNA_SIZE; i++) {

//        dna.emplace_back(line);
    }

    //Brain
//    brain = new Brain();
}

QRectF Drone::boundingRect() const
{
    return QRectF(0,0,height,width);
}

void Drone::turnRight()
{
    turn(1);
}

void Drone::turnLeft()
{
    turn(-1);
}

void Drone::turn(int direction)
{
    setTransformOriginPoint(QPointF(boundingRect().width()/2, boundingRect().height()/2));
    setRotation(rotation() + direction);
}

void Drone::paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget)
{
    Q_UNUSED(option)
    Q_UNUSED(widget)


    painter->setBrush(Qt::white);
    painter->setPen(Qt::white);
//    QPen pen(Qt::black, 10);
//    painter->setPen(pen);
//    QPen pen(QColor("red"));
//    pen.setWidth(10);
//    setRect(0,0,50,50);
    painter->drawRect(boundingRect());
//    painter->fillRect(boundingRect(), QColor("white"));
}

void Drone::draw()
{
    scene()->addItem(this);
}

void Drone::addGuideLines()
{
    for (unsigned int i = 0; i < guideLines.size(); i++) {
        scene()->addItem(guideLines[i]);
    }
}

void Drone::keyPressEvent(QKeyEvent *event)
{
    if(event->key() == Qt::Key_Left){        
        turnLeft();
    }

    if(event->key() == Qt::Key_Right){
        turnRight();
    }

    if(event->key() == Qt::Key_Up){
        speed++;
//        double angle = rotation(); // degrees

//        double dy = speed * qSin(qDegreesToRadians(angle));
//        double dx = speed * qCos(qDegreesToRadians(angle));

//        setPos(x() + dx, y() + dy);
    }

    if(event->key() == Qt::Key_Down){
        speed--;
//        double angle = rotation() + 180; // degrees

//        double dy = speed * qSin(qDegreesToRadians(angle));
//        double dx = speed * qCos(qDegreesToRadians(angle));

//        setPos(x() + dx, y() + dy);
    }

//    move();
}

void Drone::setGuideLines()
{
    QList<QGraphicsItem *> allItens = scene()->items();

    qreal xi = x() + boundingRect().width()/2;
    qreal yi = y() + boundingRect().height()/2;

    qreal xf;
    qreal yf;

    qreal deltaX;
    qreal deltaY;

    double angle;

    QColor color;

    for (unsigned int dir = 0; dir < guideLines.size(); dir++) {
        angle = rotation() + 360 * dir / guideLines.size();
//        qDebug() << angle;

        deltaX = 1*qCos(qDegreesToRadians(angle));
        deltaY = 1*qSin(qDegreesToRadians(angle));

        xf = xi;
        yf = yi;

        color = Qt::red;

        obsDist[dir] = std::numeric_limits<double>::max();
        cliDist[dir] = std::numeric_limits<double>::max();
        esDist[dir]  = std::numeric_limits<double>::max();

        while(xf > 0 && xf < scene()->width() && yf > 0 && yf < scene()->height()){
            for (int item = 0; item < allItens.size(); item++) {
                if(typeid (*(allItens[item])) == typeid(Obstacle)){
                    if(allItens[item]->contains(QPointF(xf, yf))){
                        obsDist[dir] = sqrt((xf - xi)*(xf - xi) + (yf - yi)*(yf - yi));
                        if(dir==0){
//                            qDebug() << "obs: " << obsDist[dir];
                        }
                        goto END_OF_GUIDELINE;
                    }
                }
                else if(typeid (*(allItens[item])) == typeid(EnergyStation)){
                    if(allItens[item]->contains(QPointF(xf, yf))){
                        color = Qt::green;
                        esDist[dir] = sqrt((xf - xi)*(xf - xi) + (yf - yi)*(yf - yi));
                        if(dir==0){
//                           qDebug() << "es: " << esDist[dir];
                        }
                        goto END_OF_GUIDELINE;
                    }
                }

                else if(typeid (*(allItens[item])) == typeid(Client)){
                    if(allItens[item]->contains(QPointF(xf, yf))){
                        color = Qt::blue;
                        cliDist[dir] = sqrt((xf - xi)*(xf - xi) + (yf - yi)*(yf - yi));
                        if(dir==0){
//                           qDebug() << "cli: " << cliDist[dir];
                        }
                        goto END_OF_GUIDELINE;
                    }
                }
            }

            xf += deltaX;
            yf += deltaY;
        }

        obsDist[dir] = sqrt((xf - xi)*(xf - xi) + (yf - yi)*(yf - yi));
//        if(i==0){
//           qDebug() << "obs: " << obsDist[i];
//        }

        END_OF_GUIDELINE:
    //    qDebug() << xf << ", " << yf;

        // create guide lines
        guideLines[dir]->setLine(xi, yi, xf, yf);
        guideLines[dir]->setPen(QPen(color));
    }
}

void Drone::think()
{
    direction = rand() % 3 - 1;
}

void Drone::loop()
{
//    look();
    think();
    move();
}

void Drone::move()
{
//    qDebug() << "direction: " << direction;
    turn(direction);
    double angle = rotation(); // degrees

    double dy = speed * qSin(qDegreesToRadians(angle));
    double dx = speed * qCos(qDegreesToRadians(angle));

    setPos(x() + dx, y() + dy);

    //Collide detection
    QList<QGraphicsItem *> collidingItens = collidingItems();

    for (int item = 0; item < collidingItens.size(); item++) {
        if(typeid (*(collidingItens[item])) == typeid(Obstacle)){
            if(collidingItens[item]->collidesWithItem(this)){
                die();
                return;
            }
        } else if(typeid (*(collidingItens[item])) == typeid(Client)){
            if(collidingItens[item]->collidesWithItem(this)){
                scene()->removeItem(collidingItens[item]);
                delete collidingItens[item];

                controller->increaseScore();
            }
        }
    }

    setGuideLines();  
}

void Drone::die()
{
    qDebug() << "die";

    controller->droneDead();

    for (unsigned i = 0; i < guideLines.size(); i++) {
//        scene()->removeItem(guideLines[i]);
        delete guideLines[i];
    }
    guideLines.clear();

    scene()->removeItem(this);
    delete this;
}
