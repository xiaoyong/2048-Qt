#ifndef MYCLASS_H
#define MYCLASS_H

#include <QObject>

class MyClass : public QObject
{
    Q_OBJECT
public:
    explicit MyClass(QObject *parent = 0);

signals:

public slots:
    void aboutQt();
};

#endif // MYCLASS_H
