#ifndef ENERGYSTATION_H
#define ENERGYSTATION_H

#include <QGraphicsObject>

class EnergyStation: public QGraphicsObject
{
public:
    EnergyStation(QGraphicsItem *parent = Q_NULLPTR);
    bool contains(const QPointF &point) const override;
    void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget) override;
    QRectF boundingRect() const override;
};

#endif // ENERGYSTATION_H
