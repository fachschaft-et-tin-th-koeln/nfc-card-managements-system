#include <Arduino_GFX_Library.h>
#include "FreeMono8pt7b.h"
#include "FreeSansBold10pt7b.h"
#include "FreeSerifBoldItalic12pt7b.h"
#include "touch.h"
#include <Wifi.h>
#include <HTTPClient.h>
#include <ArduinoJSON.h>
#include <MFRC522.h>
#include <SPI.h>



#define GFX_BL DF_GFX_BL // default backlight pin, you may replace DF_GFX_BL to actual backlight pin

#define WiFi_SSID "Fachschaft-ET2.4"
#define WiFi_PASS "#B4nk#Fr3edom!"
#define API_URL "http://192.168.5.20:3000"
#define pfandpreis 1

#define SS_PIN 17
#define RST_PIN 25

SPIClass spiTouch(HSPI);
// Problem : 3 Module auf 2 SPI Bus -> 2 Module auf VSPI und 1 auf HSPI  SPI.begin() nutzt VSPI
// Lösung : in touch.h SPI.begin() auf HSPI ändern durch extern SPIClass spiTouch in main.cpp; und spiTouch.begin() in touch.cpp
// Lösung : in XPT2046_Touchscreen.cpp spiTouch.begin() ändern
// Lösung : überall in XPT2046_Touchscreen.cpp und .h SPI durch spiTouch ersetzen

MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance

MFRC522::MIFARE_Key key;

void writeText(String text, int middlex, int middley, int size, int color);
void draw_bt_for_drinks(String *texts, int *borders);
void writePercentage(int percentage);
void draw_bt_for_deposit(int *depositborder);
void deleteText(String text, int middlex, int middley, int size, int color);
void touch_drinks(String *texts, int *borders, int *amount_clicked);
void print_clicked(int amount_clicked, int *borders);
void delete_clicked(int *borders);
void touch_deposit(int *depositborder);
void pay_the_bill();
void init();
bool check_wifi();
void getDrinks();
void payload_to_json(String payload);
int readRFID_and_send(float amount);


/* More dev device declaration: https://github.com/moononournation/Arduino_GFX/wiki/Dev-Device-Declaration */
#if defined(DISPLAY_DEV_KIT)
Arduino_GFX *gfx = create_default_Arduino_GFX();
#else /* !defined(DISPLAY_DEV_KIT) */

/* More data bus class: https://github.com/moononournation/Arduino_GFX/wiki/Data-Bus-Class */
// dc 27, cs 5, rst 33, sck 18, mosi 23, miso nil
Arduino_DataBus *bus = new Arduino_ESP32SPI(32 /* DC */, 5 /* CS */, 18 /* SCK */, 23 /* MOSI */, GFX_NOT_DEFINED /* MISO */, VSPI /* spi_num */);

/* More display class: https://github.com/moononournation/Arduino_GFX/wiki/Display-Class */
Arduino_GFX *gfx = new Arduino_ILI9488_18bit(bus, 33 /* RST */, 0 /* rotation */, false /* IPS */);

#endif /* !defined(DISPLAY_DEV_KIT) */
/*******************************************************************************
 * End of Arduino_GFX setting
 ******************************************************************************/

// some Variables for the Buttons

String texts[8] = {"Bier", "Schnaps", "Hotdog", "Softdrink", "Club-Mate", "Pils",  "Weiter", "Abbruch"};
float prices[8] = {};
int borders[8*4] = {};
int amount_clicked[8] = {};
int amount = 8;
int depositborder[4*4] = {};
int depositamount = 0;
bool is_paid = false;
bool is_abbruch = false;

void setup(void)
{
  Serial.begin(115200);
  // Serial.setDebugOutput(true);
  // while(!Serial);


  Serial.println("Arduino_GFX Hello World example");
  // print the display dev kit name and the what is in bus

  // Init RFID Reader
  
  


#ifdef GFX_EXTRA_PRE_INIT
  GFX_EXTRA_PRE_INIT();
#endif

  // Init Display
  if (!gfx->begin())
  {
    Serial.println("gfx->begin() failed!");
  }
  delay(1000);
  SPI.begin();      // Init SPI bus ? wird das benötigt ?
  mfrc522.PCD_Init();   // Init MFRC522
  mfrc522.PCD_DumpVersionToSerial();  // Show details of PCD - MFRC522 Card Reader details
  gfx->setRotation(2);
  gfx->fillScreen(BLACK);

#ifdef GFX_BL
  pinMode(GFX_BL, OUTPUT);
  digitalWrite(GFX_BL, HIGH);
#endif

  // Init touch device
  touch_init(gfx->width(), gfx->height(), gfx->getRotation());

  
  Serial.println("2");
  mfrc522.PCD_DumpVersionToSerial();  // Show details of PCD - MFRC522 Card Reader details



  // Display layout for connecting to WiFi
  gfx->setTextColor(WHITE);
  gfx->setCursor(45, 150);
  gfx->setFont(&FreeSansBold10pt7b);
  gfx->setTextSize(2);
  gfx->println("Connecting \n     to WiFi...");
  gfx->fillCircle(160, 300, 10, WHITE); //
  gfx->fillArc(160, 300, 25, 20, 215, 325, WHITE); // 
  gfx->fillArc(160, 300, 40, 35, 215, 325, WHITE); // 
  gfx->fillArc(160, 300, 55, 50, 215, 325, WHITE); // 

  String macAddress = WiFi.macAddress();
  Serial.println(macAddress);
  // Connect to Wi-Fi
  WiFi.begin(WiFi_SSID, WiFi_PASS);
  int counter = 0;
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    counter++;
    Serial.println("Connecting to WiFi...");
    if (counter > 20)
    {
      ESP.restart();
    }
  }
  Serial.println("Connected to the WiFi network");

  // Display layout for successfully connected to WiFi
  gfx->fillScreen(BLACK);
  gfx->setCursor(35, 150);
  gfx->setFont(&FreeSansBold10pt7b);
  gfx->setTextSize(2);
  gfx->println("Successfully \n   connected!");
  delay(1000); // 3 seconds

  mfrc522.PICC_HaltA(); // Halt PICC

  getDrinks();
}

void loop()
{
  // mfrc522.PCD_DumpVersionToSerial();  // Show details of PCD - MFRC522 Card Reader details
  // if(!mfrc522.PICC_IsNewCardPresent())
  // {
  //   return;
  // }
  // if (!mfrc522.PICC_ReadCardSerial())
  // {
  //   return;
  // }
  // Serial.println("Card detected");

    // Display layout for GUI with 6 large Buttons, 2, 2, 2 layout and a small Battery Text on the top right next to a small WiFi icon
  gfx->fillScreen(BLACK);
  writePercentage(69);

  // Draw the 6 large Buttons
  draw_bt_for_drinks(texts, borders);
  touch_drinks(texts, borders, amount_clicked);

  delay(100); 

  // Display layout for deposit with 2 Buttons on the bottom and a + and - Button on the right and left side of the number
  gfx->fillScreen(BLACK);
  writePercentage(77);
  draw_bt_for_deposit(depositborder);
  touch_deposit(depositborder);

  delay(100);
  check_wifi();
  if(is_abbruch)
  {
    is_abbruch = false;
  }
  else
  {
    // hier wird die Rechnung bezahlt
    pay_the_bill();
  }
  
  if(is_paid)
  {
    gfx->fillScreen(BLACK);
    writePercentage(100);
    writeText("Vielen\n  Dank!", 160, 240, 3, WHITE);
    delay(5000);
  }
  init();

  
}

void draw_bt_for_deposit(int *depositborder)
{
  int sizex = 320, sizey = 480;
  int starty = 70, startx = 15;
  int ButtonWidth = 130, ButtonHeight = 120, ButtonRadius = 10;
  int lastButtony = 330;
  int spacing = 20;

  // erstelle den grünen und roten Button
  gfx->fillRoundRect(startx, lastButtony, ButtonWidth, ButtonHeight, ButtonRadius, GREEN);
  writeText("Weiter", startx + (ButtonWidth / 2), lastButtony + 40, 1, BLACK);
  depositborder[8] = startx;
  depositborder[9] = lastButtony;
  depositborder[10] = startx + ButtonWidth;
  depositborder[11] = lastButtony + ButtonHeight;
  startx = 175;
  gfx->fillRoundRect(startx, lastButtony, ButtonWidth, ButtonHeight, ButtonRadius, RED);
  writeText("Abbruch", startx + (ButtonWidth / 2),  lastButtony + 40, 1, BLACK);
  depositborder[12] = startx;
  depositborder[13] = lastButtony;
  depositborder[14] = startx + ButtonWidth;
  depositborder[15] = lastButtony + ButtonHeight;

  // erstelle ein Zahlenfeld mit plus rechts und minus links als Button

  // plus Button
  int plusButtonx = 210;
  int minusButtonx = 20;
  int plusButtony = 160;
  int plusButtonWidth = 90;
  int plusButtonHeight = 90;
  int plusButtonRadius = 5;
  gfx->fillRoundRect(plusButtonx, plusButtony, plusButtonWidth, plusButtonHeight, plusButtonRadius, WHITE);
  writeText("+", plusButtonx + (plusButtonWidth / 2 - 10), plusButtony + (plusButtonHeight -5), 5, GREEN);
  gfx->fillRoundRect(minusButtonx, plusButtony, plusButtonWidth, plusButtonHeight, plusButtonRadius, WHITE);
  writeText("-", minusButtonx + (plusButtonWidth / 2 - 5), plusButtony + (plusButtonHeight -10), 5, RED);
  depositborder[0] = plusButtonx;
  depositborder[1] = plusButtony;
  depositborder[2] = plusButtonx + plusButtonWidth;
  depositborder[3] = plusButtony + plusButtonHeight;
  depositborder[4] = minusButtonx;
  depositborder[5] = plusButtony;
  depositborder[6] = minusButtonx + plusButtonWidth;
  depositborder[7] = plusButtony + plusButtonHeight;
  
  gfx->setFont(&FreeMono8pt7b);
  gfx->setTextSize(1);
  gfx->setTextColor(WHITE);
  gfx->setCursor(60, 130);
  gfx->println("Bitte Pfand rueckgabe \n     in Glaesern eintragen:");
  writeText("0", 150, 240, 3, WHITE);
}

void writePercentage(int percentage)
{
  gfx->setTextColor(WHITE);
  gfx->setCursor(140, 15);
  gfx->setFont(&FreeMono8pt7b);
  gfx->setTextSize(1);
  String percentageString = String(percentage)+"%";
  gfx->println(percentageString);
  gfx->drawArc(280, 20, 5, 7, 215, 325, WHITE);
  gfx->drawArc(280, 20, 10, 12, 215, 325, WHITE);
  gfx->drawArc(280, 20, 15, 17, 215, 325, WHITE);
  gfx->fillCircle(280, 20, 2, WHITE);
}

void writeText(String text, int middlex, int middley, int size, int color)
{
  int16_t x1, y1, actualx, actualy;
  uint16_t w = 0, h = 0;
  gfx->setFont(&FreeSansBold10pt7b);
  gfx->setTextSize(size);
  gfx->getTextBounds(text, 0, 0, &x1, &y1, &w, &h);
  actualx = middlex - (w / 2);
  actualy = middley - (h / 2);
  gfx->setTextColor(color);
  gfx->setCursor(actualx, actualy);
  gfx->println(text);
}

void deleteText(String text, int middlex, int middley, int size, int color)
{
  int16_t x1, y1, actualx, actualy;
  uint16_t w = 0, h = 0;
  gfx->setFont(&FreeSansBold10pt7b);
  gfx->setTextSize(size);
  gfx->getTextBounds(text, 0, 0, &x1, &y1, &w, &h);
  actualx = middlex - (w / 2);
  actualy = middley - (h / 2);
  gfx->getTextBounds(text, actualx, actualy, &x1, &y1, &w, &h);
  gfx->fillRect(x1, y1, w, h, color);
}

void draw_bt_for_drinks(String *texts, int *borders)
{
  int sizex = 320, sizey = 480;
  int starty = 70, startx = 15;
  int ButtonWidth = 130, ButtonHeight = 180, ButtonRadius = 10;
  int spacing = 20;

  // Überprüfen, ob die Anzahl der Schaltflächen größer als 4 ist und die Parameter entsprechend anpassen
  if (amount > 4)
  {
    ButtonHeight = 120;
    starty = 50;
  }
  if (amount > 6)
  {
    ButtonHeight = 100;
    starty = 30;
    spacing = 15;
  }

  bool odd = amount % 2 != 0;

  // Schleife zum Zeichnen der Schaltflächen
  for (int i = 0; i < amount; i++)
  {
    // Festlegen der Startposition der Schaltfläche basierend auf der Parität von i
    startx = (i % 2 == 0) ? 15 : 175;

    // Überprüfen, ob die Schaltfläche rot oder grün sein soll, basierend auf ihrer Position in der Schleife
    uint16_t buttonColor = (amount - i == 2) ? GREEN : ((amount - i == 1) ? RED : WHITE);

    // Zeichnen der Schaltfläche mit der entsprechenden Farbe
    if(odd && buttonColor == GREEN)
    {
      startx = 15;  // wenn die Schaltfläche grün ist, wird sie immer auf der linken Seite gezeichnet 
      starty = starty + ButtonHeight + spacing;
      gfx->fillRoundRect(startx, starty, ButtonWidth, ButtonHeight, ButtonRadius, buttonColor);
      writeText(texts[i], startx + (ButtonWidth / 2), starty + 40, 1, BLACK);
      int j = i*4;
      borders[j] = startx;
      borders[j+1] = starty;
      borders[j+2] = startx + ButtonWidth;
      borders[j+3] = starty + ButtonHeight;
      starty = starty - ButtonHeight - spacing;
    }
    else if(odd && buttonColor == RED)
    {
      startx = 175;  // wenn die Schaltfläche rot ist, wird sie immer auf der rechten Seite gezeichnet 
      gfx->fillRoundRect(startx, starty, ButtonWidth, ButtonHeight, ButtonRadius, buttonColor);
      writeText(texts[i], startx + (ButtonWidth / 2), starty + 40, 1, BLACK);
      int j = i*4;
      borders[j] = startx;
      borders[j+1] = starty;
      borders[j+2] = startx + ButtonWidth;
      borders[j+3] = starty + ButtonHeight;
    }
    else
    {
      gfx->fillRoundRect(startx, starty, ButtonWidth, ButtonHeight, ButtonRadius, buttonColor);
      writeText(texts[i], startx + (ButtonWidth / 2), starty + 40, 1, BLACK);
      int j = i*4;
      borders[j] = startx;
      borders[j+1] = starty;
      borders[j+2] = startx + ButtonWidth;
      borders[j+3] = starty + ButtonHeight;
    }


    // Aktualisieren der Startposition für die nächste Schaltfläche basierend auf ihrer Position in der Schleife
    if (i % 2 != 0)
      starty += ButtonHeight + spacing;
  }
}

void touch_drinks(String *texts, int *borders, int *amount_clicked)
{
  int32_t x1, y1, actualx, actualy, counter;
  int clicked = -1;
  int some_amount = 0;
  bool weiter = false;
  while (!weiter)
  {
    if (touch_touched())
    {
      x1 = touch_last_x;
      y1 = touch_last_y;
      actualx = 0;
      actualy = 0;
      counter = 0;
      while (touch_touched())
      {
        actualx += x1;
        actualy += y1;
        counter++;
        delay(10);
      }
      int x = actualx / counter;
      int y = actualy / counter;
      for (int i = 0; i < amount; i++)
      {
        int j = i*4;
        if (x > borders[j] && x < borders[j+2] && y > borders[j+1] && y < borders[j+3])
        {
          clicked = i;
          Serial.println(clicked);
          break;
        }
        else
        {
          clicked = -1;
        }
      }
      if (clicked != -1)
      {
        if (clicked == amount - 2)
        {
          Serial.println("Weiter");
          weiter = true;
        }
        else if (clicked == amount - 1)
        {
          for (int i = 0; i < amount; i++)
          {
            amount_clicked[i] = 0;
            delete_clicked(borders);
            some_amount = 0;
          }
        }
        else  if (clicked != amount - 2 && clicked != amount - 1)
        {
          amount_clicked[clicked] += 1;
          print_clicked(amount_clicked[clicked], &borders[clicked*4]);
          some_amount += 1;
        }  
      }
    }
    delay(40);
  }
}

void print_clicked(int amount_clicked, int *borders)
{
  int startx = borders[0];
  int starty = borders[1];
  int ButtonWidth = borders[2] - startx;
  int ButtonHeight = borders[3] - starty;
  if (amount_clicked > 1)
    deleteText(String(amount_clicked - 1), startx + (ButtonWidth / 2), borders[3] - 10, 2, WHITE);
  
  writeText(String(amount_clicked), startx + (ButtonWidth / 2), borders[3] - 10, 2, BLACK);
  
}

void delete_clicked(int *borders)
{
  for (int i = 0; i < amount-2; i++)
  {
    int j = i*4;
    int startx = borders[j];
    int starty = borders[j+1];
    int ButtonWidth = borders[j+2] - startx;
    int ButtonHeight = borders[j+3] - starty;
    deleteText(String(100), startx + (ButtonWidth / 2), borders[j+3] - 10, 2, WHITE);
  }
}

void touch_deposit(int *depositborder)
{
  int32_t x1, y1, actualx, actualy, counter;
  int clicked = -1;
  int some_amount = 0;
  bool weiter = false;
  while (!weiter && !is_abbruch)
  {
    if (touch_touched())
    {
      x1 = touch_last_x;
      y1 = touch_last_y;
      actualx = 0;
      actualy = 0;
      counter = 0;
      while (touch_touched())
      {
        actualx += x1;
        actualy += y1;
        counter++;
        delay(10);
      }
      int x = actualx / counter;
      int y = actualy / counter;
      for (int i = 0; i < 4; i++)
      {
        int j = i*4;
        if (x > depositborder[j] && x < depositborder[j+2] && y > depositborder[j+1] && y < depositborder[j+3])
        {
          clicked = i;
          Serial.println(clicked);
          break;
        }
        else
        {
          clicked = -1;
        }
      }
      if (clicked != -1)
      {
        if (clicked == 0)
        {
          some_amount += 1;
        }
        else if (clicked == 1)
        {
          if(some_amount > 0)
            some_amount -= 1;
        }
        else if (clicked == 2)
        {
          Serial.println("Weiter");
          weiter = true;
        }
        else if (clicked == 3)
        {
          if (some_amount == 0)
          {
            is_abbruch = true;
          }
          some_amount = 0;
        }
        deleteText(String(100), 150, 240, 3, BLACK);
        writeText(String(some_amount), 150, 240, 3, WHITE);
      }
    }
    delay(40);
  }
  depositamount = some_amount;
}

void pay_the_bill()
{
  // hier wird die Rechnung bezahlt
  gfx->fillScreen(BLACK);
  writePercentage(100);
  // erstelle den grünen und roten Button
  int startx = 15;
  int ButtonWidth = 290, ButtonHeight = 120, ButtonRadius = 10;
  int lastButtony = 330;
  
  gfx->fillRoundRect(startx, lastButtony, ButtonWidth, ButtonHeight, ButtonRadius, RED);
  writeText("Abbruch", startx + (ButtonWidth / 2),  lastButtony + 40, 1, BLACK);

  gfx->setCursor(0, 70);
  gfx->setFont();
  gfx->setTextSize(3);
  gfx->setTextColor(WHITE);
  int linecounter = 0;
  // auflistung der bestellten Getränke
  for (int i = 0; i < amount; i++)
  {
    if (amount_clicked[i] > 0)
    {
      char buffer[50];
      sprintf(buffer, "  %-10s %d", texts[i].c_str(), amount_clicked[i]);
      gfx->println(buffer);
      linecounter++;
      gfx->setCursor(0, 70 + 30 * linecounter);
    }
  }
  char buffer[50];
  sprintf(buffer, "  %-10s %d", "Pfand", depositamount);
  gfx->println(buffer);
  linecounter++;
  gfx->setCursor(0, 60 + 30 * linecounter);
  gfx->println("-----------------");
  float gesamtpreis = 0;
  // gesamtpreis = amount_clicked[0] * 1.2 + amount_clicked[1] * 0.5 + amount_clicked[2] * 2 + amount_clicked[3] * 1 - depositamount * 1;
  for (int i = 0; i < amount; i++)
  {
    gesamtpreis += amount_clicked[i] * prices[i];
  }
  gesamtpreis -= depositamount * pfandpreis;
  sprintf(buffer, "  %-7s %.2f", "Gesamt", gesamtpreis, "€");
  gfx->println(buffer);



  int flag = 0;
  bool abbruch = false;
  while(!is_paid && !abbruch)
  {
    flag = readRFID_and_send(gesamtpreis);
    if (flag == 1)
    {
      is_paid = true;
    }
    if (flag == 2)
    {
      abbruch = true;
    }
    if(touch_touched)
    {
      int32_t x1, y1, actualx, actualy, counter;
      int clicked = -1;
      if (touch_touched())
      {
        x1 = touch_last_x;
        y1 = touch_last_y;
        actualx = 0;
        actualy = 0;
        counter = 0;
        while (touch_touched())
        {
          actualx += x1;
          actualy += y1;
          counter++;
          delay(10);
        }
        int x = actualx / counter;
        int y = actualy / counter;
        if (x > 15 && x < 290 && y > 330 && y < 450)
        {
          abbruch = true;
        }
      }
    }
  }
}

void init()
{
  for (int i = 0; i < amount; i++)
  {
    amount_clicked[i] = 0;
  }
  depositamount = 0;
  is_paid = false;
}

bool check_wifi()
{
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("WiFi disconnected");
    WiFi.begin(WiFi_SSID, WiFi_PASS);

    while (WiFi.status() != WL_CONNECTED)
    {
      delay(500);
      Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to the WiFi network");
    return false;
  }
  return true;
}

void getDrinks()
{
  Serial.println("getDrinks");
  // HTTP-Anfrage
   if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;
    http.begin(String(API_URL) + "/api/nfc-products?active=1");
    Serial.println(String(API_URL) + "/api/nfc-products?active=1");
    int httpCode = http.GET();
    if (httpCode > 0)
    {
      String payload = http.getString();
      payload_to_json(payload);
    }
    else
    {
      Serial.println("HTTP Code: ");
      Serial.println(httpCode);
    }
    http.end();
  }
  else
  {
    Serial.println("WiFi disconnected");
  }
}

void payload_to_json(String payload)
{
  // use ArduinoJSON library to parse the JSON response
  const size_t capacity = JSON_ARRAY_SIZE(8) + 8 * JSON_OBJECT_SIZE(5) + 8 * 30;
  DynamicJsonDocument doc(capacity);
  deserializeJson(doc, payload);
  int i = 0;
  for (JsonVariant v : doc.as<JsonArray>())
  {
    String name = v["name"];
    float price = v["price"];
    // wenn name mehr als 10 Zeichen hat, dann kürze es und füge ... hinzu
    if (name.length() > 10)
    {
      name = name.substring(0, 10);
    }
    texts[i] = name;
    prices[i] = price;
    i++;
  }
  amount = i+2;
  Serial.println("amount:");
  Serial.println(amount);
  for (int i = 0; i < amount; i++)
  {
    Serial.println(texts[i]);
  }
  texts[amount-2] = "Weiter";
  texts[amount-1] = "Abbruch";
  
}

int readRFID_and_send(float amount)
{
  // hier wird die RFID gelesen und die Daten an den Server gesendet
  // HTTP-Anfrage
  if(!mfrc522.PICC_IsNewCardPresent())
  {
    return 0;
  }
  if (!mfrc522.PICC_ReadCardSerial())
  {
    return 0;
  }
  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    uid.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : ""));
    uid.concat(String(mfrc522.uid.uidByte[i], HEX));
  }
  Serial.println(uid);
  mfrc522.PICC_HaltA();

  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;
    http.begin(String(API_URL) + "/api/nfc-cards/debit");
    http.addHeader("Content-Type", "application/json");
    // erstelle eine json mit {"uid": uid, "amount": amount, "handshake": "1234"}
    // uppercase uid please
    uid.toUpperCase();
    String json = "{\"cardId\":\"" + uid + "\",\"amount\":" + amount + ",\"handshake\":\"1234\"}";
    Serial.println(json);
    int httpCode = http.POST(json);
    if (httpCode > 0)
    {
      String payload = http.getString();
      Serial.println("payload:");
      Serial.println(payload);
      payload_to_json(payload);
      http.end();
      if (payload == "1")
      {
        return 1;
      }
      else
      {
        return 0;
      }
    }
    else
    {
      Serial.println("HTTP Code: ");
      Serial.println(httpCode);
      return 2;
    }
  }
  else
  {
    Serial.println("WiFi disconnected");
    return 2;
  }
}

