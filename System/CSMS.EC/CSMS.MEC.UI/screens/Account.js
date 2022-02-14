import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { ListItem, Button, Badge } from 'react-native-elements';
import { connect } from 'react-redux';
import { MaterialCommunityIcons } from "react-native-vector-icons";
import io from 'socket.io-client';

import CartIcon from '../components/CartIcon';
import { authActions, userActions } from '../redux/actions';
import { userAvatarUrl, ProductType } from '../commons/constants';
import { formatDate } from '../commons/helpers';
import AuthModal from './Auth/AuthModal';
import UserAddressModal from './UserAddress/UserAddressModal';
import VoucherModal from './Cart/modals/voucher/VoucherModal';
import OrderManagementModal from './Orders/OrderManagementModal';
import HistoryCoinModal from './UserActivities/CoinHistory/HistoryCoinModal';
import RatingManagementModal from './UserActivities/Rating/RatingManagementModal';
import { orderService } from '../services';

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            totalPending: 0,
            totalCooking: 0,
            totalShipping: 0,
            totalCompleted: 0
        };
    }

    componentDidMount() {
        const { authData, getUser: { userDetails }, coins } = this.props;
        if (authData.isLoggedIn && authData.token) {
            this.props.getInfoFromAccessToken(authData.token);
        }

        if (userDetails && !coins) {
            this.props.getCoins(userDetails.id);
        }

        this.socket = io('http://52.74.41.113:4444');
        this.socket.emit('getOrder', 'order');
        this.socket.on('document', data => {
            console.log(data);
            if(data.orderUserId === userDetails.id) {
                this.onRefresh(false);
            } 
       });

        this.onRefresh();
    }

    onRefresh = async (showLoading = true) => {
        const { getUser: { userDetails } } = this.props;
        this.props.getCoins(userDetails.id);
        this.setState({ refreshing: showLoading });

        const response = await orderService.getListOrderByUserId(userDetails.id);
        if (response.status === 200) {
            this.setState({
                totalPending: response.data.filter(order => !order.canceledTime && !order.cookedTime).length,
                totalCooking: response.data.filter(order => !order.canceledTime && order.cookedTime && !order.shippedTime).length,
                totalShipping: response.data.filter(order => !order.canceledTime && order.shippedTime && !order.completedTime).length,
                totalCompleted: response.data.filter(order => order.completedTime).length
            });
            this.setState({ refreshing: false });
        } else {
            this.setState({ refreshing: false });
            this.refs.toast.show('Error! Please check your internet connection.', 2000);
        }
    }

    onLogout = () => {
        this.props.logoutUser();
    }

    getAvatarUrl(id, size = 100) {
        return userAvatarUrl.replace('{id}', id).replace('{size}', size);
    }

    getJoinDate(date) {
        return 'Member since: ' + formatDate(date);
    }

    onOpenOrderManager(page) {
        const { getUser: { userDetails } } = this.props;
        if (userDetails) {
            this.orderManagerModal.openModal(this.props.getUser.userDetails?.id, page);
        } else {
            this.authModal.toggleModal()
        }
    }

    render() {
        const { getUser: { userDetails } } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.section}>
                        <Text style={styles.title}>Account</Text>
                    </View>

                    <CartIcon navigation={this.props.navigation} />
                </View>

                <ScrollView refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)} />
                }>
                    {userDetails ?
                        <View style={{ marginBottom: 5 }}>
                            {
                                <ListItem
                                    leftAvatar={{ size: 65, source: { uri: this.getAvatarUrl(userDetails.id) } }}
                                    title={userDetails.firstName + ' ' + userDetails.lastName}
                                    titleStyle={{ fontSize: 20, marginBottom: 5 }}
                                    subtitle={this.getJoinDate(userDetails.createdDate)}
                                    subtitleStyle={{ fontSize: 12 }}
                                    chevron
                                    onPress={() => this.props.navigation.navigate('UserInfoScreen', {
                                        navigation: this.props.navigation
                                    })}
                                />
                            }
                        </View>
                        :
                        <View style={{ marginBottom: 5 }}>
                            {
                                <ListItem
                                    leftAvatar={{ size: 65, source: no_user.avatar_url }}
                                    title={no_user.name}
                                    titleStyle={{ fontSize: 14, marginBottom: 5 }}
                                    subtitle={no_user.subtitle}
                                    subtitleStyle={{ fontSize: 18, color: '#1ba8ff' }}
                                    chevron
                                    onPress={() => this.authModal.toggleModal()}
                                />
                            }
                        </View>
                    }

                    <View style={{ marginVertical: 5 }}>
                        <ListItem
                            title='My Purchases'
                            leftIcon={{ name: 'content-paste', color: '#1ba8ff' }}
                            bottomDivider
                            chevron
                            onPress={() => this.onOpenOrderManager()}
                        />
                        <View style={{ backgroundColor: '#fff', flexDirection: 'row', padding: 10, width: '100%', justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity style={styles.viewStatus}
                                activeOpacity={1}
                                onPress={() => this.onOpenOrderManager(0)}
                            >
                                {this.state.totalPending > 0 &&
                                    <Badge
                                        status="success"
                                        value={this.state.totalPending}
                                        textStyle={{ fontSize: 13 }}
                                        badgeStyle={{ backgroundColor: '#1ba8ff', borderWidth: 0 }}
                                        containerStyle={{
                                            marginTop: 0,
                                            top: Platform.OS === "android" ? 2 : -5,
                                            position: 'absolute',
                                            right: 10,
                                            zIndex: 2
                                        }}
                                    />
                                }
                                <MaterialCommunityIcons
                                    name="progress-upload"
                                    color='#bdbdbd'
                                    size={35}
                                />
                                <Text style={{ paddingTop: 5 }}>Pending</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.viewStatus}
                                activeOpacity={1}
                                onPress={() => this.onOpenOrderManager(1)}
                            >
                                {this.state.totalCooking > 0 &&
                                    <Badge
                                        status="success"
                                        value={this.state.totalCooking}
                                        textStyle={{ fontSize: 13 }}
                                        badgeStyle={{ backgroundColor: '#1ba8ff', borderWidth: 0 }}
                                        containerStyle={{
                                            marginTop: 0,
                                            top: Platform.OS === "android" ? 2 : -5,
                                            position: 'absolute',
                                            right: 10,
                                            zIndex: 2
                                        }}
                                    />
                                }
                                <MaterialCommunityIcons
                                    name="chef-hat"
                                    color='#bdbdbd'
                                    size={35}
                                />
                                <Text style={{ paddingTop: 5 }}>Cooking</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.viewStatus}
                                activeOpacity={1}
                                onPress={() => this.onOpenOrderManager(2)}
                            >
                                {this.state.totalShipping > 0 &&
                                    <Badge
                                        status="success"
                                        value={this.state.totalShipping}
                                        textStyle={{ fontSize: 13 }}
                                        badgeStyle={{ backgroundColor: '#1ba8ff', borderWidth: 0 }}
                                        containerStyle={{
                                            marginTop: 0,
                                            top: Platform.OS === "android" ? 2 : -5,
                                            position: 'absolute',
                                            right: 10,
                                            zIndex: 2
                                        }}
                                    />
                                }
                                <MaterialCommunityIcons
                                    name="truck-fast"
                                    color='#bdbdbd'
                                    size={35}
                                />
                                <Text style={{ paddingTop: 5 }}>Shipping</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.viewStatus}
                                activeOpacity={1}
                                onPress={() => this.onOpenOrderManager(3)}
                            >
                                {this.state.totalCompleted > 0 &&
                                    <Badge
                                        status="success"
                                        value={this.state.totalCompleted}
                                        textStyle={{ fontSize: 13 }}
                                        badgeStyle={{ backgroundColor: '#1ba8ff', borderWidth: 0 }}
                                        containerStyle={{
                                            marginTop: 0,
                                            top: Platform.OS === "android" ? 2 : -5,
                                            position: 'absolute',
                                            right: 10,
                                            zIndex: 2
                                        }}
                                    />
                                }
                                <MaterialCommunityIcons
                                    name="check-decagram"
                                    color='#bdbdbd'
                                    size={35}
                                />
                                <Text style={{ paddingTop: 5 }}>To Rate</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ marginVertical: 5 }}>
                        <ListItem
                            title='My Addresses'
                            leftIcon={{ name: 'location-on', color: '#005fb1' }}
                            bottomDivider
                            chevron
                            onPress={() =>
                                userDetails ? this.addressModal.toggleModal() : this.authModal.toggleModal()
                            }
                        />
                        <ListItem
                            title='My Likes'
                            leftIcon={{ name: 'favorite-border', color: '#ee4d2d' }}
                            bottomDivider
                            chevron
                            onPress={() => this.props.navigation.navigate('ProductsScreen', {
                                productType: ProductType.LovedProduct,
                                navigation: this.props.navigation
                            })}
                        />
                        <ListItem
                            title='Recently Viewed'
                            leftIcon={{ name: 'history', color: '#1178d2' }}
                            bottomDivider
                            chevron
                            onPress={() => this.props.navigation.navigate('ProductsScreen', {
                                productType: ProductType.ViewedProduct,
                                navigation: this.props.navigation
                            })}
                        />
                        <ListItem
                            title='Buy later'
                            leftIcon={{ name: 'bookmark-border', color: '#fd5f32' }}
                            bottomDivider
                            chevron
                            onPress={() => this.props.navigation.navigate('ProductsScreen', {
                                productType: ProductType.BuyLateProduct,
                                navigation: this.props.navigation
                            })}
                        />
                        <ListItem
                            title='My Panda Coins'
                            leftIcon={{ name: 'monetization-on', color: '#ffc107' }}
                            rightElement={<Text>{this.props.coins + (this.props.coins < 2 ? ' Coin' : ' Coins')}</Text>}
                            bottomDivider
                            chevron
                            onPress={() =>
                                userDetails
                                    ? this.historyCoinModal.openModal(this.props.coins, userDetails.id)
                                    : this.authModal.toggleModal()
                            }
                        />
                        <ListItem
                            title='My Rating'
                            leftIcon={{ name: 'star-border', color: '#0fad04' }}
                            bottomDivider
                            chevron
                            onPress={() =>
                                userDetails ? this.ratingManagerModal.openModal(userDetails.id) : this.authModal.toggleModal()
                            }
                        />
                        <ListItem
                            title='My Vouchers'
                            leftIcon={{ name: 'developer-board', color: '#ffc107' }}
                            bottomDivider
                            chevron
                            onPress={() =>
                                userDetails ? this.voucherModal.openModal(userDetails.id, null, false) : this.authModal.toggleModal()
                            }
                        />
                    </View>
                    {userDetails &&
                        <Button
                            title="Logout"
                            type="outline"
                            onPress={() => this.onLogout()}
                            style={styles.btnLogout}
                            buttonStyle={styles.btnLogout_inside}
                        />
                    }
                </ScrollView>

                <AuthModal
                    onRef={ref => (this.authModal = ref)}
                    navigation={this.props.navigation}
                />

                <UserAddressModal
                    onRef={ref => (this.addressModal = ref)}
                    navigation={this.props.navigation}
                />

                <VoucherModal onRef={ref => (this.voucherModal = ref)} />

                <OrderManagementModal onRef={ref => (this.orderManagerModal = ref)} />

                <HistoryCoinModal onRef={ref => (this.historyCoinModal = ref)} />

                <RatingManagementModal onRef={ref => (this.ratingManagerModal = ref)} />
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    getUser: state.userReducer.getUser,
    authData: state.authReducer.authData,
    coins: state.userReducer.getCoins.coins
})

const mapDispatchToProps = (dispatch) => ({
    logoutUser: () => dispatch(authActions.logoutUser()),
    getInfoFromAccessToken: (accessToken) => dispatch(userActions.getInfoFromAccessToken(accessToken)),
    getCoins: (userId) => dispatch(userActions.getCoins(userId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Account);

var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 5
    },
    header: {
        backgroundColor: '#1ba8ff',
        height: Platform.OS === 'ios' ? 70 : 80,
        flexDirection: 'row',
        width: '100%',
        paddingTop: Platform.OS === 'ios' ? 0 : 7
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 25 : 32,
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
    btnLogout: {
        marginHorizontal: 10,
        marginVertical: 5
    },
    btnLogout_inside: {
        backgroundColor: 'white'
    },
    viewStatus: {
        justifyContent: "center",
        alignItems: "center",
        width: '25%'
    }
});

const no_user = {
    name: 'Welcome to Panda Food',
    avatar_url: require('../assets/avatars/no-avatar.jpg'),
    subtitle: 'Sign in / Sign up'
};
