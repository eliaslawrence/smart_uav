#ifndef CLIENT_H
#define CLIENT_H

#include <QGraphicsObject>

class Client: public QGraphicsObject {

public:
    Client(QGraphicsItem *parent = Q_NULLPTR);
    bool contains(const QPointF &point) const override;
    void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget) override;
    QRectF boundingRect() const override;
};

#endif // CLIENT_H
