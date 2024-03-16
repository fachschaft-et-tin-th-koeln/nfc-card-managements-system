#include "WLANConfig.h"
#include <WiFi.h>

extern Mode currentMode;

boolean wifiFailed = false;

void enterWLANMode()
{
    currentMode = Mode::WLAN;
    Serial.println("WLAN-Konfiguration: Befehle: configure, detail, exit");
}

void handleWLANCommand(const String &command)
{
    if (command == "configure") {
        configureWLAN();
    } else if (command == "detail") {
        wlanDetails();
    } else if (command == "exit") {
        currentMode = Mode::Config;
    } else {
        Serial.println(" Befehle: configure, detail, exit");
    }
}

void configureWLAN()
{
    String wifi_ssid;
    String wifi_password;

    Serial.println("Bitte SSID eingeben:");
    while (!Serial.available())
        delay(100);
    wifi_ssid = Serial.readStringUntil('\n');
    wifi_ssid.trim();

    Serial.println("Bitte Passwort eingeben:");
    while (!Serial.available())
        delay(100);
    wifi_password = Serial.readStringUntil('\n');
    wifi_password.trim();

    preferences.begin("wifi", false);
    preferences.putString("ssid", wifi_ssid);
    preferences.putString("password", wifi_password);
    preferences.end();

    Serial.println("WLAN-Daten gespeichert.");
    connectToWifi();
}

void wlanDetails()
{
    preferences.begin("wifi", false);

    String ssid = preferences.getString("ssid", "N/A");
    String password = preferences.getString("password", "N/A");

    preferences.end();

    Serial.println("Gespeicherte WLAN-Daten:");
    Serial.print("SSID: ");
    Serial.println(ssid);
    Serial.print("Passwort: ");
    Serial.println(password);

    if (WiFi.status() == WL_CONNECTED) {
        // Ausgabe der aktuellen WLAN-Verbindungsinformationen
        Serial.println("Aktuelle WLAN-Verbindungsinformationen:");
        Serial.print("IP-Adresse: ");
        Serial.println(WiFi.localIP());
        Serial.print("Subnetzmaske: ");
        Serial.println(WiFi.subnetMask());
        Serial.print("Gateway: ");
        Serial.println(WiFi.gatewayIP());
        Serial.print("RSSI: ");
        Serial.print(WiFi.RSSI());
        Serial.println(" dBm");
    } else {
        Serial.println("Derzeit keine WLAN-Verbindung.");
    }
}

void connectToWifi()
{
    Serial.println("Verbindung zum WLAN wird aufgebaut...");

    preferences.begin("wifi", false);
    String ssid = preferences.getString("ssid", "");
    String password = preferences.getString("password", "");
    preferences.end();

    if (ssid.length() == 0 || password.length() == 0) {
        Serial.println("SSID oder Passwort nicht konfiguriert.");
        blinkLED(LED_PIN_RED, 500);
        wifiFailed = true;
        return;
    }

    WiFi.begin(ssid.c_str(), password.c_str());

    unsigned long startTime = millis();
    const unsigned long connectTime = 60000;

    while (millis() - startTime < connectTime &&
           WiFi.status() != WL_CONNECTED) {
        delay(500);
        blinkLED(LED_PIN_ORANGE, 500);
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("Mit WLAN verbunden.");
        Serial.print("IP-Adresse: ");
        Serial.println(WiFi.localIP());
        blinkLED(LED_PIN_GREEN, 500);
        delay(3000);
    } else {
        Serial.println("Verbindung zum WLAN fehlgeschlagen.");
        wifiFailed = true;
        blinkLED(LED_PIN_RED, 500);
        delay(3000);
    }
}
