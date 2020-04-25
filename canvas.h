#ifndef CANVAS_H
#define CANVAS_H

#include <QGraphicsView>
#include "controller.h"

class Canvas: public QGraphicsView
{
public:
    Canvas(Controller * control, QWidget * parent = 0);
    QGraphicsScene * scene;
    Controller * control;
};

#endif // CANVAS_H
