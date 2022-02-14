import React from 'react';
import { View, StyleSheet, Platform, Modal, Text, ScrollView, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
import { AntDesign, EvilIcons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { Switch } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import io from 'socket.io-client';

import Loader from '../../../../components/Loader';
import { userService, locationService, orderService } from '../../../../services';
import { getApiUrl } from '../../../../configs/api.config';
import { ApiController } from '../../../../commons/constants';
import VoucherModal from '../voucher/VoucherModal';
import { systemActions, cartActions, userActions } from '../../../../redux/actions';
import { locationHelper } from '../../../../commons/helpers/location.helper';
import UserAddressModal from '../../../UserAddress/UserAddressModal';
import Toast from '../../../../components/Toast';

class OrderModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            loading: true,
            user: this.props.user,
            address: {},
            coins: 0,
            earnCoins: 0,
            useCoin: false,
            voucher: null,
            delivery: SHIPPING_SERVICE,
            payment: 'Payment on delivery',
            paymentFee: 0,
            messageForDish: '',
            messageForDelivery: '',
            store: null,
            distance: Number.MAX_SAFE_INTEGER
        }
    }

    componentDidMount = async () => {
        this.props.onRef(this);

        if (this.props.stores.length === 0) {
            await this.props.getStores();
        }

        const response = await userService.getListAddress(this.state.user.id);
        if (response.status === 200) {
            this.socket = io('http://52.74.41.113:4444');
            const defaultAddress = response.data.find(item => item.isDefault === true)
            this.setState({
                address: defaultAddress,
                loading: false
            });

            if (this.props.stores.length > 0 && defaultAddress) {
                this.findStore(defaultAddress);
            }
        } else {
            this.setState({
                errorMessage: `Can't connect to server. Please check your internet`,
                loading: false
            })
        }
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    openModal(voucher, coins = 0, useCoin = false, earnCoins = 0) {
        this.setState({
            modalVisible: true,
            voucher: voucher,
            coins: coins,
            useCoin: useCoin,
            earnCoins: earnCoins
        });
    }

    closeModal() {
        this.setState({
            modalVisible: false
        });
    }

    findStore = async (defaultAddress) => {
        this.setState({ loading: true });
        const result = await locationService.getLocationByAddress(this.formatAddress(defaultAddress));
        if (result.status === 200 && result.data.status.code === 200) {
            const latAdd = result.data.results[0].geometry.lat;
            const lonAdd = result.data.results[0].geometry.lng;
            this.props.stores.forEach(item => {
                const distance = locationHelper.getDistanceFromLatLonInKm(item.latitude, item.longitude, latAdd, lonAdd);
                if (this.state.distance >= distance) {
                    this.setState({
                        store: item,
                        distance: distance,
                        loading: false
                    });
                }
            });
        }
    }

    formatAddress = (item) => {
        let address = item.ward + ', ' + item.district + ', ' + item.province;
        return item.detail ? item.detail + ', ' + address : address;
    }

    _getPhotoUrl(avatarId) {
        return (
            getApiUrl(ApiController.CdnApi.ProductPhoto) + avatarId + "/300");
    }

    _formatCurrency(price) {
        if (!price && price !== 0) {
            return "N/A";
        }

        return (
            price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " ₫"
        );
    }

    getTotalPriceProducts() {
        let total = 0;
        for (const item of this.props.products) {
            total += item.price * item.units;
        }

        return total;
    }

    getTotalProducts() {
        let total = 0;
        for (const item of this.props.products) {
            total += item.units;
        }

        return total + (total === 1 ? ' dish' : ' dishes');
    }

    getShippingFee() {
        if (this.getTotalPriceProducts() >= 300000) {
            return 0;
        }

        return SHIPPING_FEE;
    }

    getShippingDiscount() {
        if (this.state.voucher?.eventTypeCode === 'FREESHIP' && this.getTotalPriceProducts() < 300000) {
            return SHIPPING_FEE;
        }

        return 0;
    }

    getVoucherDiscount() {
        if (this.state.voucher && this.state.voucher.eventTypeCode !== 'FREESHIP') {
            let result = this.getTotalPriceProducts() / 100 * this.state.voucher.discountPercent;

            if (this.state.voucher.maxDiscount && result > this.state.voucher.maxDiscount) {
                result = this.state.voucher.maxDiscount;
            }

            return result;
        }

        return 0;
    }

    getCoinDiscount() {
        if (this.state.coins > 0 && this.state.useCoin) {
            return this.state.coins;
        }

        return 0;
    }

    getTotalInvoice() {
        const result = this.getTotalPriceProducts() + this.getShippingFee()
            - this.getShippingDiscount() - this.getVoucherDiscount() - this.getCoinDiscount();

        return result >= 0 ? Math.floor(result) : 0;
    }

    getEarnCoins() {
        return Math.floor(this.getTotalPriceProducts() * 0.001);
    }

    setAddress(address) {
        if (address) {
            this.setState({
                distance: Number.MAX_SAFE_INTEGER,
                store: null,
                address: address
            });

            this.findStore(address);
        }
    }

    _renderItem = (item) => {
        return (
            <View key={item.id} style={styles.productItem}>
                <View style={styles.imageRegion}>
                    <Image
                        source={{ uri: this._getPhotoUrl(item.avatarId) }}
                        style={styles.productImage}
                    />
                </View>
                <View style={styles.textRegion}>
                    <Text style={styles.name}>
                        {item.name}
                    </Text>
                    <Text style={styles.price}>
                        {this._formatCurrency(item.price)}
                    </Text>
                    <Text style={{ fontSize: 15, color: 'gray', marginHorizontal: 5, marginTop: 5 }}>
                        {'Amount: ' + item.units}
                    </Text>
                </View>
            </View>
        );
    }

    onOrder = async () => {

        if (!this.state.address) {
            this.refs.toast.show('Please choose your shipping address', 2000);
            return;
        }

        this.setState({ loading: true });

        const order = {
            userId: this.state.user.id,
            fullname: (this.state.user.firstName + ' ' + this.state.user.middleName + ' ' + this.state.user.lastName).replace('  ', ' '),
            receiver: this.state.address.receiver,
            phoneNumber: this.state.address.phoneNumber,
            address: this.formatAddress(this.state.address),
            noteToChef: this.state.messageForDish,
            merchandiseSubtotal: this.getTotalPriceProducts(),
            shippingFee: SHIPPING_FEE,
            shippingService: SHIPPING_SERVICE,
            storeId: this.state.store.id,
            storeCode: this.state.store.shortName,
            storeName: this.state.store.name,
            distance: this.state.distance.toFixed(1),
            shippingNote: this.state.messageForDelivery,
            voucherId: this.state.voucher?.id,
            voucherCode: this.state.voucher?.code,
            discountPercent: this.state.voucher?.discountPercent,
            usedCoins: this.state.useCoin ? this.state.coins : 0,
            discountShippingFee: SHIPPING_FEE - this.getShippingFee(),
            discountVoucherApplied: this.state.voucher?.eventTypeCode === 'FREESHIP' ? SHIPPING_FEE : this.getVoucherDiscount(),
            isFreeShipVoucher: this.state.voucher?.eventTypeCode === 'FREESHIP',
            total: this.getTotalInvoice(),
            earnedCoins: this.getEarnCoins(),
            orderDetails: this.props.products.map(prod => ({
                productId: prod.id,
                productName: prod.name,
                categoryId: prod.categoryId,
                categoryName: prod.categoryName,
                quantity: prod.units,
                price: prod.price,
                originalPrice: null,
                photoId: prod.avatarId
            }))
        }

        const response = await orderService.addNewOrder(order);
        if (response.status === 200) {
            if (this.state.useCoin) {
                this.props.clearCoins();
            }
            this.props.clearCart();
            this.closeModal();
            this.props.openModalDetail(response.data.id, response.data);
            this.socket.emit('addOrder', {
                id: 'order',
                doc: 'There are new order',
                type: 'New Order',
                storeID: order.storeId,
                orderId: order.id,
                orderUserId: order.userId
            });
        } else {
            this.setState({ loading: true });
            this.refs.toast.show('Error! Please check your internet connection.', 2000);
        }
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
                        <Text style={styles.title}>Order</Text>
                    </View>
                </View>

                {this.state.loading && <Loader />}

                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: '#f2f2f2', marginBottom: 60 }}>
                    <View style={{ backgroundColor: '#fff', flexDirection: 'row', padding: 10 }}>
                        <EvilIcons
                            name="location"
                            color='#1ba8ff'
                            size={25}
                        />
                        <View style={{ width: '86%', paddingLeft: 5 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                Shipping address
                                </Text>
                            {this.state.address?.id &&
                                <View>
                                    <Text style={{ color: 'gray', marginTop: 6, paddingVertical: 2 }}>
                                        {this.state.address.receiver + ' | ' + this.state.address.phoneNumber}
                                    </Text>
                                    <Text style={{ color: 'gray', paddingVertical: 2 }}>
                                        {this.formatAddress(this.state.address)}
                                    </Text>
                                </View>
                            }
                            {!this.state.address?.id &&
                                <Text style={{ color: 'red', marginTop: 6, paddingVertical: 2 }}>
                                    {'Please add your shipping address'}
                                </Text>
                            }
                        </View>
                        <View style={{ display: 'flex', justifyContent: 'center' }}>
                            <EvilIcons
                                name="chevron-right"
                                color='gray'
                                size={25}
                                onPress={() => this.addressModal.openModal(this.state.address, true)}
                            />
                        </View>
                    </View>
                    <View style={{ marginVertical: 10 }}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
                            <MaterialCommunityIcons
                                name="food"
                                color='#1ba8ff'
                                size={25}
                            />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', paddingLeft: 10, paddingTop: 5 }}>
                                Order products
                                </Text>
                        </View>

                        {this.props.products.map((item) => this._renderItem(item))}

                        <View style={{
                            flexDirection: 'row',
                            paddingVertical: 7,
                            paddingHorizontal: 10,
                            borderTopColor: '#d4d4d4',
                            borderTopWidth: 0.5,
                            backgroundColor: '#fff'
                        }}>
                            <Text style={{ width: '30%', paddingRight: 10, paddingVertical: 7 }}>Message:</Text>
                            <TextInput
                                placeholder="Note to chef..."
                                style={{ width: '70%' }}
                                textAlign='right'
                                value={this.state.messageForDish}
                                onChangeText={text => this.setState({ messageForDish: text })}
                            />
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            paddingVertical: 7,
                            paddingHorizontal: 10,
                            borderTopColor: '#d4d4d4',
                            borderTopWidth: 0.5,
                            backgroundColor: '#fff',
                            paddingVertical: 12
                        }}>
                            <Text style={{ width: '60%', paddingRight: 10 }}>Total ({this.getTotalProducts()}):</Text>
                            <Text style={{
                                width: '40%', paddingRight: 10, textAlign: 'right', fontWeight: "600",
                                fontSize: 16,
                                color: "#e80e0e",
                            }}>
                                {this._formatCurrency(this.getTotalPriceProducts())}
                            </Text>
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
                                Delivery
                                </Text>
                            <Text style={{ color: 'gray', marginTop: 6, paddingVertical: 2 }}>
                                {SHIPPING_SERVICE}
                            </Text>
                            {this.state.store &&
                                <Text style={{ color: 'gray', paddingVertical: 2 }}>
                                    {'From ' + this.state.store.name + ' (' + this.state.distance.toFixed(1) + ' km)'}
                                </Text>
                            }
                            <Text style={{ color: 'gray', paddingVertical: 2 }}>
                                {'Free shipping for order from 300.000đ'}
                            </Text>
                        </View>
                        <View style={{ width: '20%', paddingTop: 5 }}>
                            <Text style={{
                                textAlign: 'right', fontSize: 15,
                                textDecorationLine: this.state.voucher?.eventTypeCode === 'FREESHIP' || this.getTotalPriceProducts() >= 300000 ? 'line-through' : 'none'
                            }}>
                                {this._formatCurrency(SHIPPING_FEE)}
                            </Text>
                            {(this.state.voucher?.eventTypeCode === 'FREESHIP' || this.getTotalPriceProducts() >= 300000) &&
                                <Text style={{ textAlign: 'right', fontSize: 15 }}>{'0 ₫'}</Text>
                            }
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        paddingVertical: 7,
                        paddingHorizontal: 10,
                        borderTopColor: '#d4d4d4',
                        borderTopWidth: 0.5,
                        backgroundColor: '#fff'
                    }}>
                        <Text style={{ width: '30%', paddingRight: 10, paddingVertical: 7 }}>Message:</Text>
                        <TextInput
                            placeholder="Note to shipper..."
                            style={{ width: '70%' }}
                            textAlign='right'
                            value={this.state.messageForDelivery}
                            onChangeText={text => this.setState({ messageForDelivery: text })}
                        />
                    </View>
                    <View style={{ paddingHorizontal: 10, backgroundColor: '#fff', marginVertical: 10 }}>
                        <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                            <MaterialCommunityIcons
                                name="ticket-percent"
                                color="#f0ad16"
                                size={28}
                            />
                            <Text style={{ marginLeft: 10, marginTop: 5 }}>Voucher</Text>
                            <TouchableOpacity style={{ position: 'absolute', flexDirection: 'row', paddingVertical: 10, right: 0 }}
                                onPress={() => this.voucherModal.openModal(this.state.user.id, this.state.voucher)}
                            >
                                {!this.state.voucher &&
                                    <Text style={{ color: 'gray', paddingTop: 5 }}>Select or enter the code</Text>
                                }
                                {this.state.voucher &&
                                    <Text style={{ color: "#1ba8ff", marginRight: 10, marginTop: 5 }}>
                                        {this.state.voucher.eventTypeCode}
                                    </Text>
                                }
                                <MaterialCommunityIcons
                                    name="chevron-right"
                                    color="gray"
                                    size={28}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', paddingVertical: 10, borderTopColor: '#d4d4d4', borderTopWidth: 0.5 }}>
                            <MaterialCommunityIcons
                                name="coin"
                                color="#f0ad16"
                                size={28}
                            />
                            <Text style={{ marginLeft: 10, marginTop: 5 }}>
                                {this.state.coins > 0 ?
                                    'Use ' + this.state.coins + ' Panda Coins'
                                    : `You don't have Panda Coins`
                                }
                            </Text>
                            {this.state.coins > 0 &&
                                <View style={{ position: 'absolute', flexDirection: 'row', paddingVertical: 10, right: 0 }}>
                                    <Text
                                        style={{
                                            textAlign: 'right',
                                            marginHorizontal: 15,
                                            color: this.state.useCoin ? '#ff424e' : 'gray',
                                            paddingVertical: 5
                                        }}
                                    >{'[ -' + this._formatCurrency(this.state.coins) + ' ]'}</Text>
                                    <Switch
                                        trackColor={{ false: "#e9e9eb", true: "#33c558" }}
                                        thumbColor={"#fff"}
                                        ios_backgroundColor="#e9e9eb"
                                        onValueChange={() => this.setState({ useCoin: !this.state.useCoin })}
                                        value={this.state.useCoin}
                                    />
                                </View>
                            }
                        </View>
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
                                Payment
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
                            <Text style={{ width: '60%', paddingRight: 10 }}>Total product cost:</Text>
                            <Text style={{ width: '40%', textAlign: 'right' }}>
                                {this._formatCurrency(this.getTotalPriceProducts())}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                            <Text style={{ width: '60%', paddingRight: 10 }}>Shipping fee:</Text>
                            <Text style={{ width: '40%', textAlign: 'right' }}>
                                {this._formatCurrency(this.getShippingFee())}
                            </Text>
                        </View>
                        {this.state.voucher?.eventTypeCode === 'FREESHIP' &&
                            <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                <Text style={{ width: '60%', paddingRight: 10 }}>Discount shipping fee:</Text>
                                <Text style={{ width: '40%', textAlign: 'right' }}>
                                    {'- ' + this._formatCurrency(this.getShippingDiscount())}
                                </Text>
                            </View>
                        }
                        {this.state.voucher && this.state.voucher.eventTypeCode !== 'FREESHIP' &&
                            <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                <Text style={{ width: '60%', paddingRight: 10 }}>Used voucher:</Text>
                                <Text style={{ width: '40%', textAlign: 'right' }}>
                                    {'- ' + this._formatCurrency(this.getVoucherDiscount())}
                                </Text>
                            </View>
                        }
                        {this.state.useCoin &&
                            <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                <Text style={{ width: '60%', paddingRight: 10 }}>Used panda coins:</Text>
                                <Text style={{ width: '40%', textAlign: 'right' }}>
                                    {'- ' + this._formatCurrency(this.getCoinDiscount())}
                                </Text>
                            </View>
                        }
                        <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                            <Text style={{ width: '60%', paddingRight: 10, fontSize: 16 }}>Total invoice:</Text>
                            <Text style={{ width: '40%', textAlign: 'right', fontSize: 16, color: '#e80e0e' }}>
                                {this._formatCurrency(this.getTotalInvoice())}
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.view_footer}>
                    <View style={{ width: dimensions.width * 0.5 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 18, marginRight: 10 }}>Total: </Text>
                            <Text style={{ fontSize: 18, color: '#ff424e', fontWeight: 'bold' }}>{this._formatCurrency(this.getTotalInvoice())}</Text>
                        </View>
                        <Text style={{ fontSize: 12, color: '#f0ad16' }}>{'You will get ' + this.getEarnCoins() + ' coins'}</Text>
                    </View>
                    <Button
                        buttonStyle={styles.btn_add}
                        title='Order now'
                        onPress={() => this.onOrder()}
                    />
                </View>

                <VoucherModal
                    onRef={ref => (this.voucherModal = ref)}
                    onChange={(voucher) => this.setState({ voucher: voucher })}
                />

                <UserAddressModal
                    onRef={ref => (this.addressModal = ref)}
                    callback={(address) => this.setAddress(address)}
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
    products: state.cartReducer,
    user: state.userReducer.getUser.userDetails,
    stores: state.systemReducer.branchReducer
});

const mapDispatchToProps = dispatch => ({
    getStores: () => dispatch(systemActions.getBranchs()),
    clearCart: () => dispatch(cartActions.clearCart()),
    clearCoins: () => dispatch(userActions.clearCoins()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderModal);

const dimensions = Dimensions.get('window');
const SHIPPING_FEE = 15000;
const SHIPPING_SERVICE = 'Panda Express';
var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
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
        marginVertical: 5
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
    },
    view_footer: {
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 12,
        flexDirection: 'row',
        borderTopColor: '#d4d4d4',
        borderTopWidth: 0.5,
        paddingVertical: 10,
        marginTop: 0
    },
    btn_add: {
        backgroundColor: '#ff424e',
        width: dimensions.width * 0.45,
    }
});