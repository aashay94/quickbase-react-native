import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { BarCodeScanner, Permissions, Audio } from 'expo';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      barCode: '',
      hasCameraPermission: null,
      isBarCodeSelected: false
    }
  }
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  handleName = (text) => {
    this.setState({ name: text });
  }

  handleBarCode = (text) => {
    this.setState({ barCode: text });
  }
  addPart = () => {
    let auth_ticket = '9_bpjdf4dkh_b4icxu_m24p_a_-b_viw5eibdzvm6wcmyr8buckyedyvzws2ejbdmdg2xcdpnwacu7s3q7_cdpuice';
    let app_token = 'crdngi7ds28jiwcnuq9m8k4s2dg';
    if (this.state.name = "" || this.state.barCode == "") {
      alert("Name or barcode cannot be empty");
    }
    else {
      fetch(`https://aashaytiwari.quickbase.com/db/bpiwwt23r?a=API_AddRecord&_fnm_name=${this.state.name}&_fnm_barcode=${this.state.barCode}
    &ticket=${auth_ticket}&apptoken=${app_token}`, {
          method: 'POST'
        }).then(() => {
          alert("Data added successfully");
          this.setState({
            name: '',
            barCode: '',
            isBarCodeSelected: false
          });
        })
        .catch((error) => {
          alert(error);
        });
    }
  }
  playSound = async(soundObject) => {   
      try {
        await soundObject.loadAsync(require('./assets/hello.mp3'));
        await soundObject.playAsync();
        // Your sound is playing!
      } catch (error) {
        // An error occurred!
        alert(error);
      }
  }
  handleBarCodeScanned = ({ type, data }) => {
    const soundObject = new Audio.Sound();
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    this.setState({ barCode: data, isBarCodeSelected: false });
    if(this.state.data != data) {
      this.playSound(soundObject);
    }   
    console.log("Bar code scanned");
    
  }
  toggleBarCodeVal = () => {
    this.setState({ isBarCodeSelected: true });
  }
  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#841584" }}>Add New Part Form</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Name"
          maxLength={20}
          onChangeText={this.handleName}
          value={this.state.name}
        />
        <TextInput
          style={styles.textInput}
          placeholder="BarCode"
          maxLength={12}
          onFocus={this.toggleBarCodeVal}
          onChangeText={this.handleBarCode}
          value={this.state.barCode}
        /> 
        <Button
          style={styles.button}
          onPress={this.addPart}
          title="Add Part"
          color="#841584"
        />
        <BarCodeScanner
          onBarCodeScanned={this.state.isBarCodeSelected? this.handleBarCodeScanned: null}
          style={this.state.isBarCodeSelected ? StyleSheet.absoluteFill : styles.hidden}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#89B5D2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: 50,
    width: 220,
    marginTop: 20,
    marginBottom: 20,
    borderColor: 'gray',
    borderWidth: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  hidden: {
    width: 0,
    height: 0,
  },
  button: {
    backgroundColor: 'blue',
    marginTop: 20
  }
});
