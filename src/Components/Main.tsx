import React, {Component} from 'react';
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import Preloader from "../common/Preloader";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import {withSuspense} from "../hoc/withSuspense";
import {AppStateType} from "../Redux/Store";
import Catalog from "./Catalog/Catalog";
import '../App.css';
import style from './Main.module.css';
import {getIsFetching, getTotalPrice, getTotalQuantity} from "../Redux/selectors";
import Order from "./Order/Order";
import Cart from "./Cart/Cart";
import StickyBar from "./StickyBar/StickyBar";
import {fetchLanguageData} from "../Redux/languageDataReducer";
import {fetchCatalog} from "../Redux/actions";

const About = React.lazy(() => import('./About/About'));

interface I_Props {

}

interface I_ConnectedProps {
    isFetching: boolean,
    totalQuantity: number,
    totalPrice: number,
    appError: string,
}

interface I_dispatchProps {
    fetchCatalog: () => void;
    fetchLanguageData: () => void;
}

type I_MainProps = I_Props & I_ConnectedProps & I_dispatchProps

class Main extends Component<I_MainProps> {

    componentDidMount() {
        this.props.fetchCatalog();
        this.props.fetchLanguageData();
    }
    timeout: number | undefined;

    componentDidUpdate(prevProps: Readonly<I_MainProps>, prevState: Readonly<{}>, snapshot?: any): void {
        //retrying connect to server
        if (this.props.appError) {
            this.timeout = window.setTimeout(() => {
                this.props.fetchCatalog()
            }, 20000)
        }
    }
    componentWillUnmount(): void {
        clearTimeout(this.timeout);
    }

    render() {
        const { totalQuantity, totalPrice } = this.props;
        return (
            <div>
                <Header totalQuantity={totalQuantity} totalPrice={totalPrice}/>
                <div className={style.mainWrapper}>
                    {this.props.isFetching ? <Preloader/> :
                        <main>
                            <StickyBar totalQuantity={totalQuantity} totalPrice={totalPrice}/>
                            <Switch>
                                <Route exact path="/"
                                       render={() => <Redirect to={"/catalog"}/>}/>
                                <Route path="/catalog" component={Catalog}/>
                                <Route path="/cart" component={Cart}/>
                                <Route path="/order">
                                    <Order/>
                                </Route>
                                <Route path="/about" render={withSuspense(About)}/>
                                <Route path="*" render={() => <div>Error 404</div>}/>
                            </Switch>
                        </main>
                    }
                </div>
                <Footer/>
            </div>
        );
    }
}

const mapStateToProps = (state: AppStateType): I_ConnectedProps => {
    return {
        isFetching: getIsFetching(state),
        totalQuantity: getTotalQuantity(state),
        totalPrice: getTotalPrice(state),
        appError: ''
    }
};

let ComposedComponent = connect(
    mapStateToProps, {fetchCatalog, fetchLanguageData}
)(Main);

export default withRouter(ComposedComponent);