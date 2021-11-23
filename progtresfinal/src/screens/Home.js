import React, { Component } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Post from '../components/Post';
import { db } from '../firebase/config';


export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            posts: [],
        }
    }
    componentDidMount(){
        db.collection('posts').orderBy("createdAt", "desc").onSnapshot( //orderBy para ordenarlo de menor a mayor (lo mas nuevo al principio). onSnapshot detecta cada cambio en nuestra coleccion de posteos y lo ejecuta (actualiza) nuevamente. Es un "observador de nuestra coleccion"
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


    render(){
        console.log(this.state.posts);
        return(
            <View style = {styles.view}>
                <TouchableOpacity style = {styles.button} onPress={() => this.props.handleLogout()}>
                    <Text style = {styles.text}> Logout </Text>
                </TouchableOpacity>
                <Text style={styles.welcome}>Welcome, scroll down to see what people is posting about...</Text>
                <FlatList //usamos flatlist para dejar un posteo abajo del otro y poder scrollear. renderiza a medida que se scrollea. optimiza la app "lazy loader"
                style={styles.post}
                data = {this.state.posts}
                keyExtractor = {post => post.id.toString()} //identificador unico.
                renderItem = { ({item}) => {return <Post item = {item}></Post> } //Datos de los posteos. Los pasamos por props
                }
                />
                
                <Text style={styles.footer1}>Mateo Pautasso Cavanagh - Francisco Manuel Seidman - Lucas Ruiz Coines</Text> 
                <Text style={styles.footer2}>Copyright © 2021 SoundWaves⁺. All rights reserved.</Text>
                
            </View> //por cada posteo que encuentre devuelve un componente que se llame post que recibe las props de ese item
        )
    }
}


const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        alignItems: 'center'
    },
    view:{
        backgroundColor: "#FFFFD0",
    },
    field: {
        width: '80%',
        backgroundColor: "#09009B",
        color: '#FFA400',
        padding: 10,
        marginVertical: 10
    },
    button: {
        alignSelf: "flex-end",
        width: '7%',
        backgroundColor: "#FFFFD0",
        marginRight: "30px",
        height: "40px"
    },
    text: {
        color: '#FFA400',
        fontSize: 20,
        textAlign: "center",
        marginTop: "5px"
    },
    welcome:{
        alignSelf: "center",
        fontWeight: "100",
        fontSize: "30px"
    },
    post:{
        width:"100%",
    },
    footer1:{
        alignSelf: "center",
        marginTop: 100,
    },
    footer2:{
        alignSelf: "center",
        marginBottom: 30
    }
})