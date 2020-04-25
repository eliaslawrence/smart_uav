#ifndef SCORE_H
#define SCORE_H

#include <QGraphicsTextItem>

class Score: public QGraphicsTextItem
{
private:
    int score;
public:
    Score(QGraphicsItem * parent = 0);
    void increase();
    int getScore();
    void write();
};

#endif // SCORE_H
