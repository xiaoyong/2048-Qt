TEMPLATE = app

QT += qml quick widgets

SOURCES += main.cpp \
    myclass.cpp

lupdate_only {
SOURCES += qml/main.qml \
           qml/2048.js
}

RESOURCES += qml.qrc

# Additional import path used to resolve QML modules in Qt Creator's code model
QML_IMPORT_PATH =

# Default rules for deployment.
include(deployment.pri)

# Setting the application icon
RC_ICONS = 2048.ico # On Windows
ICON = 2048.ico # On Mac OSX

HEADERS += \
    myclass.h

TRANSLATIONS = 2048-qt_zh_CN.ts
