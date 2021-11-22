import React, {Component} from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Image} from 'react-native';
import MyCamera from '../components/MyCamera';
import { auth, db } from '../firebase/config';

export default class CreatePost extends Component {
    constructor(props){
        super(props);
        this.state = {
            comment: "",
            photo: '',
            showCamera: true
        }
    }

    handlePost(){
        db.collection('posts').add({ //db es database. viene de la configuracion. agarramos la coleccion post y le agregamos un nuevo documento con estos datos. es una promesa
            owner: auth.currentUser.displayName, //displayName es para el username
            description: this.state.comment,
            email: auth.currentUser.email,
            createdAt: Date.now(), //lo devuelve en milisegundos desde el posteo hasta la actualidad
            likes: [],
            comments: [],
            photo: this.state.photo
        })
        .then(response => {
            console.log(response);
            alert("Posteo realizado!");
            this.setState({
                comment: "" //lo seteamos vacio pq sino queda con el texto que le habiamos ingresado antes
            })
            console.log(this.props);
            this.props.navigation.navigate('Home'); //queremos navegar en el home automaticamente
        })
        .catch(error => {
            console.log(error);
            alert("Hubo un error");
        })
    }

    guardarFoto(url){
        this.setState({
            photo: url,
            showCamera: false,
        })
    }
    
    render(){
        
        return(
            <>
            {this.state.showCamera ? 
            <MyCamera savePhoto = {(url)=>this.guardarFoto(url)}/>
            :
            <>
            <View style={styles.container}>
                <Image
                    source ={{uri: this.state.photo}}
                    style = {styles.imagen}
                />
                <TextInput
                    style={styles.field}
                    keyboardType='default'
                    placeholder="What are you thinking?"
                    multiline={true} // para poder hacer un comentario mas grande
                    numberOfLines = {4} 
                    onChangeText={text => this.setState({ comment: text })}
                    value = {this.state.comment} //para limpiar el comentario
                />
                <TouchableOpacity style = {styles.button} onPress={() => this.handlePost()}>
                    <Text style = {styles.text}> Post </Text>
                </TouchableOpacity>
            </View>
            </>
            }
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#FFFFD0",
    },
    field: {
        width: '60%',
        backgroundColor: "#F4F4F4",
        color: '#FFA400',
        padding: 10,
        marginVertical: 10,
        borderRadius:"10px",
    },
    button: {
        width: '10%',
        backgroundColor: "#F4F4F4",
        alignSelf:"center",
        borderRadius:"10px"
    },
    text: {
        color: '#FFA400',
        fontSize: 20,
        alignSelf:"center"
    },
    imagen: {
        height: 300,
        width: '30%'
    }
})