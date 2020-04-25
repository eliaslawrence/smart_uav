#include "score.h"
#include <QFont>

Score::Score(QGraphicsItem *parent)
{
    score = 0;

    setDefaultTextColor(Qt::white);
    setFont(QFont("times", 16));
    write();
}

void Score::increase()
{
    score++;
    write();
}

int Score::getScore()
{
    return score;
}

void Score::write()
{
    setPlainText(QString("Score: ") + QString::number(score));
}
