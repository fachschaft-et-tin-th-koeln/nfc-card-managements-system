import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QAction, QDialog, QVBoxLayout, QLabel, QLineEdit, QPushButton, QFormLayout, QMessageBox, QStatusBar
from PyQt5.QtCore import QSettings, Qt, pyqtSignal
from PyQt5.QtGui import QColor, QPalette, QFont, QPixmap
import serial
import os

#  Setze das Format auf IniFormat und gebe den Pfad zur INI-Datei an
# Bestimme den Pfad zum "settings"-Unterordner im aktuellen Verzeichnis der Anwendung
currentDir = os.path.dirname(os.path.realpath(__file__))
settingsDir = os.path.join(currentDir, "settings")
settingsPath = os.path.join(settingsDir, "settings.ini")

# Stelle sicher, dass der "settings"-Ordner existiert
if not os.path.exists(settingsDir):
	os.makedirs(settingsDir)


class SettingsDialog(QDialog):
	def __init__(self, parent=None):
		super(SettingsDialog, self).__init__(parent)
		self.mainWindow = parent
		self.initUI()

	def initUI(self):
		self.setWindowTitle("Datei")
		self.layout = QVBoxLayout()

		formLayout = QFormLayout()
		self.portLineEdit = QLineEdit(self)
		self.baudRateLineEdit = QLineEdit(self)

		formLayout.addRow("Port:", self.portLineEdit)
		formLayout.addRow("Baudrate:", self.baudRateLineEdit)

		self.saveButton = QPushButton("Speichern", self)
		self.saveButton.clicked.connect(self.saveSettings)

		self.layout.addLayout(formLayout)
		self.layout.addWidget(self.saveButton)
		self.setLayout(self.layout)

		self.loadSettings()

	def loadSettings(self):
		settings = QSettings(settingsPath, QSettings.IniFormat)
		self.portLineEdit.setText(settings.value("port", "COM1"))
		self.baudRateLineEdit.setText(settings.value("baudRate", "9600"))

	def saveSettings(self):
		settings = QSettings(settingsPath, QSettings.IniFormat)
		settings.setValue("port", self.portLineEdit.text())
		settings.setValue("baudRate", self.baudRateLineEdit.text())
		self.accept()
		self.mainWindow.trySerialConnection()

class WifiSettingsDialog(QDialog):
    settingsChanged = pyqtSignal()  # Neues Signal

    def __init__(self, parent=None):
        super(WifiSettingsDialog, self).__init__(parent)
        self.initUI()

    def initUI(self):
        self.setWindowTitle("WLAN-Einstellungen")
        layout = QVBoxLayout()

        formLayout = QFormLayout()
        self.ssidLineEdit = QLineEdit(self)
        self.passwordLineEdit = QLineEdit(self)
        self.passwordLineEdit.setEchoMode(QLineEdit.Password)  # Passwort verbergen
        formLayout.addRow("SSID:", self.ssidLineEdit)
        formLayout.addRow("Passwort:", self.passwordLineEdit)

        saveButton = QPushButton("Speichern", self)
        saveButton.clicked.connect(self.saveSettings)

        layout.addLayout(formLayout)
        layout.addWidget(saveButton)
        self.setLayout(layout)

        self.loadSettings()

    def loadSettings(self):
        settings = QSettings(settingsPath, QSettings.IniFormat)
        self.ssidLineEdit.setText(settings.value("wifiSSID", ""))
        self.passwordLineEdit.setText(settings.value("wifiPassword", ""))

    def saveSettings(self):
        settings = QSettings(settingsPath, QSettings.IniFormat)
        settings.setValue("wifiSSID", self.ssidLineEdit.text())
        settings.setValue("wifiPassword", self.passwordLineEdit.text())
        self.settingsChanged.emit()
        self.accept()

class MainWindow(QMainWindow):
	def __init__(self):
		super().__init__()
		# self.serialConnection = None

		self.initUI()
		self.initSerialConnection()

	def initUI(self):
		self.setWindowTitle("Hauptfenster")
		self.setGeometry(100, 100, 800, 600)

		# Menüleiste
		menubar = self.menuBar()
		settingsMenu = menubar.addMenu('Datei')
		wifiMenu = menubar.addMenu('WLAN')

		# Aktion für serielle Verbindungseinstellungen
		serialSettingsAction = QAction('Serielle Verbindung', self)
		serialSettingsAction.triggered.connect(self.openSerialSettingsDialog)
		settingsMenu.addAction(serialSettingsAction)

		# Aktion für WLAN-Einstellungen
		wifiSettingsAction = QAction('WLAN', self)
		wifiSettingsAction.triggered.connect(self.openWifiSettingsDialog)
		wifiMenu.addAction(wifiSettingsAction)

		self.statusBar = QStatusBar(self)
		self.setStatusBar(self.statusBar)
		self.statusMessageLabel = QLabel("Initialisierung...")
		self.statusMessageLabel.setFont(QFont("Arial", 9))
		self.statusBar.addWidget(self.statusMessageLabel)

		self.wlanStatusIndicator = QLabel()  # WLAN-Statusanzeige
		self.wlanStatusIndicator.setPixmap(QPixmap("red_dot.png"))  # Standard: Roter Punkt
		self.toolbar = self.addToolBar('WLAN Status')
		self.toolbar.addWidget(self.wlanStatusIndicator)
		self.toolbar.addWidget(QLabel("WLAN"))

	def initSerialConnection(self):
		self.trySerialConnection()
		self.updateWlanStatus()

	def trySerialConnection(self):
		settings = QSettings(settingsPath, QSettings.IniFormat)
		port = settings.value("port", "COM1")
		baudRate = settings.value("baudRate", "9600")

		try:
			if hasattr(self, 'serialConnection'):
				self.serialConnection.close()
			self.serialConnection = serial.Serial(port, baudRate, timeout=1)
			self.statusMessageLabel.setText(f"Verbunden mit {port} bei {baudRate} Baud")
			self.statusMessageLabel.setStyleSheet("color: black;")
		except serial.SerialException as e:
			self.statusMessageLabel.setText(f"Verbindung fehlgeschlagen: {e}")
			self.statusMessageLabel.setStyleSheet("color: red;")

	def openSerialSettingsDialog(self):
		dialog = SettingsDialog(self)
		if dialog.exec_():
			QMessageBox.information(self, "Einstellungen gespeichert", "Die seriellen Verbindungseinstellungen wurden erfolgreich gespeichert.")

	def openWifiSettingsDialog(self):
		dialog = WifiSettingsDialog(self)
		if dialog.exec_():
			QMessageBox.information(self, "WLAN-Einstellungen gespeichert", "Die WLAN-Einstellungen wurden erfolgreich gespeichert.")

	def updateWlanStatus(self):
		# Todo: Hier Logik zur Überprüfung des WLAN-Status einfügen
		wlan_connected = True  # Dies sollte basierend auf realen Daten gesetzt werden
		if wlan_connected:
			self.wlanStatusIndicator.setPixmap(QPixmap("green_dot.png"))
		else:
			self.wlanStatusIndicator.setPixmap(QPixmap("red_dot.png"))

if __name__ == '__main__':
	app = QApplication(sys.argv)
	mainWindow = MainWindow()
	mainWindow.show()
	sys.exit(app.exec_())
