import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import { auth } from '../firebase/config';
import CreatePost from './CreatePost';
import Profile from './Profile';
import SearchBar from './SearchBar';

export default class Menu extends Component{
    constructor(props){
        super(props);
        this.state = {
            loggedIn: false,
            error: null,
        }
    }
    //metodo para que recuerde al usuario cada vez que se recarga la pagina
    componentDidMount(){
        //Recordar la sesión iniciada
        auth.onAuthStateChanged( user => {
            if (user) {
                this.setState({
                    loggedIn: true
                })
            }
        })
    }
    
    
    handleLogin(email, password){
        auth.signInWithEmailAndPassword(email, password) //usamos el metodo de auth
        .then( response => { //esto es una promesa. necesita el .then y el .catch
            console.log(response);
            alert("Usuario loggeado!");
            this.setState({
                loggedIn: true
            })
        })
        .catch( response => {
            console.log(response);
            alert("Error en el loggeo");
            this.setState({
                error: "Error en loggeo"
            })
        })
    }
    
    handleRegister(email, password, username) {
        //alert(`REGISTRO: usuario: ${this.state.email}, password: ${this.state.password}`)
        auth.createUserWithEmailAndPassword(email, password)
        .then( response => {
            console.log(response);
            alert("Usuario registrado!");
            response.user.updateProfile({ //con update profile le agregamos un username al displayname, una propiedad propia de user de firebase
                displayName: username //username que recibe por parametro desde el componente register
            })
            this.setState({
                loggedIn: true //creamos el usuario, queda la sesion iniciada
            })
        })
        .catch( error => {
            console.log(error);
            alert("Error en el registro");
            this.setState({
                error: "Fallo en el registro"
            })
        })
    }

    handleLogout(){
        auth.signOut()
        .then(()=> {
            this.setState({
                loggedIn: false
            })
        })
        .catch(error => {
            console.log(error);
        })
    }

    render(){
        const Drawer = createDrawerNavigator();
    
        return(
            <NavigationContainer>
                    <Drawer.Navigator initialRouteName="Login">
                        {this.state.loggedIn === true ? //preguntamos si estamos logeados
                        <>
                            <Drawer.Screen name = "Home">
                                {props => <Home {...props} handleLogout={()=>this.handleLogout()}/>}
                            </Drawer.Screen>
                            <Drawer.Screen name = "CreatePost">
                                {props => <CreatePost {...props}/>}
                            </Drawer.Screen>
                            <Drawer.Screen name = "Profile">
                                {props => <Profile {...props} handleLogout={()=>this.handleLogout()}/>}
                            </Drawer.Screen>
                            <Drawer.Screen name = "SearchBar">
                                {props => <SearchBar {...props}/>}
                            </Drawer.Screen>
                        </>
                        :
                        <>
                            <Drawer.Screen name="Login">
                                {props => <Login {...props} handleLogin={(email, password)=>this.handleLogin(email, password)}/>}
                            </Drawer.Screen>
                            <Drawer.Screen name = "Registro">
                                {props => <Register {...props} handleRegister={(email, password, username)=>this.handleRegister(email, password, username)} 
                                error={this.state.error}/>}
                            </Drawer.Screen> 
                        </> //register recibe una serie de propiedades. {...props} sirve para pasar navigation y route. handleRegister es la prop que se va a llamar dentro de register. Le estamos pasamos la funcion. Repetimos los parametros porque sino la funcion no recibe los parametros.
                    }
                    </Drawer.Navigator>
                </NavigationContainer>
            )
        }
}