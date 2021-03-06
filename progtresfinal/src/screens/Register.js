import React, { Component } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Alert} from 'react-native';
import { auth } from '../firebase/config';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            username: ""
        }
    }

    onRegister(){
        if (this.state.email !== "" && this.state.password !== "" && this.state.username !== ""){
            this.props.handleRegister(this.state.email, this.state.password, this.state.username)
        }
        else {
            console.log("Completar los campos!")
            alert("Completar los campos")
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Enter your email, pick a funny username and establish your password to sign up</Text>
                <TextInput
                    style={styles.field}
                    keyboardType="default"
                    placeholder="username"
                    onChangeText={text => this.setState({ username: text })}
                />
                <TextInput
                    style={styles.field}
                    keyboardType="email-address"
                    placeholder="email"
                    onChangeText={text => this.setState({ email: text })}
                />
                <TextInput
                    style={styles.field}
                    keyboardType='default'
                    placeholder="password"
                    secureTextEntry={true} //para que se muestren los *
                    onChangeText={text => this.setState({ password: text })}
                />
                
                {this.props.error ? <Text>{this.props.error.message}</Text>
                :
                null   
                }

                <TouchableOpacity style = {styles.button} onPress={() => this.onRegister()}>
                    <Text style = {styles.text}>Register</Text> 
                </TouchableOpacity> 
            </View> //primero linea 15 y si esta todo bien se ejecuta la funcion que se paso por props
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor:"#FFFFD0"
    },
    field: {
        width: '40%',
        backgroundColor: "#E5E5E5",
        borderRadius:"4px",
        color: '#FFA400',
        padding: 10,
        marginVertical: 10
    },
    button: {
        width: '8%',
        height:"32px",
        backgroundColor: "#E5E5E5",
        borderRadius:"4px"
    },
    text: {
        color: '#FFA400',
        fontSize: 20,
        alignSelf:"center"
    }
})