import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import history from '../history';
import Swal from 'sweetalert2';
import appServices from '../services/app-services';
import emailjs from 'emailjs-com';

class ReplacePasswordComponent extends Component {

    showLoading = (text) => {
        Swal.fire({
            title: 'Aguarde !',
            html: text,// add html attribute if you want or remove
            allowOutsideClick: false,
            allowEscapeKey: false,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
            },
        });
    }

    showAlertErrorReplace = (err) => {
        Swal.fire({
                    icon: 'error',
					title: 'Erro no envio de email de recuperação',
                    html: err.response.data.message,
						})	
    }
    showAlertEmailSend = () => {
        Swal.fire({
            icon: 'success',
            title: 'Nova senha enviada ao email de cadastro do usuário!',
            confirmButtonText: 'Ok',
						}).then((result) =>{
                            if (result.isConfirmed) {
                                history.push("/");
                            }
                        })		
    }

    constructor(props) {
        super(props)

        this.state = {
                usuario: '',
                dadosUser:{}

        }
        this.changeUserHandler = this.changeUserHandler.bind(this);
    }

    changeUserHandler= (event) => {
        this.setState({usuario: event.target.value});
    }

    componentDidMount(){
    }

    toLogin = () =>{
        history.push("/");
    }

    sendEmail = () =>{
        const dadosUser = this.state.dadosUser;
        const randomPassword = Math.random().toString(36).substr(2, 8);
        dadosUser.senha = randomPassword;
        const templateParams = {
            nome: dadosUser.nome,
            email: dadosUser.email,
            senha: randomPassword
        }
        console.log(dadosUser)
        appServices.updateUser(dadosUser, dadosUser.id).then().catch((err) =>{
            this.showAlertErrorReplace(err);
            return;
        });
        emailjs.send(
            process.env.REACT_APP_SERVICE_ID, 
            process.env.REACT_APP_TEMPLATE_ID, 
            templateParams, 
            process.env.REACT_APP_USER_ID
           )
           .then((result) => {
               console.log(result.text);
             }, (error) => {
           console.log(error.text);
           });

           return true;
    }

    recuperar = () =>{
        this.showLoading('Enviando senha para o email cadastrado');
        let user = this.state.usuario;
        appServices.getUser(user).then((res)=>{
            this.setState({dadosUser: res.data}, () =>{
                let confirmEmailAndPersist = this.sendEmail();
                if(confirmEmailAndPersist){
                    this.showAlertEmailSend();
                }else{
                    this.showAlertErrorReplace();
                }
            })
        }).catch((err) =>{
            this.showAlertErrorReplace(err);
            return;
        });
    }

    render() {
        return (
            <div className="page">
                <form method="POST" className="formLogin">
                    <h1>Recuperar senha</h1>
                    <p>Digite os dados necessários para recuperação</p>
                    <label htmlFor="usuario">Usuario</label>
                    <input type="text" id="usuario" placeholder="Digite seu usuario" value={this.state.usuario} onChange={this.changeUserHandler} />
                    <Button onClick={this.recuperar} className="btn">Recuperar</Button>
                   <Button onClick={this.toLogin} className="btn btn-secondary ml-2">Voltar</Button>
                </form>
            </div>
        )
    }
}

export default ReplacePasswordComponent;