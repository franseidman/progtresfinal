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
    }

    render(){
        console.log(auth.currentUser.metadata)
        return(
            <View style={styles.view}>
                <TouchableOpacity style = {styles.button} onPress={() => this.props.handleLogout()}>
                    <Text style = {styles.text}> Logout </Text>
                </TouchableOpacity>
                <Text style={styles.username}>{auth.currentUser.displayName} </Text>
                <Text style={styles.detail}> Since: {auth.currentUser.metadata.lastSignInTime}</Text>
                <Text style={styles.detail}>{auth.currentUser.email} </Text>
                <Text style={styles.detail}>{this.state.posts.length} posts</Text>
                
                <FlatList //usamos flatlist para dejar un posteo abajo del otro y poder scrollear. renderiza a medida que se scrollea. optimiza la app "lazy loader"
                data = {this.state.posts}
                keyExtractor = {post => post.id.toString()} //identificador unico.
                renderItem = { ({item}) => 
                <>
                    <Post item = {item}></Post>
                {
                    <TouchableOpacity onPress={() => this.delete(item.id)}>
                        <Text>
                            Borrar
                        </Text>
                    </TouchableOpacity>
                }
                </>    
                }
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        width: '30%',
        backgroundColor: "#0F00FF",
    },
    view:{
        backgroundColor: "#FFFFD0",
    },
    text: {
        color: '#FFA400',
        fontSize: 20
    },
    username:{
        fontSize:"80px",
        alignSelf:"center"
    },
    button: {
        alignSelf: "flex-end",
        width: '7%',
        backgroundColor: "#FFFFD0",
        marginRight: "30px",
        height: "40px",
        marginTop:"5px"
    },
    detail:{
        fontSize:"15px",
        alignSelf:"center"
    }
})