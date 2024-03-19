#include "config.h"

void checkSerialForConfigCommand()
{
    if (Serial.available()) {
        String input = Serial.readStringUntil('\n');
        input.trim();
        input.toLowerCase();

        if (input.equals("config") && optionStack.empty()) {
            enterConfigMode();
        } else {
            processConfigCommand(input);
        }
    }
}

void sendAcknowledge() { Serial.println(">>>ACK<<<"); }

void sendAcknowledge(const String &optionName)
{
    if (optionName != "") {
        Serial.println(">>>" + optionName + "<<<");
    } else {
        Serial.println(">>>ACK<<<");
    }
}

void displayCurrentOptions()
{
    Serial.println(F("Available options:"));
    if (optionStack.back() == nullptr) {
        for (auto &option : configOptions) {
            Serial.println(option.name);
        }
    } else {
        for (auto &option : optionStack.back()->subOptions) {
            Serial.println(option.name);
        }
        Serial.println("exit");
    }
    sendAcknowledge(">>>menu<<<");
}

void enterConfigMode()
{
    Serial.println(F("Entered configuration mode."));
    optionStack.push_back(nullptr);
    displayCurrentOptions();
}

void processConfigCommand(const String &command)
{
    if (optionStack.empty()) {
        Serial.println(F("Not in config mode. Send 'config' to start."));
        return;
    }

    // Verarbeitung des "exit"-Befehls
    if (command == "exit") {
        if (optionStack.back() == nullptr ||
            optionStack.back()->parent == nullptr) {
            optionStack.clear();
            Serial.println(F("Exited configuration mode."));
            return;
        } else {
            optionStack.pop_back();
            optionStack.back() = optionStack.back()->parent;
            displayCurrentOptions();
            return;
        }
    }

    std::vector<ConfigOption> *currentOptions =
        optionStack.back() == nullptr ? &configOptions
                                      : &optionStack.back()->subOptions;
    for (auto &option : *currentOptions) {
        if (command.equals(option.name)) {
            option.handler();
            optionStack.push_back(&option);
            displayCurrentOptions();
            return;
        }
    }

    // Gebe mir den comamnd aus
    String output = "Unknown command. Please try again. " + command;
    Serial.println(output);
}

void processConfigOption(const String &option)
{
    for (auto &configOption : optionStack.back()->subOptions) {
        if (configOption.name == option) {
            optionStack.push_back(&configOption);
            displayCurrentOptions();
            return;
        }
    }
    Serial.println("Unknown option: " + option);
}

void processConfigValue(const String &value)
{
    Serial.println("Setting value: " + value);
}

void processConfigBack()
{
    if (optionStack.size() > 1) {
        optionStack.pop_back();
        displayCurrentOptions();
    } else {
        Serial.println("Cannot go back from root");
    }
}

void processConfigExit()
{
    Serial.println(F("Exiting config mode"));
    Serial.println(F("Send 'config' to enter configuration mode."));
}

void processConfigHelp() { Serial.println("Help"); }

void processConfigList() { Serial.println("List"); }

void processConfigSave() { Serial.println("Save"); }

void processConfigLoad() { Serial.println("Load"); }

void processConfigReset() { Serial.println("Reset"); }

void processConfigDelete() { Serial.println("Delete"); }

void processConfigAdd() { Serial.println("Add"); }

void processConfigRemove() { Serial.println("Remove"); }

void processConfigSet() { Serial.println("Set"); }

void processConfigGet() { Serial.println("Get"); }

void processConfigPush() { Serial.println("Push"); }

void processConfigPop() { Serial.println("Pop"); }

void processConfigPeek() { Serial.println("Peek"); }

void processConfigPrint() { Serial.println("Print"); }

void processConfigClear() { Serial.println("Clear"); }

void processConfigUnknown() { Serial.println("Unknown command"); }
