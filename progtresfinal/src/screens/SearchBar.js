import React, { Component } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Post from '../components/Post';
import { db } from '../firebase/config';

export default class SearchBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            posts:[],
            search:"",
        }
    }


    OnSearch(){
        this.setState({posts: []})
        db.collection('posts').orderBy("createdAt", "desc").where("owner","=git=",this.state.search).onSnapshot( //orderBy para ordenarlo de menor a mayor (lo mas nuevo al principio). onSnapshot detecta cada cambio en nuestra coleccion de posteos y lo ejecuta (actualiza) nuevamente. Es un "observador de nuestra coleccion"
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
        return(
            <View style={styles.view}>
                <TextInput
                    style={styles.field}
                    keyboardType='default'
                    placeholder="Buscar..."
                    onChangeText={text => this.setState({ search: text },this.OnSearch)}
                    value = {this.state.search} />
                <FlatList //usamos flatlist para dejar un posteo abajo del otro y poder scrollear. renderiza a medida que se scrollea. optimiza la app "lazy loader"
                style={styles.view}
                data = {this.state.posts}
                keyExtractor = {post => post.id.toString()} //identificador unico.
                renderItem = { ({item}) => {return <Post item = {item}></Post> } //Datos de los posteos. Los pasamos por props
                }
                /> 
            </View> //por cada posteo que encuentre devuelve un componente que se llame post que recibe las props de ese item
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    field: {
        width: '50%',
        backgroundColor: "#F4F4F4",
        color: '#FFA400',
        padding: 10,
        marginVertical: 10,
        alignSelf:"center"
    },
    button: {
        width: '30%',
        backgroundColor: "#0F00FF",
    },
    text: {
        color: '#FFA400',
        fontSize: 20
    },
    view:{
        backgroundColor: "#FFFFD0",
    }
})