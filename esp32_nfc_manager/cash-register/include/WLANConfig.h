#ifndef WLANCONFIG_H
#define WLANCONFIG_H

#include "common.h"
#include <Arduino.h>

extern boolean wifiFailed;

void enterWLANMode();
void handleWLANCommand(const String &command);
void configureWLAN();
void connectToWifi();
void wlanDetails();

#endif
