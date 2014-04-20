#include <QApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QTranslator>
#include <QDebug>
#include "myclass.h"

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);

    // Localization
    QString locale = QLocale::system().name();
    qDebug() << "Locale: " + locale;

    QTranslator translator;
    translator.load("2048-qt_" + locale);
    app.installTranslator(&translator);

    QQmlApplicationEngine engine;
    engine.load(QUrl(QStringLiteral("qrc:///qml/main.qml")));

    MyClass myClass;
    // Access C++ object "myClass" from QML as "myClass"
    engine.rootContext()->setContextProperty("myClass", &myClass);

    return app.exec();
}
