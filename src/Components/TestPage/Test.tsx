import React, {Component, useRef, useState} from 'react';
import slide from "./../../assets/images/slide1.png"
import Preloader from "../../common/Preloader";
import {fetchOrders} from "../../Redux/productsReducer";
import {connect} from "react-redux";
import {compose} from "redux";
import style from './Test.module.css';
import {AppStateType} from "../../Redux/Store";
import axios from "axios";
import {IFilterItem, IProductItem} from "../../types/types";

interface IProps {
    filters: Array<IFilterItem>,
    pizzas: Array<IProductItem>
}
interface IState {
    imageLoaded: boolean
    pizzas: any
}

const PizzaForm:any = ({onSubmit}:any) => {
    const userNameRef = useRef(null);
    let [image, setImage] = useState(null);
    // @ts-ignore
    const addNewPizza = async (obj) => {
        let formData = new FormData();
        // @ts-ignore
        formData.append('image', image);
        formData.append("name", obj.name);
        await axios.get("http://127.0.0.1:8000/", {withCredentials: true});
        await axios.post("http://127.0.0.1:8000/pizzas", formData, {
            withCredentials: true,
            headers: {
                'Content-type': 'multipart/form-data'
            }
        });
    };
    const createPizza = () => {
        // @ts-ignore
        let obj = {name: userNameRef.current.value};
        addNewPizza(obj);
    };
    let mainPhotoSelected = (e:any) => {
        if (e.target.files.length) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <div>
            <div>
                <input onChange={mainPhotoSelected} type={"file"}/>
                <input ref={userNameRef}/>
                <button onClick={createPizza}>newUser</button>
            </div>
        </div>
    )
};

const UserForm:any = ({onSubmit}:any) => {
    const phoneRef = useRef(null);
    const passwordRef = useRef(null);

    const logIn = async (obj:any) => {
        debugger
        await axios.post("http://127.0.0.1:8000/users/login", obj, {
            withCredentials: true,
        });
    };
    const createPizza = () => {
        // @ts-ignore
        let obj = {phone: phoneRef.current.value, password: passwordRef.current.value};
        logIn(obj);
    };

    return (
        <div>
            <div>
                <input ref={phoneRef}/>
                <input ref={passwordRef}/>
                <button onClick={createPizza}>newUser</button>
            </div>
        </div>
    )
};

class Test extends Component<IProps> {
    state:any = {
        imageLoaded: false,
        pizzas: [{id: 'asd', name: 'ssww'}],
    };

    fetchPizzas = async() => {

        let asd = await axios.get("http://localhost:8000/pizzas", {withCredentials: true});
        this.setState({pizzas: asd.data.pizzas});
    };

    onSubmit = (formData:any) => {
        axios.post("http://127.0.0.1:8000/pizzas", {formData});
    };
    onUserSubmit = (formData:any) => {
        axios.post("http://127.0.0.1:8000/pizzas", {formData});
    };

    handleImageLoaded() {
        this.setState({imageLoaded: true});
    }
    deletePizza = (id:number) => {
        axios.delete(`http://127.0.0.1:8000/pizzas/${id}`);
    };
    render() {
        let pizzas = this.state.pizzas;
        let displayPizzas = pizzas.map((p:any) =>
            <div key={p.id}>
                {p.name}
                <button onClick={() => {
                    this.deletePizza(p.id)
                }}>X
                </button>
            </div>
        );
        return (
            <div className={style.aboutWrapper}>
                <div>
                    {!this.state.imageLoaded && <Preloader/>}
                    <img src={slide} onLoad={this.handleImageLoaded.bind(this)} alt={"Pechorin Bulki"}/>
                </div>

                <div>
                    <PizzaForm onSubmit={this.onSubmit}/>
                </div>
                <div>
                    <UserForm onSubmit={this.onUserSubmit}/>
                </div>
                <button onClick={this.fetchPizzas}>fetch-pizzas</button>
                {displayPizzas}
            </div>
        );
    }
}

const mapStateToProps = (state:AppStateType) => {
    return {
        filters: state.reducer.filters,
        pizzas: state.reducer.products
    }
};

export default compose(connect(mapStateToProps, {fetchOrders}))(Test);