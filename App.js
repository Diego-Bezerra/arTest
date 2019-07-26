import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  PermissionsAndroid
} from 'react-native';
import {
  accelerometer,
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";
import { RNCamera } from 'react-native-camera';
import Geolocation from 'react-native-geolocation-service';


setUpdateIntervalForType(SensorTypes.accelerometer, 500);

class TextComp extends Component {
  render() {

    styleTitle = { fontSize: 20, color: 'white', fontWeight: 'bold' };
    styleVal = { fontSize: 20, color: 'white', };

    return (
      <View>
        <Text style={styleTitle}>
          {this.props.title + ":" + " "}
          <Text style={styleVal}>
            {this.props.desc}
          </Text>
        </Text>
      </View>
    )
  }
}

class Debugger extends Component {

  state = {
    X: 0,
    Y: 0,
    Z: 0,
    inc_lat_deg: 0,
    inc_front_deg: 0
  }

  componentDidMount() {
    accelerometer.subscribe(({ x, y, z, timestamp }) => {
      const inclinationLat = Math.atan(x / y).toFixed(2);
      const inclinationFront = Math.atan(z / y).toFixed(2);
      this.setState({
        X: x.toFixed(2),
        Y: y.toFixed(2),
        Z: z.toFixed(2),
        inc_lat_deg: this.rad2deg(inclinationLat).toFixed(2),
        inc_front_deg: this.rad2deg(inclinationFront).toFixed(2)
      })
    });
  }

  rad2deg(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
  }

  render() {

    styleTitle = { fontSize: 20, color: 'white', fontWeight: 'bold' };
    styleVal = { fontSize: 20, color: 'white', };

    return (
      <View style={{ backgroundColor: 'gray', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TextComp
          title='X'
          desc={this.state.X} />
        <TextComp
          title='Y'
          desc={this.state.Y} />
        <TextComp
          title='Z'
          desc={this.state.Z} />
        <TextComp
          title='Inc_Lat'
          desc={this.state.inc_lat_deg} />
        <TextComp
          title='Inc_Front'
          desc={this.state.inc_front_deg} />
      </View>
    );
  }
};

var { height, width } = Dimensions.get('window');
const posto = {
  lat: -8.041474,
  lng: -34.936775
}
class App extends Component {

  state = {
    left: 10,
    top: 150
  }

  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getGeo();
      }
    } catch (err) {
      console.warn(err);
    }
  }

  componentDidMount() {
    this.requestCameraPermission();
  }

  rad2deg(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
  }

  getGeo() {
    Geolocation.getCurrentPosition(
      (position) => {
        //alert(JSON.stringify(position));
        let b = posto.lat - position.coords.latitude;
        let a = posto.lng - position.coords.longitude;

        //alert(posto.latitude);

        let tang = b / a;
        let deg = this.rad2deg(Math.atan(tang));
        alert(deg);
      },
      (error) => {
        // See error code charts below.
        alert(error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  handleCanvas = (canvas) => {
    canvas.height = height;
    canvas.width = width;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'purple';
    ctx.fillRect(150, 250, 30, 30);
  }

  render() {

    pic = {
      position: 'absolute',
      left: this.state.left,
      top: this.state.top,
      backgroundColor: 'blue',
      width: 50,
      height: 50
    }

    return (
      <View style={{ flex: 1 }}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={{ flex: 1 }}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
        <View style={pic} />
      </View>
    )
  }
}

export default App;