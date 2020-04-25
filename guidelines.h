#ifndef GUIDELINES_H
#define GUIDELINES_H

#include <QGraphicsObject>
#include <QGraphicsLineItem>
#include <QColor>

class GuideLines: public QGraphicsLineItem {
    qreal x1;
    qreal y1;
    qreal x2;
    qreal y2;

    QColor color;
public:
    GuideLines(qreal x1, qreal y1, qreal x2, qreal y2);
    GuideLines();
    void setPoints(qreal x1, qreal y1, qreal x2, qreal y2);
    void setColor(QColor color);
};

#endif // GUIDELINES_H
