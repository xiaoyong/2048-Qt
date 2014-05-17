TEMPLATE = app

QT += qml quick widgets

SOURCES += main.cpp \
    myclass.cpp \
    settings.cpp

lupdate_only {
SOURCES += qml/main.qml \
           qml/Tile.qml \
           qml/2048.js
}

RESOURCES += \
    resources.qrc

# Additional import path used to resolve QML modules in Qt Creator's code model
QML_IMPORT_PATH =

# Default rules for deployment.
include(deployment.pri)

# Setting the application icon
win32: RC_ICONS = icons/2048-qt.ico # On Windows
macx: ICON = icons/2048-qt.ico # On Mac OSX

HEADERS += \
    myclass.h \
    settings.h

TRANSLATIONS = ts/2048-qt_zh_CN.ts ts/2048-qt_ru.ts

VERSION = 0.1.4

VERSTR = '\\"$${VERSION}\\"'
DEFINES += VER=\"$${VERSTR}\"
