#include <QApplication>
#include "controller.h"


Controller * controller;

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    controller = new Controller();
    controller->show();    

    return a.exec();
}
