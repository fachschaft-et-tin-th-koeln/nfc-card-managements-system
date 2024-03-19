#include <Arduino.h>
#include <MFRC522.h>
#include <SPI.h>
#include <WiFi.h>

#include "WLANConfig.h"
#include "config.h"

#define SS_PIN 5
#define RST_PIN 17
// SPI BUS SETUP SCK: 18, MISO: 19, MOSI: 23, SS: 5
#define SCK 18
#define MISO 19
#define MOSI 23

MFRC522 rfid(SS_PIN, RST_PIN); // Instance of the class

MFRC522::MIFARE_Key key;

// Init array that will store new NUID
byte nuidPICC[4];

std::vector<ConfigOption> configOptions;
std::vector<ConfigOption *> optionStack;

Preferences preferences;

void initializeConfigOptions()
{
    configOptions.clear();
    configOptions.push_back(ConfigOption(
        "wlan", [] { sendAcknowledge("wlan-options"); },
        {ConfigOption("config",
                      [] { configureWifi(), sendAcknowledge("wlan-config"); }),
         ConfigOption("detail",
                      [] { wifiDetails(), sendAcknowledge("wlan-detail"); }),
         ConfigOption("test",
                      [] { wifiTest(), sendAcknowledge("wlan-test"); })}));

    configOptions.push_back(ConfigOption(
        "server", [] { sendAcknowledge("server"); },
        {ConfigOption("config", [] { sendAcknowledge("server-config"); }),
         ConfigOption("detail", [] { sendAcknowledge("server-detail"); })}));

    configOptions.push_back(ConfigOption("exit", [] {}, {}));
}

void setup()
{
    Serial.begin(115200);
    Serial.setTimeout(5000);
    while (!Serial)
        continue;
    delay(500);

    initializeConfigOptions();

    // Init SPI bus
    SPI.begin(SCK, MISO, MOSI);
    rfid.PCD_Init(); // Init MFRC522

    for (byte i = 0; i < 6; i++) {
        key.keyByte[i] = 0xFF;
    }

    connectToWifi();
    Serial.println(F("Send 'config' to enter configuration mode."));
}

void loop()
{

    checkSerialForConfigCommand();

    // Reset the loop if no new card present on the sensor/reader. This saves
    // the entire process when idle.
    if (!rfid.PICC_IsNewCardPresent()) {
        return;
    }

    // Verify if the NUID has been readed
    if (!rfid.PICC_ReadCardSerial()) {
        return;
    }
    // Serial.print(F("PICC type: "));
    MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
    // Serial.println(rfid.PICC_GetTypeName(piccType));

    // Check is the PICC of Classic MIFARE type
    // if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI &&
    //     piccType != MFRC522::PICC_TYPE_MIFARE_1K &&
    //     piccType != MFRC522::PICC_TYPE_MIFARE_4K) {
    //     Serial.println(F("Your tag is not of type MIFARE Classic."));
    //     return;
    // }

    for (byte i = 0; i < 4; i++) {
        nuidPICC[i] = rfid.uid.uidByte[i];
    }

    // Serial.println("UID: " + String(nuidPICC[0], HEX) + " " +
    //                String(nuidPICC[1], HEX) + " " + String(nuidPICC[2], HEX)
    //                + " " + String(nuidPICC[3], HEX));
    // Halt PICC
    rfid.PICC_HaltA();

    // Stop encryption on PCD
    rfid.PCD_StopCrypto1();
}
