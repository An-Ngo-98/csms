import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ApiController } from "../commons/constants/api.controller";
import { getApiUrl } from "../configs/api.config";
import { Rating, Button } from "react-native-elements";

import DetailModal from "../screens/DetailProduct/DetailModal";
import { connect } from "react-redux";
import { cartActions } from "../redux/actions";
import AddToCartAlertModal from "./modals/AddToCartAlertModal";
import CartModal from "../screens/Cart/CartModal";

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product: props.product,
            size: props.size
        };
    }

    getPhotoUrl() {
        return (
            getApiUrl(ApiController.CdnApi.ProductPhoto) +
            this.state.product.avatarId +
            "/300"
        );
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

    openModal() {
        this.detailModal.openModal(this.state.product);
    }

    onAddToCart() {
        const units = this.state.product.units ? this.state.product.units : 1;
        this.props.addToCart(this.state.product, units);
        this.alertAddCartModal.openModal(this.state.product);
    }

    render() {
        if (this.state.size === "large") {
            return (
                <View>
                    <TouchableOpacity
                        onPress={() => this.openModal()}
                        style={styles.productItem}
                    >
                        <View style={styles.imageRegion}>
                            <Image
                                source={{ uri: this.getPhotoUrl() }}
                                style={styles.productImage}
                            />
                        </View>
                        <View style={styles.textRegion}>
                            <Text style={styles.name}>{this.state.product.name}</Text>
                            <Text style={styles.price}>{this.formatCurrency()}</Text>
                        </View>
                    </TouchableOpacity>

                    <DetailModal navigation={this.props.navigation} onRef={ref => (this.detailModal = ref)} />
                </View>
            );
        }

        if (this.state.size === "rectangle") {
            return (
                <View>
                    <View style={styles.productItemSquare}>
                        <TouchableOpacity
                            style={styles.imageRegionSquare}
                            onPress={() => this.openModal()}
                        >
                            <Image
                                source={{ uri: this.getPhotoUrl() }}
                                style={styles.productImage}
                            />
                        </TouchableOpacity>
                        <View style={styles.textRegion}>
                            <Text style={styles.nameSquare}>{this.state.product.name}</Text>
                            <View style={{ flexDirection: "row" }}>
                                <Rating
                                    imageSize={12}
                                    readonly
                                    startingValue={this.state.product.rate}
                                    style={{ width: 70, marginTop: 5 }}
                                />
                                <Text style={styles.textTotalReview}>
                                    {'(' + this.state.product.totalRate + ')'}
                                </Text>
                            </View>
                            <Text style={styles.priceSquare}>{this.formatCurrency()}</Text>
                            <View style={{ flexDirection: "row" }}>
                                <Button
                                    type="outline"
                                    title="Add to cart"
                                    buttonStyle={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        marginTop: 10,
                                        marginLeft: 5
                                    }}
                                    titleStyle={{ fontSize: 14 }}
                                    onPress={() => this.onAddToCart()}
                                />
                            </View>
                        </View>
                    </View>

                    <DetailModal onRef={ref => (this.detailModal = ref)} />

                    <AddToCartAlertModal
                        onRef={ref => (this.alertAddCartModal = ref)}
                        onGoToCart={() => this.cartModal.toggleModal()}
                    />

                    <CartModal onRef={ref => (this.cartModal = ref)} />
                </View>
            );
        }
    }
}

const mapDispatchToProps = dispatch => ({
    addToCart: (product, units) => dispatch(cartActions.addToCart(product, units))
});

export default connect(null, mapDispatchToProps)(Product);

var styles = StyleSheet.create({
    productItem: {
        height: 180,
        width: 200,
        paddingHorizontal: 5
    },
    productItemSquare: {
        width: "100%",
        flexDirection: "row",
        borderWidth: 0.5,
        borderColor: "#d4d4d4",
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    productImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: "cover"
    },
    name: {
        fontSize: 16,
        textAlign: "center"
    },
    nameSquare: {
        fontSize: 18,
        fontWeight: "400",
        marginHorizontal: 5,
        color: "#141414"
    },
    price: {
        fontWeight: "bold",
        fontSize: 14,
        color: "red",
        textAlign: "center"
    },
    priceSquare: {
        fontWeight: "600",
        fontSize: 20,
        color: "#e80e0e",
        marginHorizontal: 5,
        marginTop: 5
    },
    imageRegion: {
        flex: 2
    },
    imageRegionSquare: {
        height: 120,
        width: "50%",
        marginHorizontal: 5,
        marginVertical: 5
    },
    textRegion: {
        marginTop: 5,
        marginBottom: 15,
        marginLeft: 15,
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    textTotalReview: {
        color: "gray",
        width: 30,
        marginTop: 3,
        fontSize: 12
    }
});
