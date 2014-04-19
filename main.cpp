#include <QApplication>
#include <QQmlApplicationEngine>
#include "myclass.h"
//#include <QDebug>

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);

    QQmlApplicationEngine engine;
    engine.load(QUrl(QStringLiteral("qrc:///qml/main.qml")));

    MyClass myClass;

//    qDebug() << engine.rootObjects().length();
    QObject *mainWindow = engine.rootObjects()[0];
    QObject::connect(mainWindow, SIGNAL(helpMenuTriggered()), &myClass, SLOT(aboutQt()));

    return app.exec();
}
