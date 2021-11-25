import React, { Component } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Modal } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { auth, db } from '../firebase/config';
import firebase from 'firebase';
import { color } from 'react-native-reanimated';

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

        const posteoActualizar = db.collection("posts").doc(this.props.item.id)
        const comment={user: auth.currentUser.email, comment: this.state.comment, fecha: new Date().toLocaleString()}
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

    
    onLike(){ 
        const posteoActualizar = db.collection("posts").doc(this.props.item.id)
        posteoActualizar.update({ 
            likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email) 
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
        
        console.log("ola", this.props.item);
    
        return(
            
            <View style={styles.view}>
                <Image  
                style={styles.preview}
                source={{uri: this.props.item.data.photo}}
                />
                <Text style={styles.datosowner}>by: {this.props.item.data.owner}</Text>
                <Text style={styles.likes}>{this.state.likes} likes</Text>
                <Text style={styles.datos}>{this.props.item.data.owner}:"{this.props.item.data.description}"</Text>
                {
                    !this.state.liked ? 
                <TouchableOpacity onPress={() => this.onLike()}>  
                <Text style={styles.like}>
                    I like this post
                </Text>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => this.onDisLike()}>  
                <Text style={styles.dislike}>
                    I dont't like it anymore
                </Text>
                </TouchableOpacity>
                }
                <Text style={styles.ago}>{Math.ceil(((Date.now() - this.props.item.data.createdAt)/1000/3600)-1)} hours ago</Text>
                <TouchableOpacity style={styles.comments} onPress={()=>{this.showModal()}}>
                    <Text style={styles.color}>
                        See comments
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
                                
                                <Text style={styles.comentarios}>{this.hayComentario()} comments</Text>
                                <FlatList 
                                style={styles.comm}
                                data={this.props.item.data.comments}
                                keyExtractor = {(comment, id) => id.toString()} 
                                renderItem = { ({item}) => <Text>"{item.comment}" by {item.user} {item.fecha}</Text> } 
                                /> 
                                
                                <TextInput
                                style={styles.field}
                                keyboardType='default'
                                placeholder=" Comentar..."
                                multiline={true} 
                                numberOfLines = {4}
                                onChangeText={text => this.setState({ comment: text })}
                                value = {this.state.comment} 
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
    field:{
        marginTop: "15px",
        width:"90%",
        alignSelf:"center",
        backgroundColor:"#D1D1D1",
        borderRadius:"5px",
    },
    button:{
        marginTop: "5px",
        width:"40%",
        alignSelf:"center",
        backgroundColor:"#D1D1D1",
        borderRadius:"5px",
        marginBottom:"4px"
    },
    text:{
        alignSelf:"center"
    },
    view:{
        width:"390px",
        alignSelf:"center",
        marginTop:"20px",
        backgroundColor:"#e9eeee",
        borderRadius:"2px"
    },
    container:{
        flex: 1,
        justifyContent: 'center',
        padding: 5,
    },
    
    closeModal:{
        alignSelf: 'flex-end',
        padding:"6px",
        height:"20px",
        width:"20px",
        marginTop:"10px",
        backgroundColor: '#FF8686',
        marginRight:"10px",
        borderRadius: 100,
    },

    modalText:{
        fontWeight: 'bold',
        color:'#fff',
        alignSelf:"center",
        marginTop:"-6px"
    },
    modalView:{
        backgroundColor: "#F4F4F4",
        width:"370px",
        borderRadius: 10,
    },
    modal: {
        border: 'none',
        alignSelf:"center",
        marginBottom:"10px"
    },
    color: {
        color: "blue",
        marginBottom:"5px"
    },
    preview: {
        width:"370px",
        height:"370px",
        alignSelf:"center",
        marginTop:"10px"
    },
    like:{
        fontSize:"14px",
        color:"#35E900",
        marginLeft:"10px"
    },
    dislike:{
        fontSize:"14px",
        color:"#999999",
        marginLeft:"10px"
    },
    likes:{
        fontSize:"14px",
        marginLeft:"10px"
    },
    datos:{
        fontSize:"17px",
        marginLeft:"10px"
    },
    datosowner:{
        fontSize:"13px",
        alignSelf:"center"
    },
    ago:{
        fontSize:"13px",
        alignSelf:"flex-end",
        marginRight:"10px"
    },
    comentarios:{
        alignSelf:"center",
        marginBottom:"4px"
    },
    comments:{
        alignSelf:"center"
    },
    comm:{
        marginLeft:"5px"
    }
})