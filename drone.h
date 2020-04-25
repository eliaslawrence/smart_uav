#ifndef DRONE_H
#define DRONE_H

#include "guidelines.h"
#include "neuralnetwork.h"

#include <QGraphicsObject>
#include <QObject>
#include <vector>

using DNA = std::vector<double>;
//using Brain = std::unique_ptr<NeuralNetwork::NeuralNetwork>;

class Drone: public QGraphicsObject {
    Q_OBJECT
private:
    const int  QTY_LINES = 12;
    const int  DNA_SIZE  = 2;
    int speed = 2;

    int direction = 0;

    int battPct     = 100;
    int rechargePct = 50;
    int numCli      = 0;

    // Dimension
    int width  = 10;
    int height = 20;

    DNA dna;
//    Brain brain;

    void die();
public:
    std::vector<GuideLines *> guideLines;

    std::vector<double> esDist;
    std::vector<double> obsDist;
    std::vector<double> cliDist;

    Drone();
    void draw();
    void setGuideLines();
    void addGuideLines();
    void turn(int direction);
    void turnRight();
    void turnLeft();

    void move();
    void think();

    void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget) override;

    QRectF boundingRect() const override;

public slots:
    void loop();
protected:
    void keyPressEvent(QKeyEvent * event) override;
};

#endif // DRONE_H
