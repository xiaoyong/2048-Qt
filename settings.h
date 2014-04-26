#ifndef SETTINGS_H
#define SETTINGS_H

#include <QObject>
#include <QSettings>

class Settings : public QObject
{
    Q_OBJECT
public:
    explicit Settings(QObject *parent = 0, const QString &organization = QString(), const QString &application = QString());
    ~Settings();

    Q_INVOKABLE void setValue(const QString &key, const QVariant &value);
    Q_INVOKABLE QVariant value(const QString &key, const QVariant &defaultValue = QVariant()) const;
    Q_INVOKABLE QString getVersion();

    void setVersion(const QString version);

signals:

public slots:

private:
    QSettings *settings_;
    QString appVersion;
};

#endif // SETTINGS_H
