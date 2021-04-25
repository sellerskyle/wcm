//import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, {Component, useState} from 'react';
import { StyleSheet, ActivityIndicator, Text, View, Button, TextInput, PermissionsAndroid, Platform, TouchableHighlight } from 'react-native';
import { BleManager, Characteristic } from 'react-native-ble-plx';
import Slider from '@react-native-community/slider';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import base64 from 'react-native-base64'
//import { TextInput } from 'react-native-gesture-handler';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import GLOBAL from './global.js'
//import UTILS from './utils.js'

const Stack = createStackNavigator();

const OutputButton = (props) => {
  // const navigation = useNavigation();
  return (
    <TouchableHighlight onPress = {() => {GLOBAL.currentOutput = props.number; console.log(GLOBAL); props.navigation.navigate('Type');}} underlayColor='black'>
      <View style = {styles.outputButton}>
        <Text>Output {props.number}</Text>
        <Text>{props.outputType}</Text>
      </View>
    </TouchableHighlight>
  );
}

const updateOutputType = (outputNum, outputType) => {
switch(outputNum) {
  case "1":
    GLOBAL.output1.outputType = outputType;
    break;
  case "2":
    GLOBAL.output2.outputType = outputType;
    break;
  case "3":
    GLOBAL.output3.outputType = outputType;
    break;
  case "4":
    GLOBAL.output4.outputType = outputType;
    break;
  case "5":
    GLOBAL.output5.outputType = outputType;
    break;
  case "6":
    GLOBAL.output6.outputType = outputType;
    break;
  case "7":
    GLOBAL.output7.outputType = outputType;
    break;
  case "8":
    GLOBAL.output8.outputType = outputType;
    break;
  default:
    break;
}

}

const TypeButton = (props) => {
return (
  <TouchableHighlight onPress = {() => {updateOutputType(GLOBAL.currentOutput, props.type); props.navigation.navigate('Slider');}} underlayColor='black'>
    <View style = {styles.typeButton}>
      <Text>{props.type}</Text>
    </View>
  </TouchableHighlight>
);
}

const ConnectionScreen = ({route, navigation}) => {
  //const {connectionText} = route.params;
  return (
    <View style={styles.container}>
      <Text>Connecting to WCM...</Text>
      <ActivityIndicator size="large" color="#000000"/>
      <Button
        title="Outputs"
        onPress={() => {navigation.navigate('Outputs')}}
        color="#841584"
      />
    </View>
  );
  
}


const OutputScreen = ({navigation}) => {

return (
  <View style={styles.container}>
    <View style={styles.row}>
      <OutputButton number='1' outputType={GLOBAL.output1.outputType} navigation = {navigation}/>
      <OutputButton number='2' outputType={GLOBAL.output2.outputType} navigation = {navigation}/>
    </View>
    <View style={styles.row}>
      <OutputButton number='3' outputType={GLOBAL.output3.outputType} navigation = {navigation}/>
      <OutputButton number='4' outputType={GLOBAL.output4.outputType}navigation = {navigation}/>
    </View>
    <View style={styles.row}>
      <OutputButton number='5' outputType={GLOBAL.output5.outputType} navigation = {navigation}/>
      <OutputButton number='6' outputType={GLOBAL.output6.outputType} navigation = {navigation}/>
    </View>
    <View style={styles.row}>
      <OutputButton number='7' outputType={GLOBAL.output7.outputType} navigation = {navigation}/>
      <OutputButton number='8' outputType={GLOBAL.output8.outputType} navigation = {navigation}/>
    </View>
  </View>
);

}

const TypeScreen= ({navigation}) => {
return (
  <View style={styles.container}>
    <View style={styles.row}>
      <TypeButton type="Slider" navigation = {navigation}/>
      <TypeButton type="LFO" navigation = {navigation}/>
    </View>
    <View style={styles.row}>
      <TypeButton type="Trigger" navigation = {navigation}/>
      <TypeButton type="None" navigation = {navigation}/>
    </View>
  </View>
);
}

const polar_props = [
{label: 'Unipolar', value:'0'},
{label: 'Bipolar', value:'1'}
];

const linlog_props = [
{label: 'Linear', value:'0'},
{label: 'Logarithmic', value:'1'}
];

const SliderTextInput = (props) => {
  const [sliderVal, setSliderVal] = useState(0);
  const [minVal, setMinVal] = useState(-5);
  return (
    <View>
      <View style={{transform:[{rotate: "-90deg"}, {translateX: 0}, {translateY: 200}], width: 400, height:400}}>
        <Slider
          minimumValue={minVal}
          maximumValue={5}
          minimumTrackTintColor="#DDDDDD"
          maximumTrackTintColor="#333333"
          value={sliderVal}
          onValueChange={val => {
            setSliderVal(val);
            this.props.sendSliderValue(val);
            console.log(this.props);
          }}
          vertical={true}
        />
      </View>
      <View  style={{transform:[ {translateX: 100},], width: 200}}> 
        <TextInput 
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={val => {
            if (val == "")
            {
              setSliderVal(0.0);
            }
            else
            {
              setSliderVal(parseFloat(val));
            }

            this.props.sendSliderValue(val);
            
          }}
          value={sliderVal.toString()}
        />
      </View>
    </View>
  );

}

const SliderScreen = ({navigation, route}) => {
  const [polarProps, setPolarProps] = useState(0);
  const [linLogProps, setLinLogProps] = useState(0);
  const {sendSliderValue} = route.params;

  // newSendSliderVal = (val) =>
  // {
  //   sendSliderValue(val);
  // }
  return (
    <View style={styles.container}>
      {/* <Button title='Back' onPress={() => navigation.navigate('Outputs')} /> */}
      {/* <SliderTextInput sendSliderValue={(val) => this.newSendSliderValue(val)}/> */}
      <View style={{transform:[{rotate: "-90deg"}, {translateX: 0}, {translateY: 200}], width: 400, height:400}}>
        <Slider
          minimumValue={-5}
          maximumValue={5}
          minimumTrackTintColor="#DDDDDD"
          maximumTrackTintColor="#333333"
          //value={sliderVal}
          onValueChange={val => {
            //setSliderVal(val);
            //this.props.sendSliderValue(val);
            sendSliderValue(val);
            //console.log(this.props);
          }}
        />
      </View>
      <RadioForm
        radio_props={polar_props}
        initial={0}
        onPress={(value) => {setPolarProps(value)}}
      />

      <RadioForm
        radio_props={linlog_props}
        initial={0}
        onPress={(value) => {setLinLogProps(value)}}
      />

    </View>
  );
}

const TriggerScreen = ({navigation, route}) => {
  const {sendSliderValue} = route.params;

  // newSendSliderVal = (val) =>
  // {
  //   sendSliderValue(val);
  // }
  return (
    <View style={styles.container}>
      {/* <Button title='Back' onPress={() => navigation.navigate('Outputs')} /> */}
      {/* <SliderTextInput sendSliderValue={(val) => this.newSendSliderValue(val)}/> */}
      <View style={{transform:[{rotate: "-90deg"}, {translateX: 0}, {translateY: 200}], width: 400, height:400}}>
        <Slider
          minimumValue={-5}
          maximumValue={5}
          minimumTrackTintColor="#DDDDDD"
          maximumTrackTintColor="#333333"
          //value={sliderVal}
          onValueChange={val => {
            //setSliderVal(val);
            //this.props.sendSliderValue(val);
            sendSliderValue(val);
            //console.log(this.props);
          }}
        />
      </View>
      <RadioForm
        radio_props={polar_props}
        initial={0}
        onPress={(value) => {setPolarProps(value)}}
      />

      <RadioForm
        radio_props={linlog_props}
        initial={0}
        onPress={(value) => {setLinLogProps(value)}}
      />

    </View>
  );
}





export default class App extends Component {

  constructor() {
    super();
    this.manager = new BleManager();
    this.sendPacket = this.sendPacket.bind(this);
    this.sendSliderValue = this.sendSliderValue.bind(this);

    this.state = {
      deviceID: "QE",
      serviceID: "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
      characteristicID: "beb5483e-36e1-4688-b7f5-ea07361b26a8",
      connectionText: "Connecting to WCM",
      packetVal: "AQE="
    };

    
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

  // componentWillMount() {
  //   const subscription = this.manager.onStateChange((state) => {
  //     if (state === 'PoweredOn') {
  //         this.scanAndConnect();
  //         subscription.remove();
  //     }
  //   }, true);

  // }

  // Make sure to put check for if bluetooth
  componentDidMount() {
    //UTILS.onComponentDidMount();
    const subscription = this.manager.onStateChange((state) => {
      console.log(state);
      if (state === 'PoweredOn') {
          this.scanAndConnect();
          subscription.remove();
      }
    }, true);
  }

  sendSliderValue = (value) =>
  {
    var newValue = 0;
    newValue = (GLOBAL.currentOutput - 1) << 12;
    value += 5.0;
    value *= 409.6;
    value = Math.floor(value);
    value -= 4095;
    value *= -1;
    value = parseInt(value, 10);
    newValue |= value;
    this.setState({packetVal: newValue})
    this.sendPacket();
  }

  sendPacket = () =>
  {
    //console.log(this.state.deviceID);
    var byteArray = new Uint8Array(2);
    byteArray[0] = this.state.packetVal >> 8;
    byteArray[1] = this.state.packetVal & 255;
    this.manager.writeCharacteristicWithResponseForDevice(this.state.deviceID, this.state.serviceID, this.state.characteristicID, base64.encodeFromByteArray(byteArray))
    // .then((characteristic) => {
    //   console.log("Kyle it worked");
    //   console.log(characteristic);
    // })
    .catch((error) => {
      console.error(error);
    });
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
                this.setState({connectionText: "Connected!"})
                GLOBAL.deviceID = device.id;
                GLOBAL.connectionText = "Connected!";


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

  render()
  {


    return (

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Connection'
          component={ConnectionScreen}
          // initialParams={{ connectionText: this.state.connectionText}}
        />
        <Stack.Screen
          name='Outputs'
          component={OutputScreen}
        />
        <Stack.Screen
          name='Slider'
          component={SliderScreen}
          initialParams={{ sendSliderValue: this.sendSliderValue}}
        />
        <Stack.Screen
          name='Type'
          component={TypeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
      // <View style={styles.container}>
      //   <Text>{this.state.connectedText}</Text>
      //   <TextInput
      //     onChangeText={text => this.setState({packetVal: text})}
      //     value={this.state.packetVal}
      //   />
      //   <Button 
      //     onPress={this.sendPacket}
      //     title="Send Packet"
      //     color="#841584"
      //   />
      //   {/* <Button
      //     onPress={this.scanAndConnect}
      //     title="Scan and Connect"
      //     color="#841584"
      //     accessibilityLabel="Button for connecting "
      //   />   */}
      //   <StatusBar style="auto" />
      // </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  outputButton: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    alignContent: 'stretch',
    //alignItems: 'stretch',
    justifyContent: 'center',
    paddingLeft: 60,
    paddingRight: 60,
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 2,
  },

  typeButton: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    alignContent: 'stretch',
    //alignItems: 'stretch',
    justifyContent: 'center',
    paddingLeft: 75,
    paddingRight: 75,
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 2,
  },

  sliderStyle: {

  },


});
