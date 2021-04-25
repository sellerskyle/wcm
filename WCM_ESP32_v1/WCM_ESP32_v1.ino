
//CS1 = 15
//CS2 = 2
//CS3 = 4
//CS4 = 16
//LDAC = 17
//SPI(MOSI) = 5
//SCK(CLK) = 18
//3.3V Reference = 19

//Taking from DAC_Test and BLE_Write
//Used with Lightblue App

// include the library code:
#include <SPI.h>

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>


// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
 
// Set Constants
const int CS1 = 15;
const int CS2 = 2;
const int CS3 = 4;
const int CS4 = 16;
//const int powerPin = 19;


int OutValues[8] = {2048, 2048, 2048, 2048, 2048, 2048, 2048, 2048};

class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      uint8_t hi = *pCharacteristic->getData();
      uint8_t lo = *(pCharacteristic->getData() + 1);
      uint8_t outNum = hi >> 4;
      outNum = outNum % 8;
//      Serial.print("OutNum: ");
//      Serial.println(String(outNum));
//      Serial.print("HI value: ");
//      Serial.println(String(hi));
//      Serial.print("LO value: ");
//      Serial.print(String(lo));

      
      OutValues[outNum] = 0;
      OutValues[outNum] = hi << 8;
      OutValues[outNum] |= lo;
      OutValues[outNum] = OutValues[outNum] % 4096;
//      Serial.println("*********");
//      Serial.print("New value: ");
//      Serial.print(OutValues[outNum]);
//      Serial.println();
//      Serial.println("*********");
      
      }
};

// Start setup function:
void setup() {  
//  Serial.begin(115200);
  pinMode (CS1, OUTPUT);
  pinMode (CS2, OUTPUT);
  pinMode (CS3, OUTPUT);
  pinMode (CS4, OUTPUT);
  // set the ChipSelectPins high initially: 
  digitalWrite(CS1, HIGH);
  digitalWrite(CS2, HIGH);  
  digitalWrite(CS3, HIGH);  
  digitalWrite(CS4, HIGH);  

  //pinMode (powerPin, OUTPUT);
  //digitalWrite(powerPin, HIGH);
  // initialise SPI:
  SPI.begin();
  SPI.setBitOrder(MSBFIRST);         // Not strictly needed but just to be sure.
  SPI.setDataMode(SPI_MODE0);        // Not strictly needed but just to be sure.
  BLEDevice::init("WCM");
  BLEServer *pServer = BLEDevice::createServer();

  BLEService *pService = pServer->createService(SERVICE_UUID);

  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE |
                                         BLECharacteristic::PROPERTY_WRITE_NR
                                       );

  pCharacteristic->setCallbacks(new MyCallbacks());

  pCharacteristic->setValue("Hello World");
  pService->start();

  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->start();
} // End setup function.

// Start loop function:
void loop() {

  for (int i = 0; i < 8; i++)
  {
    setDac(OutValues[i], i);
  }

  delay(10);
}// End of loop function.


// Function to set the DAC, Accepts the Value to be sent and the cannel of the DAC to be used.
void setDac(int value, int channel) {
  byte dacRegister = 0b00110000;                        // Sets default DAC registers B00110000, 1st bit choses DAC, A=0 B=1, 2nd Bit bypasses input Buffer, 3rd bit sets output gain to 1x, 4th bit controls active low shutdown. LSB are insignifigant here.
  int dacSecondaryByteMask = 0b0000000011111111;        // Isolates the last 8 bits of the 12 bit value, B0000000011111111.
  byte dacPrimaryByte = (value >> 8) | dacRegister;     //Value is a maximum 12 Bit value, it is shifted to the right by 8 bytes to get the first 4 MSB out of the value for entry into th Primary Byte, then ORed with the dacRegister  
  byte dacSecondaryByte = value & dacSecondaryByteMask; // compares the 12 bit value to isolate the 8 LSB and reduce it to a single byte. 
  // Sets the MSB in the primaryByte to determine the DAC to be set, DAC A=0, DAC B=1
  switch (channel % 2) {
   case 0:
     dacPrimaryByte &= ~(1 << 7);     
   break;
   case 1:
     dacPrimaryByte |= (1 << 7);  
  }
  noInterrupts(); // disable interupts to prepare to send data to the DAC
  switch (channel / 2) // take the Chip Select pin low to select the DAC:
  {
    case 0:
      digitalWrite(CS1, LOW);
      break;
    case 1:
      digitalWrite(CS2, LOW);
      break;
    case 2:
      digitalWrite(CS3, LOW);
      break;
    case 3:
      digitalWrite(CS4, LOW);
      break;
  }
  SPI.transfer(dacPrimaryByte); //  send in the Primary Byte:
  SPI.transfer(dacSecondaryByte);// send in the Secondary Byte
  switch (channel / 2) // take the Chip Select pin high to de-select the DAC:
  {
    case 0:
      digitalWrite(CS1, HIGH);
      break;
    case 1:
      digitalWrite(CS2, HIGH);
      break;
    case 2:
      digitalWrite(CS3, HIGH);
      break;
    case 3:
      digitalWrite(CS4, HIGH);
      break;
  }
  interrupts(); // Enable interupts
}
