#include "settings.h"

Settings::Settings(QObject *parent, const QString &organization, const QString &application) :
    QObject(parent), settings_(new QSettings(organization, application)) {
}

Settings::~Settings() {
    delete settings_;
}

bool Settings::contains(const QString & key) const {
    return settings_->contains(key);
}

void Settings::remove(const QString & key) {
    settings_->remove(key);
}

void Settings::setValue(const QString &key, const QVariant &value) {
    settings_->setValue(key, value);
}

QVariant Settings::value(const QString &key, const QVariant &defaultValue) const {
    return settings_->value(key, defaultValue);
}

void Settings::setList(const QString &key, const QVariantList &board)
{
    settings_->setValue(key, board);
}

QVariantList Settings::list(const QString &key) const
{
    return settings_->value(key).toList();
}

void Settings::setVersion(QString version) {
    appVersion = version;
}

QString Settings::getVersion() {
    return appVersion;
}
