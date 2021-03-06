import React, {useState} from 'react';
import {I_orderItem, I_productItem} from "../types/types";
import style from './PopupWrapper.module.css';
import {Button, Modal} from "antd";
import {LazyLoadImage} from "react-lazy-load-image-component";

interface I_Props {
    product: I_productItem
    setPopupClose: () => void
}

export const ProductsModal = ({product, setPopupClose}: I_Props) => {

    let [imageLoaded, setImageLoaded] = useState(false);
    const handleImageLoaded = () => {
        setImageLoaded(true);
    };

    return (
        <Modal
            title={product.name}
            visible={true}
            onOk={setPopupClose}
            onCancel={setPopupClose}
            footer={[]}
        >
            <div className={style.mainImg}>
                <LazyLoadImage
                    alt={product.name}
                    src={product.photo} // use normal <img> attributes as props
                    effect="blur"
                    placeholder={<span>afterLoad</span>}
                    placeholderSrc={product.photo_thumbnail}
                    wrapperClassName={style.mainImg}
                />
            </div>
            <div className={style.row}>
                <h5>{product.name}</h5>
            </div>
            <hr/>
            <div className={style.row}>
                <span>{product.text_short}</span>
            </div>
            <hr/>
            <div className={style.row}>
                <article>{product.text_long}</article>
            </div>
        </Modal>
    )
};

interface I_orderModal {
    handleOk: void
    handleCancel: void,
    loading: boolean,
    title: string,
    order: Array<I_orderItem>
}
export const OrderModal = ({handleOk, handleCancel, loading, title, order}:any) => {

    let [visible, setVisible] = useState(false);
    const handleImageLoaded = () => {
        setVisible(true);
    };

    return (
        <Modal
            visible={true}
            title="Title"
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Return
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                    Submit
                </Button>,
            ]}
        >
            {order.map( (oi:I_orderItem) => <p key={oi.id}><span>oi.name</span><strong>io.quantity</strong></p>)}
        </Modal>
    )
};
