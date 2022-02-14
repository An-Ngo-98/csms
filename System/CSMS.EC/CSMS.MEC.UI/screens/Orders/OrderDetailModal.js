import React from 'react';
import { View, StyleSheet, ScrollView, Modal, Text, Image, Alert, RefreshControl } from 'react-native';
import { AntDesign, EvilIcons, MaterialCommunityIcons } from "react-native-vector-icons";
import { Button } from 'react-native-elements';
import io from 'socket.io-client';

import { orderService, productService } from '../../services';
import Toast from '../../components/Toast';
import Loader from '../../components/Loader';
import { getApiUrl } from '../../configs/api.config';
import { ApiController, DateFormat } from '../../commons/constants';
import { formatDate } from '../../commons/helpers/moment.helper';
import { productActions, cartActions } from '../../redux/actions';
import { connect } from 'react-redux';
import AddEditReviewModal from '../Review/AddEditReviewModal';
import ViewRatingModal from '../Review/ViewRatingModal';

class OrderDetailModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            loading: false,
            refreshing: false,
            order: null,
            ratings: [],
            address: {}
        }
    }

    componentDidMount() {
        this.props.onRef(this);
        this.socket = io('http://52.74.41.113:4444');
        this.socket.emit('getOrder', 'order');
        this.socket.on('document', data => {            
            if(data.orderUserId === this.props.activeUser.id && data.orderId === this.state.order?.id) {
                this.onLoadOrder(this.state.order.id, false);
            } 
       });
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    openModal(orderId, order = null) {
        this.setState({
            modalVisible: true,
            loading: order ? false : true,
            order: order ? order : null
        });

        if (!order) {
            this.onLoadOrder(orderId);
        }
    }

    onLoadOrder = async (orderId = null, showLoading = true) => {
        this.setState({ refreshing: showLoading });

        orderId = orderId != null ? orderId : this.state.order.id;
        const [resOrder, resRating] = await Promise.all([
            orderService.getOrderById(orderId),
            productService.getUserReviewsByOrderId(this.props.activeUser.id, orderId)
        ]);

        if (resOrder.status === 200 && resRating.status === 200) {
            this.setState({
                order: resOrder.data,
                ratings: resRating.data,
                loading: false,
                refreshing: false
            });
        } else {
            this.refs.toast.show('Error! Please check your internet connection.', 2000);
            this.setState({ loading: false, refreshing: false });
        }
    }

    closeModal() {
        this.setState({ modalVisible: false });
    }

    _formatCurrency(price) {
        if (!price && price !== 0) {
            return "N/A";
        }

        return (
            price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " ₫"
        );
    }

    _formatDateTime(datetime) {
        if (!datetime) {
            return 'N/A';
        }

        return formatDate(datetime, DateFormat.DateTimeFormatYYYYMMDD);
    }

    showReorder() {
        if (this.state.order?.completedTime || this.state.order?.canceledTime) {
            return true;
        }
    }

    showCancel() {
        if (!this.state.order?.canceledTime && !this.state.order?.cookedTime) {
            return true;
        }

        return false;
    }

    _getPhotoUrl(photoId) {
        return (
            getApiUrl(ApiController.CdnApi.ProductPhoto) + photoId + "/300");
    }

    _getFullName() {
        let fullName = this.props.activeUser.firstName
            + ' ' + this.props.activeUser.middleName
            + ' ' + this.props.activeUser.lastName;
        return fullName.trim().replace('  ', ' ');
    }

    _renderItem = (item, index, rating) => {
        return (
            <View key={index} style={styles.productItem}>
                <View style={styles.imageRegion}>
                    <Image
                        source={{ uri: this._getPhotoUrl(item.photoId) }}
                        style={styles.productImage}
                    />
                </View>
                <View style={styles.textRegion}>
                    <Text style={styles.name}>
                        {item.productName}
                    </Text>
                    <Text style={styles.price}>
                        {this._formatCurrency(item.price)}
                    </Text>
                    <Text style={{ fontSize: 15, color: 'gray', marginHorizontal: 5, marginTop: 5 }}>
                        {'Amount: ' + item.quantity}
                    </Text>

                    {this.state.order.completedTime &&
                        <Button
                            icon={<AntDesign
                                name="staro"
                                size={16}
                                color="#1ba8ff"
                                style={{ paddingRight: 10 }}
                            />}
                            type="outline"
                            title={rating ? 'view rated' : 'rating'}
                            containerStyle={{ position: 'absolute', right: 10, bottom: 0 }}
                            buttonStyle={{ paddingVertical: 3 }}
                            onPress={() =>
                                rating
                                    ? this.viewReviewModal.openModal(rating)
                                    : this.addReviewModal.openModal(item.productId, this.props.activeUser.id, this._getFullName(), 0, this.state.order.id)
                            }
                        />
                    }
                </View>
            </View>
        );
    }

    onCancelOrder() {
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
                    onPress: () => this.cancelOrder()
                }

            ],
            { cancelable: false },
        );
    }

    cancelOrder = async () => {
        const response = await orderService.cancelOrder(this.state.order.id);
        if (response.status === 200) {
            this.setState({
                order: response.data,
                loading: false
            });
            this.socket.emit('addOrder', {
                id: 'order',
                doc: 'There are canceled order',
                type: 'New Order',
                storeID: this.state.order.storeId,
                orderId: this.state.order.id,
                orderUserId: this.state.order.userId
            });
        } else {
            this.refs.toast.show('Error! Please check your internet connection.', 2000);
            this.setState({ loading: false });
        }
    }

    onReorder = async () => {
        this.setState({ loading: true });
        if (!this.props.stateGetProducts.products || this.props.stateGetProducts.products?.length === 0) {
            await this.props.getProducts();
            if (!this.props.stateGetProducts.isSuccess) {
                this.refs.toast.show('Error! Please check your internet connection.', 2000);
                this.setState({ loading: false });
            }
        }

        this.state.order.orderDetails.forEach(proOrder => {
            for (const product of this.props.stateGetProducts.products) {
                if (proOrder.productId === product.id) {
                    this.props.addToCart(product, proOrder.quantity);
                }
            }
        });

        this.props.openCart();
        this.closeModal();
    }

    render() {
        return (
            <Modal
                animationType={"fade"}
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
                        <Text style={styles.title}>Order details</Text>
                    </View>
                </View>

                {this.state.loading && <Loader />}

                {this.state.order &&
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{
                            flex: 1, backgroundColor: '#f2f2f2',
                            marginBottom: this.showCancel() || this.showReorder() ? 60 : 0
                        }}
                        refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onLoadOrder.bind()} />
                        }
                    >
                        <View style={{ backgroundColor: '#fff', flexDirection: 'row', padding: 10, width: '100%', justifyContent: "center", alignItems: "center" }}>
                            <View style={[styles.viewStatus, { width: !this.state.order.canceledTime ? '25%' : '20%' }]}>
                                <MaterialCommunityIcons
                                    name="progress-upload"
                                    color='#1ba8ff'
                                    size={35}
                                />
                                <Text style={{ paddingTop: 5 }}>Pending</Text>
                            </View>
                            {this.state.order.canceledTime &&
                                <View style={styles.viewStatus}>
                                    <MaterialCommunityIcons
                                        name="close-outline"
                                        color='#e80e0e'
                                        size={35}
                                    />
                                    <Text style={{ paddingTop: 5 }}>Canceled</Text>
                                </View>
                            }
                            <View style={[styles.viewStatus, { width: !this.state.order.canceledTime ? '25%' : '20%' }]}>
                                <MaterialCommunityIcons
                                    name="chef-hat"
                                    color={this.state.order.cookedTime ? '#1ba8ff' : '#bdbdbd'}
                                    size={35}
                                />
                                <Text style={{ paddingTop: 5 }}>Cooking</Text>
                            </View>
                            <View style={[styles.viewStatus, { width: !this.state.order.canceledTime ? '25%' : '20%' }]}>
                                <MaterialCommunityIcons
                                    name="truck-fast"
                                    color={this.state.order.shippedTime ? '#1ba8ff' : '#bdbdbd'}
                                    size={35}
                                />
                                <Text style={{ paddingTop: 5 }}>Shipping</Text>
                            </View>
                            <View style={[styles.viewStatus, { width: !this.state.order.canceledTime ? '25%' : '20%' }]}>
                                <MaterialCommunityIcons
                                    name="check-decagram"
                                    color={this.state.order.completedTime ? '#1ba8ff' : '#bdbdbd'}
                                    size={35}
                                />
                                <Text style={{ paddingTop: 5 }}>Completed</Text>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            paddingVertical: 7,
                            paddingHorizontal: 10,
                            borderTopColor: '#d4d4d4',
                            borderTopWidth: 0.5,
                            backgroundColor: '#fff',
                            marginBottom: 10
                        }}>
                            <Text style={{ paddingVertical: 4, textAlign: 'center', width: '100%', color: '#1ba8ff' }}>
                                {'Swipe to refresh'}
                            </Text>
                        </View>

                        <View style={{ backgroundColor: '#fff', flexDirection: 'row', padding: 10, marginBottom: 10 }}>
                            <EvilIcons
                                name="location"
                                color='#1ba8ff'
                                size={25}
                                width={'10%'}
                            />
                            <View style={{ width: '90%', paddingLeft: 5 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                    {'Shipping address'}
                                </Text>
                                <View>
                                    <Text style={{ color: 'gray', marginTop: 6, paddingVertical: 2 }}>
                                        {this.state.order.receiver + ' | ' + this.state.order.phoneNumber}
                                    </Text>
                                    <Text style={{ color: 'gray', paddingVertical: 2 }}>
                                        {this.state.order.address}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ backgroundColor: '#fff', flexDirection: 'row', padding: 10 }}>
                            <MaterialCommunityIcons
                                name="fire-truck"
                                color="#1ba8ff"
                                size={25}
                                style={{ width: '10%' }}
                            />
                            <View style={{ width: '70%', paddingLeft: 0 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', paddingTop: 5 }}>
                                    Shipping information
                                </Text>
                                <Text style={{ color: 'gray', marginTop: 6, paddingVertical: 2 }}>
                                    {this.state.order.shippingService}
                                </Text>
                                <Text style={{ color: 'gray', paddingVertical: 2 }}>
                                    {'From ' + this.state.order.storeName + ' (' + this.state.order.distance + ' km)'}
                                </Text>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            paddingVertical: 7,
                            paddingHorizontal: 10,
                            borderTopColor: '#d4d4d4',
                            borderTopWidth: 0.5,
                            backgroundColor: '#fff',
                            marginBottom: 10
                        }}>
                            <Text style={{ paddingVertical: 4 }}>
                                {'Message: ' + (this.state.order.shippingNote !== null ? this.state.order.shippingNote : '')}
                            </Text>
                        </View>

                        <View style={{ backgroundColor: '#fff', flexDirection: 'row', padding: 10 }}>
                            <MaterialCommunityIcons
                                name="coin"
                                color="#e80e0e"
                                size={28}
                                style={{ width: '10%' }}
                            />
                            <View style={{ width: '40%', paddingLeft: 0 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', paddingTop: 5 }}>
                                    Payment method
                                </Text>
                            </View>
                            <View style={{ width: '50%', paddingTop: 5 }}>
                                <Text style={{ textAlign: 'right', fontSize: 15 }}>
                                    {'Cash on delivery'}
                                </Text>
                            </View>
                        </View>
                        <View style={{
                            paddingVertical: 7,
                            paddingHorizontal: 10,
                            borderTopColor: '#d4d4d4',
                            borderTopWidth: 0.5,
                            backgroundColor: '#fff',
                            marginBottom: 10
                        }}>
                            <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                <Text style={{ width: '60%', paddingRight: 10 }}>Merchandise subtotal:</Text>
                                <Text style={{ width: '40%', textAlign: 'right' }}>
                                    {this._formatCurrency(this.state.order.merchandiseSubtotal)}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                <Text style={{ width: '60%', paddingRight: 10 }}>Shipping fee:</Text>
                                <Text style={{ width: '40%', textAlign: 'right' }}>
                                    {this._formatCurrency(this.state.order.shippingFee)}
                                </Text>
                            </View>
                            {this.state.order.discountShippingFee ?
                                <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                    <Text style={{ width: '60%', paddingRight: 10 }}>Discount shipping fee:</Text>
                                    <Text style={{ width: '40%', textAlign: 'right' }}>
                                        {'- ' + this._formatCurrency(this.state.order.discountShippingFee)}
                                    </Text>
                                </View>
                                : null
                            }
                            {this.state.order.discountVoucherApplied ?
                                <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                    <Text style={{ width: '60%', paddingRight: 10 }}>Voucher applied:</Text>
                                    <Text style={{ width: '40%', textAlign: 'right' }}>
                                        {'- ' + this._formatCurrency(this.state.order.discountVoucherApplied)}
                                    </Text>
                                </View>
                                : null
                            }
                            {this.state.order.usedCoins ?
                                <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                    <Text style={{ width: '60%', paddingRight: 10 }}>Panda coins used:</Text>
                                    <Text style={{ width: '40%', textAlign: 'right' }}>
                                        {'- ' + this._formatCurrency(this.state.order.usedCoins)}
                                    </Text>
                                </View>
                                : null
                            }
                            <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                <Text style={{ width: '60%', paddingRight: 10, fontSize: 16 }}>Order total:</Text>
                                <Text style={{ width: '40%', textAlign: 'right', fontSize: 16, color: '#e80e0e' }}>
                                    {this._formatCurrency(this.state.order.total)}
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', paddingVertical: 10, backgroundColor: '#fff', paddingHorizontal: 10, marginBottom: 10 }}>
                            <MaterialCommunityIcons
                                name="coin"
                                color="#f0ad16"
                                size={28}
                            />
                            <Text style={{ marginLeft: 10, marginTop: 5 }}>
                                {'Panda coins ' + (this.state.order.completedTime ? 'earned' : 'will earn')}
                            </Text>
                            <View style={{ position: 'absolute', paddingVertical: 10, right: 0 }}>
                                <Text
                                    style={{
                                        textAlign: 'right',
                                        marginHorizontal: 15,
                                        color: '#f0ad16',
                                        paddingVertical: 5
                                    }}
                                >
                                    {this.state.order.earnedCoins + (this.state.order.earnedCoins < 2 ? ' coin' : ' coins')}
                                </Text>
                            </View>
                        </View>

                        <View>
                            <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
                                <MaterialCommunityIcons
                                    name="food"
                                    color='#1ba8ff'
                                    size={25}
                                />
                                <Text style={{ fontSize: 16, fontWeight: 'bold', paddingLeft: 10, paddingTop: 5 }}>
                                    {'Order products'}
                                </Text>
                            </View>

                            {this.state.order.orderDetails.map((item, index) => {
                                const rating = this.state.ratings.find(rat => item.productId === rat.productId);
                                return this._renderItem(item, index, rating);
                            })}

                            <View style={{
                                flexDirection: 'row',
                                paddingVertical: 7,
                                paddingHorizontal: 10,
                                borderTopColor: '#d4d4d4',
                                borderTopWidth: 0.5,
                                backgroundColor: '#fff'
                            }}>
                                <Text style={{ paddingVertical: 4 }}>
                                    {'Message: ' + (this.state.order.noteToChef !== null ? this.state.order.noteToChef : '')}
                                </Text>
                            </View>
                        </View>
                        <View style={{
                            paddingTop: 7,
                            paddingBottom: 12,
                            paddingHorizontal: 10,
                            borderTopColor: '#d4d4d4',
                            borderTopWidth: 0.5,
                            backgroundColor: '#fff',
                            marginBottom: 10
                        }}>
                            <View style={{ flexDirection: 'row', paddingBottom: 5, paddingTop: 3 }}>
                                <Text style={{ width: '60%', paddingRight: 10 }}>Order ID:</Text>
                                <Text style={{ width: '40%', textAlign: 'right' }}>
                                    {this.state.order.id}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                <Text style={{ width: '60%', paddingRight: 10 }}>Order time</Text>
                                <Text style={{ width: '40%', textAlign: 'right' }}>
                                    {this._formatDateTime(this.state.order.orderedTime)}
                                </Text>
                            </View>
                            {this.state.order.completedTime &&
                                <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                    <Text style={{ width: '60%', paddingRight: 10 }}>Payment time:</Text>
                                    <Text style={{ width: '40%', textAlign: 'right' }}>
                                        {this._formatDateTime(this.state.order.completedTime)}
                                    </Text>
                                </View>
                            }
                            {this.state.order.cookedTime &&
                                <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                    <Text style={{ width: '60%', paddingRight: 10 }}>Cook time:</Text>
                                    <Text style={{ width: '40%', textAlign: 'right' }}>
                                        {this._formatDateTime(this.state.order.cookedTime)}
                                    </Text>
                                </View>
                            }
                            {this.state.order.shippedTime &&
                                <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                    <Text style={{ width: '60%', paddingRight: 10 }}>Ship time:</Text>
                                    <Text style={{ width: '40%', textAlign: 'right' }}>
                                        {this._formatDateTime(this.state.order.shippedTime)}
                                    </Text>
                                </View>
                            }
                            {this.state.order.completedTime &&
                                <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                    <Text style={{ width: '60%', paddingRight: 10 }}>Completed time:</Text>
                                    <Text style={{ width: '40%', textAlign: 'right' }}>
                                        {this._formatDateTime(this.state.order.completedTime)}
                                    </Text>
                                </View>
                            }
                            {this.state.order.canceledTime &&
                                <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                    <Text style={{ width: '60%', paddingRight: 10 }}>Canceled time:</Text>
                                    <Text style={{ width: '40%', textAlign: 'right' }}>
                                        {this._formatDateTime(this.state.order.canceledTime)}
                                    </Text>
                                </View>
                            }
                        </View>
                    </ScrollView>
                }

                {this.state.order && (this.showCancel() || this.showReorder()) &&
                    <View style={styles.btn_footer}>
                        {this.showCancel() &&
                            <Button
                                buttonStyle={styles.btn_add}
                                title='Cancel'
                                onPress={() => this.onCancelOrder()}
                            />
                        }
                        {this.showReorder() &&
                            <Button
                                buttonStyle={styles.btn_add}
                                title='Reorder'
                                onPress={() => this.onReorder()}
                            />
                        }
                    </View>
                }

                <AddEditReviewModal
                    onRef={ref => (this.addReviewModal = ref)}
                    callback={(rating) => {
                        let ratings = this.state.ratings;
                        ratings.push(rating);
                        this.setState({ ratings: ratings });
                    }}
                />

                <ViewRatingModal
                    onRef={ref => (this.viewReviewModal = ref)}
                />

                <Toast
                    ref="toast"
                    style={{ backgroundColor: '#ff424e' }}
                    fadeOutDuration={1000}
                    opacity={0.9}
                    textStyle={{ color: '#fff' }}
                />
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    stateGetProducts: state.productReducer.getProducts,
    activeUser: state.userReducer.getUser.userDetails
});

const mapDispatchToProps = dispatch => ({
    getProducts: () => dispatch(productActions.getProducts()),
    addToCart: (product, units) => dispatch(cartActions.addToCart(product, units))
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailModal);

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
    },
    btn_footer: {
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTopColor: '#d4d4d4',
        borderTopWidth: 0.5,
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    btn_add: {
        backgroundColor: '#ff424e'
    },
    viewStatus: {
        justifyContent: "center",
        alignItems: "center",
        width: '20%'
    },
    productItem: {
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingBottom: 10,
        backgroundColor: '#fff'
    },
    imageRegion: {
        height: 90,
        width: "30%",
        marginHorizontal: 5,
        marginTop: 5
    },
    productImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: "cover"
    },
    name: {
        fontSize: 18,
        fontWeight: "400",
        marginHorizontal: 5,
        color: "#141414"
    },
    price: {
        fontWeight: "600",
        fontSize: 16,
        color: "#e80e0e",
        marginHorizontal: 5,
        marginTop: 5
    },
    textRegion: {
        paddingTop: 5,
        paddingBottom: 15,
        paddingLeft: 15,
        width: '70%',
        justifyContent: "flex-start",
        alignItems: "flex-start"
    }
});