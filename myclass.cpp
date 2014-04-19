#include "myclass.h"
#include <QApplication>

MyClass::MyClass(QObject *parent) :
    QObject(parent)
{
}

void MyClass::aboutQt() {
    QApplication::aboutQt();
}
