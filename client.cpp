#include "client.h"
#include <qdebug.h>
#include <QPalette>
#include <QPen>
#include <QPainter>

Client::Client(QGraphicsItem *parent): QGraphicsObject(parent)
{
}

QRectF Client::boundingRect() const
{
    return QRectF(0,0,10,10);
}

bool Client::contains(const QPointF &point) const{
    return point.x() >= x()  && point.x() <= x() + boundingRect().width() &&
           point.y() >= y()  && point.y() <= y() + boundingRect().height();
}

void Client::paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget)
{
    Q_UNUSED(option)
    Q_UNUSED(widget)
    painter->setBrush(Qt::blue);
    painter->setPen(Qt::black);
    painter->drawRect(boundingRect());
}
