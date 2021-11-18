import React, { Component } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Modal } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { auth, db } from '../firebase/config';
import firebase from 'firebase';

export default class Post extends Component {
    constructor(props){
        super(props);
        this.state = {
            likes: 0,
            liked: false,
            comments:[],
            comment:"",
        }
    }

    componentDidMount(){
            if (this.props.item){
                if(this.props.item.data.comments){
                    this.setState({
                        comments: this.props.item.data.comments
                    })
                }
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

    onComment(){
        const posteoActualizar = db.collection("posts").doc(this.props.item.id)// Esta línea se mantiene igual, no?
        const comment={user: auth.currentUser.email, comment: this.state.comment, fecha: Date.now()}
        console.log(comment)
        posteoActualizar.update({ 
            comments: firebase.firestore.FieldValue.arrayUnion(comment)
        })
        .then(()=> {
            this.setState({
                comment:""
            })
        })
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
    //Obtenemos el posteo, este se actualiza para luego sumar el like. ArrayUnion 
    //Commnets guardar obj. lit. (Mismo procedimiento)
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

    showModal(){
        console.log('Mostrando modal')
        this.setState({
            showModal: true,
        })
    }
    
    //Cierra el modal
    closeModal(){
        console.log('Cerrando modal')
        this.setState({
            showModal: false,
        })
    }

    
    hayComentario(){
        if(this.props.item.data.comments.length == 0){
            return "Aun no hay comentarios"
        } else {
            return this.props.item.data.comments.length
        } 
    }
            


    render(){
        
        console.log(this.props.item);
    
        return(
            //FlatList para hacer ver comments o no ver comments. Y hacer hace cuanto se subió.
            <View>
                <Image  
                style={styles.preview}
                source={{uri: this.props.item.data.photo}}
                />
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
                <TouchableOpacity onPress={()=>{this.showModal()}}>
                    <Text style={styles.color}>
                        Ver comentarios
                    </Text>
                </TouchableOpacity>
                {
                    this.state.showModal ?

                        <Modal 
                        animationType = "fade"
                        transparent = {false}
                        visible = {this.state.showModal}
                        style = {styles.modal}
                        >
                            <View style={styles.modalView}>
                                {/* Botón de cierre del modal */}
                                <TouchableOpacity style={styles.closeModal} onPress={()=>{this.closeModal()}}>
                                        <Text style={styles.modalText} >X</Text>
                                </TouchableOpacity>
                                <Text>
                                <Text>Cantidad de comentarios: {this.hayComentario()}</Text>
                                <FlatList 
                                data={this.props.item.data.comments}//recibe un array por props que es lo que va a recorrer
                                keyExtractor = {(comment, id) => id.toString()} // el primero es el elemento y el segundo es la posicion en el array (posicion ocupa)
                                renderItem = { ({item}) => <Text>{item.comment} {item.fecha} {item.user}</Text> } //renderizamos los comments
                                /> 
                                </Text>
                                <TextInput
                                style={styles.field}
                                keyboardType='default'
                                placeholder="Comentar..."
                                multiline={true} // para poder hacer un comentario mas grande
                                numberOfLines = {4}
                                onChangeText={text => this.setState({ comment: text })}//para ir actualizando el estado del comment
                                value = {this.state.comment} //para limpiar el comentario
                                />
                                <TouchableOpacity style = {styles.button} onPress={() => this.onComment()}>
                                    <Text style = {styles.text}> Comentar </Text>
                                </TouchableOpacity>
                            </View>

                        </Modal>
                        :
                        null
                }
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    image: {
        height: 200,
    
    },
    container:{
        flex: 1,
        justifyContent: 'center',
        padding: 5,
    },
    
    closeModal:{
        alignSelf: 'flex-end',
        padding: 10,
        backgroundColor: '#dc3545',
        marginTop:2,
        marginBotom: 10,
        borderRadius: 4,
    },

    modalText:{
        fontWeight: 'bold',
        color:'#fff',
    },
    modalView:{
        backgroundColor: 'green',
        borderRadius: 10,
    },
    modal: {
        border: 'none',
    },
    color: {
        color: "blue",
    },
    preview: {
        width: 90,
        height: 70
    },

})