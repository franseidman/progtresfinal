import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Modal } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { auth, db } from '../firebase/config';
import firebase from 'firebase';

export default class Post extends Component {
    constructor(props){
        super(props);
        this.state = {
            likes: 0,
            liked: false
        }
    }

    componentDidMount(){
            if (this.props.item){
                if(this.props.item.data.likes.length !== 0){
                this.setState({ 
                    likes: this.props.item.data.likes.length
                })
                if (this.props.item.data.likes.includes(auth.currentUser.email)){
                    this.setState({
                        liked: true
                    })
                }
            }
        }
    }

    // funcion likear (si no esta likeado pushea al array de likes utilizando el metodo de firebase)
    onLike(){ 
        const posteoActualizar = db.collection("posts").doc(this.props.item.id)
        posteoActualizar.update({ 
            likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email) //especie de pusheo al array de likes. pusheamos el username del usuario que le dio el like
        })
        .then(()=> {
            this.setState({
                liked: true,
                likes: this.state.likes + 1
            })
        })
    }

    onDisLike(){
        const posteoActualizar = db.collection("posts").doc(this.props.item.id)
        posteoActualizar.update({ 
            likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.displayName) 
        })
        .then(()=> {
            this.setState({
                liked: false,
                likes: this.state.likes - 1
            })
        })
    }

    render(){
        
        console.log(this.props.item);
        return(
            <View>
                <Text>{this.props.item.data.description}</Text>
                <Text>{this.props.item.data.createdAt}</Text>
                <Text>{this.props.item.data.owner}</Text>
                <Text>Likes: {this.state.likes}</Text>
                
                {
                    !this.state.liked ? // el ! es para decir si no esta likeado, podes likear y si esta likeado podes deslikear
                <TouchableOpacity onPress={() => this.onLike()}>  
                <Text>
                    Like
                </Text>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => this.onDisLike()}>  
                <Text>
                    Dislike
                </Text>
                </TouchableOpacity>
                }
                <Modal>

                </Modal>
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    image: {
        height: 200,
    
    }
})