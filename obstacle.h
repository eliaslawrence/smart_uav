#ifndef OBSTACLE_H
#define OBSTACLE_H

#include <QGraphicsObject>

class Obstacle: public QGraphicsObject {

private:
    int width;
    int height;

public:
//    Obstacle();
    Obstacle(QGraphicsItem *parent = Q_NULLPTR);
    Obstacle(int width, int height, QGraphicsItem *parent = Q_NULLPTR);
    bool contains(const QPointF &point) const override;
    void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget) override;
    QRectF boundingRect() const override;
};

#endif // OBSTACLE_H
