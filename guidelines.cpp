#include "guidelines.h"
#include <QPen>
#include <QPainter>

GuideLines::GuideLines()
{
//    setPen(QPen(Qt::red));
}

GuideLines::GuideLines(qreal x1, qreal y1, qreal x2, qreal y2)
{
    // draw    
//    setLine(x1, y1, x2, y2);
}

void GuideLines::setPoints(qreal x1, qreal y1, qreal x2, qreal y2)
{
    // draw
    this->x1 = x1;
    this->y1 = y1;
    this->x2 = x2;
    this->y2 = y2;
}

void GuideLines::setColor(QColor color)
{
    setPen(QPen(Qt::red));
//    this->color = color;
}
