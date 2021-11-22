import { Camera } from 'expo-camera';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { storage } from '../firebase/config';

export default class MyCamera extends React.Component{
    constructor(props){
        super(props);
        this.camera; //Variable vacía
        this.state = {
            photo: '',
            permission: false,
        }
    }

    componentDidMount(){
        Camera.requestCameraPermissionsAsync()
        .then(response => {
            console.log(response)
            this.setState({
            permission: response.granted
            })
        })
    }

    takePicture(){
        if(!this.camera) return;
        this.camera.takePictureAsync()
        .then(photo => {
            console.log(photo)
            this.setState({
                photo: photo.uri
            })
        })
    }

    uploadImage(){
        fetch(this.state.photo)
        .then(res => {
            return res.blob();
        })
        .then(image => {
            //console.log(image);
            const ref = storage.ref(`camera/${Date.now()}.jpg`)
            ref.put(image)
            .then(()=>{
                ref.getDownloadURL()
                .then(url => {
                    console.log(url);
                    this.setState({
                        photo: ''
                    })
                    this.props.savePhoto(url);
                })
            })
        })
    }

    onReject(){
        this.setState({
            photo: ''
        })
    }

    render(){
        console.log(this.state)
        return(
        <View style = {styles.container}>
            {
            this.state.photo ?
            <>
            <Image 
            style={styles.preview}
            source={{uri: this.state.photo}}
            />
            <View style={styles.btnContainer}>
                <Text>Do you like the photo? Post it! If not, try taking another one...</Text>
                <TouchableOpacity
                    style={styles.reject}
                    onPress={() => this.onReject()}
                ><Text style={styles.text}>X</Text></TouchableOpacity>

                <TouchableOpacity
                    style={styles.accept}
                    onPress={() => this.uploadImage()}
                ><Text style={styles.text}>Continue...</Text>
                </TouchableOpacity>
            </View>
            </>
            :
            
            <Camera
                style={styles.camera}
                type={Camera.Constants.Type.front || Camera.Constants.Type.back}
            
                ref = {referencia => this.camera = referencia}
            >
                {/* Ref hace referencia al objeto Camera, para luego utilizar sus métodos */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.takePicture()}>
                    </TouchableOpacity>
                </View>
            </Camera>
            }
        </View>
        )
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        borderRadius: "5px",
        backgroundColor: "#FFFFD0",
    },
    camera: {
        flex: 1,
        width: '50%',
        alignSelf:"center"
    },
    buttonContainer: {
        width: '100%',
        height: 124,
        position: 'absolute',
        bottom: 40,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        width: "60px",
        height: '60px',
        borderWidth: 2,
        borderColor: '#FFFFD0',
        borderRadius: 100,
        marginTop: "100px",
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
    text: {
        width: '100%',
        textAlign: 'center',
        color: 'white',
        paddingTop: 15
    },
    imageContainer: {
        height: '90%',
    },
    preview: {
        width: '50%',
        marginTop:"10px",
        flex: 6,
        alignSelf:"center",
        borderRadius:"5px"
    },
    btnContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '50%',
        alignSelf:"center"
    },
    accept: {
        width: 100,
        height: 50,
        backgroundColor: '#95FF80',
        borderRadius: 50
    },
    reject: {
        width: 100,
        height: 50,
        backgroundColor: '#FF8080',
        borderRadius: 50
    }
})