import React, { Component } from 'react'
import AppServices from '../services/app-services'
import Cookies from 'js-cookie';
import { decodeToken } from 'react-jwt';

class ReservasComponent extends Component {
    constructor(props){
        super(props)
        this.state= {
            dataInicio: '',
            dataFim: '',
            select1: '',
            select2: '',
            baias:[]
        }
        this.changeDataInicioHandler = this.changeDataInicioHandler.bind(this);
        this.changeDataFimHandler = this.changeDataFimHandler.bind(this);
        this.changeSelect1Handler = this.changeSelect1Handler.bind(this);
        this.changeSelect2Handler = this.changeSelect2Handler.bind(this);
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

    changeSelect2Handler= (event) => {
        this.setState({select2: event.target.value});
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
        
        AppServices.saveReserva(reserva).then((res) =>{
            console.log(res);
        }).catch(error => {
            console.log(error);
          });
      };


    render() {
        const planta = require('../assets/img/planta.jpg');
        return (
            <div className='parent'>
                <div className='formReserva'>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                    <label htmlFor="select1">Estação de trabalho:</label>
                        <select name="select1" value={this.state.select1} onChange={this.changeSelect1Handler}>
                            <option value="">Selecione uma opção</option>
                            {this.state.baias.map(baias => (
                                <option key={baias.id} value={baias.id}>{baias.nome}</option>
                            ))}
                        </select>
                        <br />
                    </div>
                    <div className="form-group">
                    <label htmlFor="data">Inicio da Reserva:</label>
                        <input
                            type="datetime-local"
                            name="dataInicio"
                            value={this.state.dataInicio}
                            onChange={this.changeDataInicioHandler}
                        />
                        <label htmlFor="data">Fim da Reserva:</label>
                        <input
                            type="datetime-local"
                            name="dataFim"
                            value={this.state.dataFim}
                            onChange={this.changeDataFimHandler}
                        />
                        <br />
                    </div>
                    <div className='container'>
                        <button type="submit" className="btn btn-primary mr-2">Salvar</button>
                        <button type="button" className="btn btn-secondary ml-2" onClick={this.handleClearFields}>Limpar</button>
                    </div>
                </form>
                </div>
                <div className='imgPlanta'>
                    <img src={planta} alt='planta'/>
                </div>
            </div>
        )
    }
}

export default ReservasComponent;