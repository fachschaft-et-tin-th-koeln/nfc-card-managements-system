#include "WLANConfig.h"
#include "common.h"

#include <Arduino.h>
#include <WiFi.h>

Preferences preferences;

const unsigned long blinkInterval = 500;
unsigned long previousMillis = 0;
bool ledState = LOW;

Mode currentMode = Mode::Normal;

void configLED();

void enterConfigMode();
void exitConfigMode();
void handleConfigCommand(const String &command);
void showAvailableCommands();

void setup()
{
    Serial.begin(115200);
    pinMode(LED_PIN_ORANGE, OUTPUT);

    while (!Serial)
        continue;
    delay(500);

    preferences.begin("wifi", false);
    Serial.println(
        "Geben Sie 'config' ein, um den Konfigurationsmodus zu aktivieren...");

    if (!wifiFailed) {
        connectToWifi();
    }
}

void loop()
{
    if (Serial.available()) {
        String input = Serial.readStringUntil('\n');
        input.trim();
        switch (currentMode) {
        case Mode::Normal:
            if (input == "config") {
                enterConfigMode();
            }
            break;
        case Mode::Config:
            handleConfigCommand(input);
            break;
        case Mode::WLAN:
            handleWLANCommand(input);
            break;
        }
    }

    configLED();
}

void enterConfigMode()
{
    currentMode = Mode::Config;
    Serial.println("Konfiguration aktiviert. Befehle: wlan, exit");
}

void exitConfigMode()
{
    currentMode = Mode::Normal;
    Serial.println("Konfiguration verlassen.");
    showAvailableCommands();
    digitalWrite(LED_PIN_ORANGE, LOW);
}

void handleConfigCommand(const String &command)
{
    if (command == "wlan") {
        enterWLANMode();
    } else if (command == "exit") {
        exitConfigMode();
    } else {
        Serial.println("Unbekannter Befehl. Befehle: wlan, exit");
    }
}

void showAvailableCommands() { Serial.println("showAvailableCommands"); }

void configLED()
{
    if (currentMode == Mode::Config) {
        unsigned long currentMillis = millis();
        if (currentMillis - previousMillis >= blinkInterval) {
            previousMillis = currentMillis;
            ledState = !ledState;
            digitalWrite(LED_PIN_ORANGE, ledState);
        }
    } else {
        digitalWrite(LED_PIN_ORANGE, LOW);
    }
}

void blinkLED(int ledPin, unsigned long interval)
{
    static unsigned long previousMillis = 0;
    static bool ledState = LOW;

    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis;
        ledState = !ledState;
        digitalWrite(ledPin, ledState);
    }
}

