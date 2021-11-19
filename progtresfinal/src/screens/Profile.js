import React, { Component } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Post from '../components/Post';
import { auth, db } from '../firebase/config';

export default class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
            posts: []
        }
    }

    componentDidMount(){
        db.collection('posts').where("email","==", auth.currentUser.email).orderBy("createdAt", "desc").onSnapshot( //onSnapshot detecta cada cambio en nuestra coleccion de posteos y lo ejecuta (actualiza) nuevamente. Es un "observador de nuestra coleccion"
            docs => {
                let postsAux = [] //Variable auxiliar
                docs.forEach( doc => {
                    postsAux.push({
                        id: doc.id,
                        data: doc.data() //data extrae todos los datos de ese documento. por cada uno de los posteos
                    })
                })
                this.setState({
                    posts: postsAux
                })
            }
        )
    }

    delete(id){
        const posteoActualizar = db.collection('posts').doc(id)
        posteoActualizar.delete()
        posts = posts.filter(id) //filtramos por ID
    }

    render(){
        console.log(auth.currentUser.metadata)
        return(
            <View>
                <Text> Fecha: {auth.currentUser.metadata.lastSignInTime}</Text>
                <Text> Usuario: {auth.currentUser.displayName} </Text>
                <Text> Email: {auth.currentUser.email} </Text>
                <Text> Cantidad de posteos: {this.state.posts.length}</Text>
                
                <FlatList //usamos flatlist para dejar un posteo abajo del otro y poder scrollear. renderiza a medida que se scrollea. optimiza la app "lazy loader"
                data = {this.state.posts}
                keyExtractor = {post => post.id.toString()} //identificador unico.
                renderItem = { ({item}) => 
                <>
                    <Post item = {item}
                    delete ={(id)=>this.delete(id)}></Post>
                </>    
                }
                />

                <TouchableOpacity style = {styles.button} onPress={() => this.props.handleLogout()}>
                    <Text style = {styles.text}> Logout </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        width: '30%',
        backgroundColor: "#0F00FF",
    },
    text: {
        color: '#FFA400',
        fontSize: 20
    }
})