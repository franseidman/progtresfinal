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
        db.collection('posts').where("email","==", auth.currentUser.email).orderBy("createdAt", "desc").onSnapshot( 
            docs => {
                let postsAux = [] 
                docs.forEach( doc => {
                    postsAux.push({
                        id: doc.id,
                        data: doc.data() 
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
                
                <FlatList 
                data = {this.state.posts}
                keyExtractor = {post => post.id.toString()} 
                renderItem = { ({item}) => 
                <>
                    <Post item = {item}></Post>
                {
                    <TouchableOpacity style={styles.borrar} onPress={() => this.delete(item.id)}>
                        <Text style={styles.borrar2}>
                            Delete post
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
    borrar:{
        width:"9%",
        backgroundColor:"#FF5656",
        alignSelf:"center",
        marginTop:"10px",
        borderRadius:"4px",
        marginBottom:"30px"
    },
    borrar2:{
        alignSelf:"center",
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