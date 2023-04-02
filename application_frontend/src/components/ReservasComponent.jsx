import React, { Component } from 'react'
import AppServices from '../services/app-services'
import Cookies from 'js-cookie';
import { decodeToken } from 'react-jwt';
import Swal from 'sweetalert2';

class ReservasComponent extends Component {

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

    showAlertReservaRegister = () => {
        Swal.fire({
                    icon: 'success',
					title: 'Reserva cadastrada com sucesso!',
                    showConfirmButton: false,
                    timerProgressBar: true,
                    timer: 3000 
						})	
                        return;
    }
    
    constructor(props){
        super(props)
        this.state= {
            dataInicio: '',
            dataFim: '',
            select1: '',
            baias:[]
        }
        this.changeDataInicioHandler = this.changeDataInicioHandler.bind(this);
        this.changeDataFimHandler = this.changeDataFimHandler.bind(this);
        this.changeSelect1Handler = this.changeSelect1Handler.bind(this);
    }

    changeDataInicioHandler= (event) => {
        this.setState({dataInicio: event.target.value});
    }

    changeDataFimHandler= (event) => {
        this.setState({dataFim: event.target.value});
    }


    changeSelect1Handler= (event) => {
        this.setState({select1: event.target.value});
    }

    handleClearFields = () => {
        this.setState({
          dataInicio: "",
          dataFim: "",
          select1: ""
        });
      }

    componentDidMount(){
        AppServices.listBaia().then((res) =>{
            this.setState({ baias: res.data });
        }).catch(error => {
            console.log(error);
          });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const token = Cookies.get('token');
        const myDecodedToken = decodeToken(token);
        const reserva = {
            'periodo_inicio': this.state.dataInicio,
            'periodo_fim': this.state.dataFim,
            'id_usuario_reserva': myDecodedToken.user.id,
            'id_baia_reserva' : this.state.select1
        }
        this.showLoading('Registrando reserva!');
        AppServices.saveReserva(reserva).then((res) =>{
            if(res.statusText === "Created"){
                Swal.close();
                this.showAlertReservaRegister();
                this.handleClearFields();
                return;
            }
            console.log(res);
        }).catch(error => {
            console.log(error);
          });
      };

      buscarBaiasDisponiveis = () =>{
        this.showLoading('Buscando mesas disponíveis');
        AppServices.

        console.log(this.state)

      }


    render() {
        const minHora = '07:00';
        const maxHora = '19:00';

        const minData = new Date().toISOString().slice(0, 10);
        const minDateTime = `${minData}T${minHora}`;

        const maxData = '';
        const maxDateTime = `${maxData}T${maxHora}`;
        return (
            <div className='parent'>
                <div className='formReserva'>
                <form>
                    <div>
                    <label htmlFor="data">Inicio da Reserva:</label>
                        <input
                            type="datetime-local"
                            name="dataInicio"
                            value={this.state.dataInicio}
                            onChange={this.changeDataInicioHandler}
                            min={minDateTime}
                            max={maxDateTime}
                        />
                        <label htmlFor="data">Fim da Reserva:</label>
                        <input
                            type="datetime-local"
                            name="dataFim"
                            value={this.state.dataFim}
                            onChange={this.changeDataFimHandler}
                            min={minDateTime}
                            max={maxDateTime}
                        />
                        <button type="button" className="btn btn-primary mr-2" onClick={this.buscarBaiasDisponiveis}>Buscar</button>
                        <button type="button" className="btn btn-secondary ml-2" onClick={this.handleClearFields}>Limpar</button>
                    </div>
                </form>
                </div>
            </div>
        )
    }
}

export default ReservasComponent;