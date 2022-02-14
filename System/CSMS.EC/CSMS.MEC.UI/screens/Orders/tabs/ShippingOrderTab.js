import React from 'react';
import { Text, StyleSheet, ScrollView, View, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

import NotFound from '../../../components/NotFound';
import { getApiUrl } from '../../../configs/api.config';
import { formatDate } from '../../../commons/helpers/moment.helper';
import { ApiController, DateFormat } from '../../../commons/constants';

export default class ShippingOrderTab extends React.Component {

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

    _formatDateTime(datetime) {
        if (!datetime) {
            return 'N/A';
        }

        return formatDate(datetime, DateFormat.DateTimeFormatYYYYMMDD);
    }

    _getNumbersOfItem(products) {
        let total = 0;
        products.forEach(prod => {
            total += prod.quantity;
        });

        return total + (total < 2 ? ' item' : ' items');
    }

    renderItem(item) {
        return (
            <View key={item.id} style={styles.productItem}>
                <View style={styles.imageRegion}>
                    <Image
                        source={{ uri: this._getPhotoUrl(item.photoId) }}
                        style={styles.productImage}
                    />
                </View>
                <View style={styles.textRegion}>
                    <Text style={styles.name}>
                        {item.name}
                    </Text>
                    <View style={styles.textRight}>
                        <Text style={{ textAlign: 'right', paddingBottom: 5, color: 'gray' }}>
                            {'x' + item.quantity}
                        </Text>
                        <Text style={styles.price}>
                            {this._formatCurrency(item.price)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        return (
            <ScrollView style={[styles.container, {
                backgroundColor: this.props.orders.length > 0 ? '#f2f2f2' : '#fff'
            }]}>
                {this.props.orders.length === 0 && <NotFound content='orders' />}

                {this.props.orders.map(order => {
                    return (
                        <TouchableOpacity
                            key={order.id}
                            style={styles.item}
                            activeOpacity={0.9}
                            onPress={() => this.props.viewOrder(order.id)}
                        >
                            <View style={{ flexDirection: 'row', width: '100%', paddingBottom: 15 }}>
                                <MaterialCommunityIcons
                                    name="store"
                                    color='#1ba8ff'
                                    size={25}
                                />
                                <Text style={{ fontSize: 14, paddingTop: 5, paddingLeft: 5 }}>{order.storeName}</Text>
                                <Text style={styles.textRate}>{this._formatDateTime(order.orderedTime)}</Text>
                            </View>

                            {order.products.map(product => this.renderItem(product))}

                            <View style={{ flexDirection: 'row', width: '100%', borderTopColor: '#d4d4d4', borderTopWidth: .5, paddingTop: 12, paddingBottom: 15 }}>
                                <Text style={{ color: 'gray', paddingTop: 2 }}>{this._getNumbersOfItem(order.products)}</Text>
                                <Text style={{ position: 'absolute', right: 0, top: 12, fontSize: 16 }}>
                                    {'Order total: '}
                                    <Text style={styles.price}>{this._formatCurrency(order.total)}</Text>
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView >
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10
    },
    item: {
        marginBottom: 10,
        backgroundColor: '#fff',
        paddingVertical: 7,
        paddingHorizontal: 10
    },
    textRate: {
        position: 'absolute',
        right: 0,
        top: 5
    },
    productItem: {
        width: "100%",
        flexDirection: "row",
        paddingRight: 10,
        paddingBottom: 10,
        backgroundColor: '#fff'
    },
    textRegion: {
        paddingTop: 5,
        paddingBottom: 15,
        paddingLeft: 15,
        width: '75%',
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    imageRegion: {
        height: 60,
        width: "25%",
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
        fontSize: 16,
        fontWeight: "400",
        marginHorizontal: 5,
        color: "#141414"
    },
    price: {
        fontWeight: "600",
        fontSize: 16,
        color: "#e80e0e"
    },
    textRight: {
        position: 'absolute',
        right: 0,
        bottom: 0
    }
});