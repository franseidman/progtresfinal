import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Post extends Component {
    constructor(props){
        super(props);
        this.state = {
            likes: 0,
            liked: false
        }
    }

    /*componentDidMount(){
        if this.props.item.data.likes si hay actualizar estado 
    }*/

    render(){
        
    console.log(this.props.item);
        return(
            <View>
                <Text>{this.props.item.data.description}</Text>
                <Text>{this.props.item.data.createdAt}</Text>
                <Text>{this.props.item.data.owner}</Text>
                <Text></Text>
            <TouchableOpacity> funcion likear (si no esta likeado pushea al array de likes utilizando el metodo de firebase, si esta likeado borra el like)</TouchableOpacity>
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    image: {
        height: 200,
    
    }
})