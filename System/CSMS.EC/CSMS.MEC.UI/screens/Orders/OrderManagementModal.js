import React from 'react';
import { View, StyleSheet, Modal, Text, Alert } from 'react-native';
import { AntDesign } from "react-native-vector-icons";
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';

import Toast from '../../components/Toast';
import Loader from '../../components/Loader';
import PendingOrderTab from './tabs/PendingOrderTab';
import CookingOrderTab from './tabs/CookingOrderTab';
import ShippingOrderTab from './tabs/ShippingOrderTab';
import CompletedOrderTab from './tabs/CompletedOrderTab';
import CanceledOrderTab from './tabs/CanceledOrderTab';
import OrderDetailModal from './OrderDetailModal';
import CartModal from '../Cart/CartModal';
import { orderService } from '../../services';
import { cartActions, productActions } from '../../redux/actions';

class OrderManagementModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            loading: false,
            listPendingStatus: null,
            listShippingStatus: null,
            listCookingStatus: null,
            listCompletedStatus: null,
            listCanceledStatus: null
        }
    }

    componentDidMount() {
        this.props.onRef(this);
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    openModal = async (userId, page = null) => {
        this.setState({
            modalVisible: true,
            loading: true
        });

        const response = await orderService.getListOrderByUserId(userId);
        if (response.status === 200) {
            this.setState({
                listPendingStatus: response.data.filter(order => !order.canceledTime && !order.cookedTime),
                listCookingStatus: response.data.filter(order => !order.canceledTime && order.cookedTime && !order.shippedTime),
                listShippingStatus: response.data.filter(order => !order.canceledTime && order.shippedTime && !order.completedTime),
                listCompletedStatus: response.data.filter(order => order.completedTime),
                listCanceledStatus: response.data.filter(order => order.canceledTime),
            });
            if (page) {
                this.tabView.goToPage(page);
            }
            this.setState({ loading: false });
        } else {
            this.setState({ loading: false });
            this.refs.toast.show('Error! Please check your internet connection.', 2000);
        }
    }

    closeModal() {
        this.setState({ modalVisible: false });
    }

    onCancelOrder(orderId) {
        Alert.alert(
            'Are you sure want to cancel this order?',
            null,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => this.cancelOrder(orderId)
                }

            ],
            { cancelable: false },
        );
    }

    cancelOrder = async (orderId) => {
        this.setState({ loading: true });
        const response = await orderService.cancelOrder(orderId);

        if (response.status === 200) {
            const order = this.state.listPendingStatus.find(ord => ord.id === orderId);
            order.canceledTime = response.data.canceledTime;

            const listPending = this.state.listPendingStatus.filter(ord => ord.id !== orderId);
            const listCanceled = this.state.listCanceledStatus.unshift(order);

            this.setState({
                listPendingStatus: listPending,
                listCompletedStatus: listCanceled,
                loading: false
            });
        } else {
            this.refs.toast.show('Error! Please check your internet connection.', 2000);
            this.setState({ loading: false });
        }
    }

    onReorder = async (order) => {
        this.setState({ loading: true });

        if (!this.props.stateGetProducts.products || this.props.stateGetProducts.products?.length === 0) {
            await this.props.getProducts();
            if (!this.props.stateGetProducts.isSuccess) {
                this.refs.toast.show('Error! Please check your internet connection.', 2000);
                this.setState({ loading: false });
            }
        }      
        
        order.products.forEach(proOrder => {
            for (const product of this.props.stateGetProducts.products) {
                if (proOrder.id === product.id) {
                    this.props.addToCart(product, proOrder.quantity);
                }
            }
        });

        this.setState({ loading: false });
        this.cartModal.toggleModal();
    }

    reorder(order) {
        
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}
                style={styles.container}>

                <View style={styles.header}>
                    <AntDesign
                        style={styles.back}
                        name="close"
                        color='#fff'
                        size={25}
                        onPress={() => this.closeModal()}
                    />
                    <View style={styles.section}>
                        <Text style={styles.title}>My Purchases</Text>
                    </View>
                </View>

                {this.state.loading && <Loader />}

                {this.state.listCanceledStatus &&
                    <ScrollableTabView
                        tabBarActiveTextColor='#157cdb'
                        initialPage={0}
                        renderTabBar={() =>
                            <DefaultTabBar
                                tabStyle={{ paddingBottom: 5 }}
                                textStyle={{ fontSize: 12 }}
                                underlineStyle={{ backgroundColor: '#157cdb' }}
                            />
                        }
                        ref={(tabView) => { this.tabView = tabView }}
                    >
                        <PendingOrderTab
                            tabLabel='Pending'
                            orders={this.state.listPendingStatus}
                            viewOrder={(orderId) => this.orderDetailModal.openModal(orderId)}
                            onCancelOrder={(orderId) => this.onCancelOrder(orderId)}
                        />
                        <CookingOrderTab
                            tabLabel='Cooking'
                            orders={this.state.listCookingStatus}
                            viewOrder={(orderId) => this.orderDetailModal.openModal(orderId)}
                        />
                        <ShippingOrderTab
                            tabLabel='Shipping'
                            orders={this.state.listShippingStatus}
                            viewOrder={(orderId) => this.orderDetailModal.openModal(orderId)}
                        />
                        <CompletedOrderTab
                            tabLabel='Completed'
                            orders={this.state.listCompletedStatus}
                            viewOrder={(orderId) => this.orderDetailModal.openModal(orderId)}
                            onReorder={(order) => this.onReorder(order)}
                        />
                        <CanceledOrderTab
                            tabLabel='Canceled'
                            orders={this.state.listCanceledStatus}
                            viewOrder={(orderId) => this.orderDetailModal.openModal(orderId)}
                            onReorder={(order) => this.onReorder(order)}
                        />
                    </ScrollableTabView>
                }

                <Toast
                    ref="toast"
                    style={{ backgroundColor: '#ff424e' }}
                    fadeOutDuration={1000}
                    opacity={0.9}
                    textStyle={{ color: '#fff' }}
                />

                <OrderDetailModal
                    onRef={ref => (this.orderDetailModal = ref)}
                    openCart={() => this.cartModal.toggleModal()}
                />

                <CartModal
                    onRef={ref => (this.cartModal = ref)}
                />
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    stateGetProducts: state.productReducer.getProducts
});

const mapDispatchToProps = dispatch => ({
    getProducts: () => dispatch(productActions.getProducts()),
    addToCart: (product, units) => dispatch(cartActions.addToCart(product, units))
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderManagementModal);


var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        backgroundColor: '#1ba8ff',
        height: Platform.OS === 'ios' ? 70 : 60,
        flexDirection: 'row',
        width: '100%'
    },
    back: {
        marginTop: Platform.OS === 'ios' ? 30 : 15,
        width: '15%',
        textAlign: 'center',
        zIndex: 2
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 25 : 10,
        width: '100%',
        height: 35,
        flex: 1,
        position: 'absolute'
    },
    title: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        flex: 1
    }
});