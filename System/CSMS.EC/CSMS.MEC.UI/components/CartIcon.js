import React from "react";
import { Platform, View } from "react-native";
import { Feather } from "react-native-vector-icons";
import { Badge } from "react-native-elements";
import { connect } from "react-redux";

import CartModal from '../screens/Cart/CartModal';

class CartIcon extends React.Component {
    onClickCart() {
        this.cartModal.toggleModal();
    }

    _totalProduct() {
        let total = 0;
        for (const product of this.props.cartReducer) {
            total += product.units;
        }

        return total;
    }

    render() {
        return (
            <View style={{ position: 'absolute', right: 6, zIndex: 2 }}>
                <Feather
                    style={{
                        marginTop: this.props.isModal && Platform.OS === "android" ? 10 : 32,
                        top: Platform.OS === "android" ? 10 : 0,
                        marginRight: 0,
                        textAlign: "right",
                        paddingRight: 15,
                        width: "100%",
                        zIndex: 2
                    }}
                    name="shopping-cart"
                    color="white"
                    size={25}
                    onPress={() => this.onClickCart()}
                />

                <Badge
                    status="success"
                    value={this._totalProduct()}
                    textStyle={{ fontSize: 10 }}
                    badgeStyle={{ backgroundColor: 'orange', borderWidth: 0 }}
                    containerStyle={{
                        marginTop: this.props.isModal && Platform.OS === "android" ? 10 : 32,
                        top: Platform.OS === "android" ? 2 : -5,
                        position: 'absolute',
                        right: 2,
                        zIndex: 2
                    }}
                />

                <CartModal
                    navigation={this.props.navigation}
                    onRef={ref => (this.cartModal = ref)}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    cartReducer: state.cartReducer
});

export default connect(mapStateToProps, null)(CartIcon);
