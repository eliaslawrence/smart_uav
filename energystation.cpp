#include "energystation.h"
#include <qdebug.h>
#include <QPalette>
#include <QPen>
#include <QPainter>

EnergyStation::EnergyStation(QGraphicsItem *parent): QGraphicsObject(parent)
{
}

QRectF EnergyStation::boundingRect() const
{
    return QRectF(0,0,10,10);
}

bool EnergyStation::contains(const QPointF &point) const{
    return point.x() >= x()  && point.x() <= x() + boundingRect().width() &&
           point.y() >= y()  && point.y() <= y() + boundingRect().height();
}

void EnergyStation::paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget)
{
    Q_UNUSED(option)
    Q_UNUSED(widget)
    painter->setBrush(Qt::green);
    painter->setPen(Qt::black);
    painter->drawRect(boundingRect());
}
