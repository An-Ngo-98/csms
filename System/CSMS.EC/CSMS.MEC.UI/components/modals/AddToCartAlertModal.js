import React from 'react';
import { View, StyleSheet, Modal, StatusBar, Text, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { AntDesign } from "react-native-vector-icons";

import { ApiController } from "../../commons/constants/api.controller";
import { getApiUrl } from "../../configs/api.config";

export default class AddToCartAlertModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            product: null
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    openModal(product) {
        this.setState({
            modalVisible: true,
            product: product
        });
    }

    onGoToCart() {
        this.setState({ modalVisible: false });
        this.props.onGoToCart();
    }

    getPhotoUrl() {
        if (this.state.product) {
            return (
                getApiUrl(ApiController.CdnApi.ProductPhoto) +
                this.state.product.avatarId +
                "/100"
            );
        }

        return '';
    }

    formatCurrency() {
        if (!this.state.product.price) {
            return "N/A";
        }

        return (
            this.state.product.price
                .toString()
                .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " ₫"
        );
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}
                style={styles.container}>

                <TouchableOpacity
                    onPress={() => this.setState({ modalVisible: false })}
                    activeOpacity={0.2}
                    style={{ flex: 1, backgroundColor: 'black', opacity: 0.2 }}
                />

                <View
                    showsVerticalScrollIndicator={false}
                    activeOpacity={0}
                    style={styles.footer}
                >
                    <StatusBar barStyle='light-content' />
                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                        <AntDesign
                            style={styles.iconSuccess}
                            name="checksquareo"
                            color='green'
                            size={18}
                            onPress={() => this.setState({ modalVisible: false })}
                        />
                        <Text style={styles.title}>The product has been added to cart.</Text>
                        <AntDesign
                            style={styles.back}
                            name="close"
                            color='gray'
                            size={20}
                            onPress={() => this.setState({ modalVisible: false })}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <View
                            style={styles.imageRegionSquare}
                            onPress={() => this.openModal()}
                        >
                            <Image
                                source={{ uri: this.getPhotoUrl() }}
                                style={styles.productImage}
                            />
                        </View>
                        <View style={styles.textRegion}>
                            <Text style={styles.textName}>{this.state.product ? this.state.product.name : ''}</Text>
                            <Text style={styles.textPrice}>{this.state.product ? this.formatCurrency() : ''}</Text>
                        </View>
                    </View>

                    <View style={{ marginVertical: 20 }}>
                        <Button
                            buttonStyle={{ backgroundColor: '#ff424e' }}
                            title='Order now'
                            loading={this.state.submitted && updateUserState && updateUserState.isLoading}
                            onPress={() => this.onGoToCart()}
                        />
                    </View>
                </View>
            </Modal>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray'
    },
    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 15
    },
    iconSuccess: {
        marginVertical: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        marginVertical: 10,
        marginHorizontal: 10,
        color: 'green'
    },
    back: {
        position: 'absolute',
        right: 0,
        marginVertical: 10
    },
    imageRegionSquare: {
        height: 80,
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
    textRegion: {
        marginTop: 5,
        marginBottom: 15,
        marginLeft: 15,
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    textName: {
        fontSize: 16
    },
    textPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'red'
    }
});