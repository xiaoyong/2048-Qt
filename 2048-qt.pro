TEMPLATE = app

QT += qml quick widgets

SOURCES += \
    src/main.cpp \
    src/myclass.cpp \
    src/settings.cpp

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
win32: RC_ICONS = res/icons/2048-qt.ico # On Windows
macx: ICON = res/icons/2048-qt.ico # On Mac OSX

HEADERS += \
    src/settings.h \
    src/myclass.h

TRANSLATIONS = ts/2048-qt_de_DE.ts ts/2048-qt_fr_FR.ts ts/2048-qt_pl_PL.ts ts/2048-qt_ru_RU.ts ts/2048-qt_zh_CN.ts ts/2048-qt_es_ES.ts

VERSION = 0.1.6

DEFINES += APP_VERSION=\\\"$${VERSION}\\\"
