import React, { Component } from 'react'
import Swal from 'sweetalert2';
import useAuth from '../context/useAuth';
import history from '../history';
import BackService from '../services/app-services'
import Button from 'react-bootstrap/Button';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

class LoginComponent extends Component {
    showAlertUserEmpty = () => {
        Swal.fire({
                    icon: 'warning',
					title: 'Usuário e senha devem ser preenchidos',
						})	
    }
    showAlertErrorLogin = (err) => {
        Swal.fire({
                    icon: 'error',
					title: 'Erro no login',
                    html: err.response.data.message,
						})	
    }
    showAlertUserAuthenticated = () => {
        Toast.fire({
            icon: 'success',
            title: 'Acesso permitido',
						})	
    }
    constructor(props) {
        super(props)

        this.state = {
                usuario: '',
                senha:''
        }
        this.changeUserHandler = this.changeUserHandler.bind(this);
        this.changePasswordHandler = this.changePasswordHandler.bind(this);
    }

    changeUserHandler= (event) => {
        this.setState({usuario: event.target.value});
    }

    changePasswordHandler= (event) => {
        this.setState({senha: event.target.value});
    }

    loginExecute = (e) => {
        e.preventDefault();
        const user = {
            'usuario': this.state.usuario,
            'senha': this.state.senha
        }
        if(!user.usuario || user.usuario === '' || !user.senha || user.senha === ''){
            this.showAlertUserEmpty();
            return
        }
        let validation;

        BackService.loginUser(user).then((res) =>{
            validation = res.data;
            useAuth.handleLogin(validation);
            history.push('/index');
            this.showAlertUserAuthenticated();
        }).catch((err) =>{
            this.showAlertErrorLogin(err);
            return;
        });
    }


    render() {

        return (
            <div className="page">
                <form method="POST" className="formLogin">
                    <h1>Login</h1>
                    <p>Digite os seus dados de acesso no campo abaixo.</p>
                    <label htmlFor="usuario">Usuario</label>
                    <input type="text" id="usuario" placeholder="Digite seu usuario" value={this.state.usuario} onChange={this.changeUserHandler} />
                    <label htmlFor="password">Senha</label>
                    <input type="password" id="senha" value={this.state.senha} onChange={this.changePasswordHandler} placeholder="Digite sua senha" />
                    {/* <a href="/">Esqueci minha senha</a> */}
                    <Button onClick={this.loginExecute} className="btn">Acessar</Button>
                    <Button onClick={this.loginExecute} className="btn btn-secondary ml-2">Registrar Usuário</Button>
                </form>
            </div>
        )

    }

}

export default LoginComponent;