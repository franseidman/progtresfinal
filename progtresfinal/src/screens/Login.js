import React, { Component } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet} from 'react-native';
import { auth } from '../firebase/config';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        }
    }


    render() {
        console.log(this.state.loggedIn);
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Enter your email and password to login</Text>
                <TextInput
                    style={styles.field}
                    keyboardType="email-address"
                    placeholder="email"
                    onChangeText={text => this.setState({ email: text })} //actualiza el estado a medida que se va cambiando el input.
                />
                <TextInput
                    style={styles.field}
                    keyboardType='number-pad'
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={text => this.setState({ password: text })}
                />
                <TouchableOpacity style = {styles.button} onPress={() => this.props.handleLogin(this.state.email, this.state.password)}>
                    <Text style = {styles.text}> Login </Text>
                </TouchableOpacity> 
            </View> //falta validacion de lo ultimo
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
        color: '#FFA400',
        padding: 10,
        marginVertical: 10,
        borderRadius:"4px"
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