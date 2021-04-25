import { BleManager, Characteristic } from 'react-native-ble-plx';

class utils 
{
    constructor()
    {
        this.manager = new BleManager();

        if (Platform.OS === 'android') {
            //console.log("SENT");
            // Calling the permission function
            const granted = PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
              {
                title: 'Bluetooth Permissions',
                message: 'We need access to bluetooth permissions',
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              // Permission Granted
              console.log('granted');
            }
          }
    }

    onComponentDidMount()
    {
        const subscription = this.manager.onStateChange((state) => {
            console.log(state);
            if (state === 'PoweredOn') {
                this.scanAndConnect();
                subscription.remove();
            }
          }, true);
    }

    scanAndConnect() { //Scans about every 4 seconds
        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                // Handle error (scanning will be stopped automatically)
                console.error(error);
                return
            }
            //console.log(device.name);
            
            // Check if it is a device you are looking for based on advertisement data
            // or other criteria.
            if (device.name === 'WCM') {
              console.log(device.name);
                // Stop scanning as it's not necessary if you are scanning for one device.
                this.manager.stopDeviceScan();
    
                // Proceed with connection.
    
                //Service ID: "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
                //Characteristic ID: "beb5483e-36e1-4688-b7f5-ea07361b26a8"
                //Characteristic ID:
                device.connect()
                  .then((device) => {
                      return device.discoverAllServicesAndCharacteristics()
                  })
                  .then((device) => {
                    this.setState({deviceID: device.id})
                    GLOBAL.deviceID = device.id;
                    this.setState({connectionText: "Connected!"});
    
                    //console.log(device);
                    //return device.writeCharacteristicWithResponseForService("4fafc201-1fb5-459e-8fcc-c5c9c331914b", "beb5483e-36e1-4688-b7f5-ea07361b26a8", "zN0=");
                    //return device.services();
                  // }).then((characteristic) => {
                  //   console.log("Kyle it worked");
                  //   console.log(characteristic);
    
                  // }).then((services) => {
                  //   return services[2].characteristics();
                  // }).then((characteristics) => {
                  //   console.log(characteristics);
                  }).catch((error) => {
                    console.error(error);
                      // Handle errors
                  });
            }
        });
    }
}

export default utils;