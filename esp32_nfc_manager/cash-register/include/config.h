#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>
#include <vector>

struct ConfigOption;

extern std::vector<ConfigOption> configOptions;
extern std::vector<ConfigOption *> optionStack;

struct ConfigOption {
    String name;
    void (*handler)();
    std::vector<ConfigOption> subOptions;
    ConfigOption *parent;

    ConfigOption(String n, void (*h)(), std::vector<ConfigOption> sub = {},
                 ConfigOption *p = nullptr)
        : name(n), handler(h), subOptions(sub), parent(p)
    {
        for (auto &option : subOptions) {
            option.parent = this;
        }
    }
};

void initializeConfigOptions();
void checkSerialForConfigCommand();

void sendAcknowledge();
void sendAcknowledge(const String &optionName);
void displayCurrentOptions();
void enterConfigMode();
void processConfigCommand(const String &command);
void processConfigOption(const String &option);
void processConfigValue(const String &value);
void processConfigBack();
void processConfigExit();
void processConfigHelp();
void processConfigList();
void processConfigSave();
void processConfigLoad();
void processConfigReset();
void processConfigDelete();
void processConfigAdd();
void processConfigRemove();
void processConfigSet();
void processConfigGet();
void processConfigPush();
void processConfigPop();
void processConfigPeek();
void processConfigPrint();
void processConfigClear();
void processConfigUnknown();

#endif
