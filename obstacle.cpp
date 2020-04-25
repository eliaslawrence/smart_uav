#include "obstacle.h"
#include <qdebug.h>
#include <QPalette>
#include <QPen>
#include <QPainter>

Obstacle::Obstacle(QGraphicsItem *parent): QGraphicsObject(parent)
{
    this->width  = 10;
    this->height = 10;
}

Obstacle::Obstacle(int width, int height, QGraphicsItem *parent): QGraphicsObject(parent)
{
    this->width = width;
    this->height = height;
}

QRectF Obstacle::boundingRect() const
{
    return QRectF(0,0,width,height);
}

bool Obstacle::contains(const QPointF &point) const{
    return point.x() >= x()  && point.x() <= x() + boundingRect().width() &&
           point.y() >= y()  && point.y() <= y() + boundingRect().height();
}

void Obstacle::paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget)
{
    Q_UNUSED(option)
    Q_UNUSED(widget)

    painter->setBrush(Qt::red);
    painter->setPen(Qt::black);
//    QPen pen(QColor("red"));
//    pen.setWidth(10);
//    painter->setPen(pen);
//    setRect(0,0,50,50);
    painter->drawRect(boundingRect());
}
