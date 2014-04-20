#include <QApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QTranslator>
#include <QDebug>
#include "myclass.h"
#include "settings.h"

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

    // Access C++ object "myClass" from QML as "myClass"
    MyClass myClass;
    engine.rootContext()->setContextProperty("myClass", &myClass);

    // Access C++ object "settings" from QML as "settings"
    Settings settings(0, "xiaoyong", "2048-Qt");
    engine.rootContext()->setContextProperty("settings", &settings);

    engine.load(QUrl(QStringLiteral("qrc:///qml/main.qml")));

    return app.exec();
}
