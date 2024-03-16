#ifndef COMMON_H
#define COMMON_H

#include <Arduino.h>
#include <Preferences.h>

extern Preferences preferences; // Deklaration, keine Definition

const int LED_PIN_RED = 12;    // GPIO-Pin für die rote LED
const int LED_PIN_ORANGE = 27; // GPIO-Pin für die orange LED
const int LED_PIN_GREEN = 14;  // GPIO-Pin für die gruene LED

extern const unsigned long blinkInterval; // Blinkintervall in Millisekunden

extern unsigned long previousMillis;
extern bool ledState;

enum class Mode { Normal, Config, WLAN };

extern Mode currentMode; // Externe Deklaration

void blinkLED(int ledPin, unsigned long interval);

#endif
