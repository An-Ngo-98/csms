import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Dimensions } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from "react-native-vector-icons";

import EmptyContent from '../../components/EmptyContent';
import { cartActions, productActions, userActions } from '../../redux/actions';
import { connect } from 'react-redux';
import DetailModal from '../DetailProduct/DetailModal';
import { ButtonGroup, Button } from 'react-native-elements';
import { getApiUrl } from '../../configs/api.config';
import { ApiController } from '../../commons/constants';
import { Switch, TextInput, ScrollView } from 'react-native-gesture-handler';
import VoucherModal from './modals/voucher/VoucherModal';
import OrderModal from './modals/orders/OrderModal';
import AuthModal from '../Auth/AuthModal';
import OrderDetailModal from '../Orders/OrderDetailModal';

class CartModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            useCoin: false,
            heightFooter: 0,
            coins: null,
            modalVisible: false,
            voucherSelected: null
        }
    }

    componentDidMount() {
        this.props.onRef(this);
        const { activeUser, coins } = this.props;

        if (activeUser && !coins) {
            this.props.getCoins(activeUser.id);
        }
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    toggleModal() {
        // this.orderDetailModal.openModal('200504110904U116');
        this.setState({ modalVisible: !this.state.modalVisible });
    }

    _getPhotoUrl(avatarId) {
        return (
            getApiUrl(ApiController.CdnApi.ProductPhoto) + avatarId + "/300");
    }

    _formatCurrency(price) {
        if (!price) {
            return "N/A";
        }

        return (
            price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " ₫"
        );
    }

    _getTotal() {
        let total = this.state.useCoin ? -this.props.coins : 0;
        for (const item of this.props.cartReducer) {
            total += item.price * item.units;
        }

        return total > 0 ? total : 0;
    }

    _calculateCoins() {
        let total = 0;
        for (const item of this.props.cartReducer) {
            total += item.price * item.units;
        }

        return Math.floor(total * 0.001) + ' coins';
    }

    _renderEmpty() {
        return (
            <View style={{ backgroundColor: 'white', height: '100%' }}>
                <EmptyContent
                    content='product'
                    closeModal={() => this.toggleModal()}
                    navigation={this.props.navigation}
                />
            </View>
        );
    }

    _renderItem = (item) => {
        return (
            <View key={item.id} style={styles.productItem}>
                <TouchableOpacity
                    style={styles.imageRegion}
                    onPress={() => this.detailModal.openModal(item)}
                >
                    <Image
                        source={{ uri: this._getPhotoUrl(item.avatarId) }}
                        style={styles.productImage}
                    />
                </TouchableOpacity>
                <View style={styles.textRegion}>
                    <View style={styles.close}>
                        <AntDesign
                            name="close"
                            color="gray"
                            size={18}
                            onPress={() => this.onDeleteProduct(item)}
                        />
                    </View>

                    <Text style={styles.name}
                        onPress={() => this.detailModal.openModal(item)}
                    >
                        {item.name}
                    </Text>
                    <Text style={styles.price}
                        onPress={() => this.detailModal.openModal(item)}
                    >
                        {this._formatCurrency(item.price)}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                        <ButtonGroup
                            onPress={(selectedIndex) => this.onUpdateUnits(item, selectedIndex)}
                            selectedIndex={1}
                            buttons={['-', item.units, '+']}
                            containerStyle={{ width: 120, height: 26, marginTop: 10 }}
                        />
                    </View>

                    <Text style={styles.textBuyLater} onPress={() => this.onBuyLater(item)}>Buy later</Text>
                </View>

                <DetailModal
                    navigation={this.props.navigation}
                    onRef={ref => (this.detailModal = ref)}
                />
            </View>
        );
    }

    onUpdateUnits = (product, selectedIndex) => {
        if ((selectedIndex === 0 && product.units > 1) || selectedIndex === 2) {
            this.props.addToCart(Object.assign({}, product), selectedIndex - 1);
        }
    }

    onDeleteProduct = (product) => {
        this.props.deleteProductInCart(product);
    }

    onBuyLater = (product) => {
        this.props.addBuyLateProduct(product);
        this.props.deleteProductInCart(product);
    }

    onOpenVoucherModal() {
        if (this.props.activeUser) {
            this.voucherModal.openModal(this.props.activeUser.id, this.state.voucherSelected);
        } else {
            this.authModal.toggleModal();
        }
    }

    onOpenOrderModal() {
        if (this.props.activeUser) {
            this.orderModal.openModal(this.state.voucherSelected, this.props.coins, this.state.useCoin);;
        } else {
            this.authModal.toggleModal();
        }
    }

    onOpenOrderDetail(orderId, order) {
        this.toggleModal();
        this.orderDetailModal.openModal(orderId, order);
    }

    onLayout = event => {
        if (this.state.dimensions) {
            return;
        }
        let { height } = event.nativeEvent.layout;
        this.setState({ heightFooter: height });
    }

    render() {
        return (
            <View>
                <Modal
                    animationType={"fade"}
                    transparent={false}
                    visible={this.state.modalVisible}
                    style={styles.container}
                >
                    <View style={styles.header}>
                        <AntDesign
                            style={styles.back}
                            name="close"
                            color='#fff'
                            size={25}
                            onPress={() => this.toggleModal()}
                        />
                        <View style={styles.section}>
                            <Text style={styles.title}>Cart</Text>
                        </View>
                    </View>

                    {this.props.cartReducer.length === 0 && this._renderEmpty()}

                    <ScrollView showsVerticalScrollIndicator={true} style={{ marginBottom: this.state.heightFooter, backgroundColor: '#f2f2f2' }}>

                        {this.props.cartReducer.map((item) => this._renderItem(item))}

                        <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#fff' }}>
                            <MaterialCommunityIcons
                                name="fire-truck"
                                color="#1ba8ff"
                                size={30}
                                style={{ marginTop: 5 }}
                            />
                            <Text style={{ marginLeft: 10, flexShrink: 1, lineHeight: 25 }}>
                                Free shipping for order from 300.000đ - maximum discount of 30.000đ
                        </Text>
                        </View>
                    </ScrollView>
                    {this.props.cartReducer.length !== 0 &&
                        <View style={styles.view_footer} onLayout={this.onLayout}>
                            <View style={{ flexDirection: 'row', borderTopColor: '#d4d4d4', borderTopWidth: 0.5, paddingVertical: 10 }}>
                                <MaterialCommunityIcons
                                    name="ticket-percent"
                                    color="#f0ad16"
                                    size={28}
                                />
                                <Text style={{ marginLeft: 10, marginTop: 5 }}>Voucher</Text>
                                <TouchableOpacity style={{ position: 'absolute', flexDirection: 'row', paddingVertical: 10, right: 0 }}
                                    onPress={() => this.onOpenVoucherModal()}
                                >
                                    {!this.state.voucherSelected &&
                                        <TextInput
                                            value='Select vouchers / discounts'
                                            style={styles.input}
                                            pointerEvents='none'
                                            editable={false}
                                        />
                                    }
                                    {this.state.voucherSelected &&
                                        <Text style={{ color: "#1ba8ff", marginRight: 10, marginTop: 5 }}>
                                            {this.state.voucherSelected.eventTypeCode}
                                        </Text>
                                    }
                                    <MaterialCommunityIcons
                                        name="chevron-right"
                                        color="gray"
                                        size={28}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopColor: '#d4d4d4', borderTopWidth: 0.5, paddingVertical: 10 }}>
                                <MaterialCommunityIcons
                                    name="coin"
                                    color="#f0ad16"
                                    size={28}
                                />
                                <Text style={{ marginLeft: 10, marginTop: 5 }}>
                                    {this.props.coins > 0 ?
                                        'Redeem ' + this.props.coins + ' Panda Coins'
                                        : `You don't have Panda Coins`
                                    }
                                </Text>
                                {this.props.coins > 0 &&
                                    <View style={{ position: 'absolute', flexDirection: 'row', paddingVertical: 10, right: 0 }}>
                                        <Text
                                            style={{
                                                textAlign: 'right',
                                                marginHorizontal: 15,
                                                color: this.state.useCoin ? '#ff424e' : 'gray',
                                                paddingVertical: 5
                                            }}
                                        >{'[ -' + this._formatCurrency(this.props.coins) + ' ]'}</Text>
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
                            <View style={{ flexDirection: 'row', borderTopColor: '#d4d4d4', borderTopWidth: 0.5, paddingVertical: 10 }}>
                                <View style={{ width: dimensions.width * 0.5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 18, marginRight: 10 }}>Total: </Text>
                                        <Text style={{ fontSize: 18, color: '#ff424e', fontWeight: 'bold' }}>{this._formatCurrency(this._getTotal())}</Text>
                                    </View>
                                    <Text style={{ fontSize: 12, color: '#f0ad16' }}>{'You will get ' + this._calculateCoins()}</Text>
                                </View>
                                <Button
                                    buttonStyle={styles.btn_add}
                                    title='Check out'
                                    onPress={() => this.onOpenOrderModal()}
                                />
                            </View>
                        </View>
                    }

                    <VoucherModal
                        onRef={ref => (this.voucherModal = ref)}
                        onChange={(voucher) => this.setState({ voucherSelected: voucher })}
                    />

                    <OrderModal
                        onRef={ref => (this.orderModal = ref)}
                        openModalDetail={(orderId, order) => this.onOpenOrderDetail(orderId, order)}
                    />

                    <AuthModal
                        navigation={this.props.navigation}
                        onRef={ref => (this.authModal = ref)}
                    />
                </Modal>

                <OrderDetailModal
                    onRef={ref => (this.orderDetailModal = ref)}
                    openCart={() => this.toggleModal()}
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    cartReducer: state.cartReducer,
    activeUser: state.userReducer.getUser.userDetails,
    coins: state.userReducer.getCoins.coins
});

const mapDispatchToProps = dispatch => ({
    addToCart: (product, units) => dispatch(cartActions.addToCart(product, units)),
    deleteProductInCart: (product) => dispatch(cartActions.deleteProductInCart(product)),
    addBuyLateProduct: (product) => dispatch(productActions.addBuyLateProduct(product)),
    getCoins: (userId) => dispatch(userActions.getCoins(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CartModal);

const dimensions = Dimensions.get('window');
var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        backgroundColor: '#1ba8ff',
        height: Platform.OS === 'ios' ? 75 : 60,
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
        borderWidth: 0.5,
        borderColor: "#d4d4d4",
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#fff'
    },
    textRegion: {
        paddingTop: 5,
        paddingBottom: 15,
        paddingLeft: 15,
        width: '70%',
        justifyContent: "flex-start",
        alignItems: "flex-start"
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
    close: {
        position: "absolute",
        right: 0,
        marginTop: 8,
        marginRight: 12
    },
    textBuyLater: {
        color: '#1ba8ff',
        position: 'absolute',
        right: 10,
        bottom: 18
    },
    view_footer: {
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 12
    },
    btn_add: {
        backgroundColor: '#ff424e',
        width: dimensions.width * 0.45
    },
    input: {
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 2,
        backgroundColor: '#f0f0f0',
        color: '#a6a6a6'
    }
});