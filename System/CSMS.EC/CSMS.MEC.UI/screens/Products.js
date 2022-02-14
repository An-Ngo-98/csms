import React from 'react';
import { View, StyleSheet, Platform, Text, FlatList } from 'react-native';
import { AntDesign } from 'react-native-vector-icons';
import { ProductType } from '../commons/constants';
import Swipeout from 'react-native-swipeout';
import { connect } from 'react-redux';

import { productActions } from '../redux/actions';
import Product from '../components/Product';
import EmptyContent from '../components/EmptyContent';

class Products extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({
            selectedRow: null
        });
    }

    _getProducts() {
        switch (this.props.navigation.state.params.productType) {
            case ProductType.LovedProduct:
                return this.props.lovedProducts;

            case ProductType.ViewedProduct:
                return this.props.viewedProducts;

            case ProductType.BuyLateProduct:
                return this.props.buyLateProducts;

            default:
                return [];
        }
    }

    _getTitle() {
        switch (this.props.navigation.state.params.productType) {
            case ProductType.LovedProduct:
                return 'My Likes';

            case ProductType.ViewedProduct:
                return 'Recently Viewed';

            case ProductType.BuyLateProduct:
                return 'Buy Later';

            default:
                return 'Products';
        }
    }

    _renderItem = ({ item }) => {
        return (
            <Swipeout
                autoClose={true}
                onOpen={() => this.setState({ selectedRow: item.id })}
                backgroundColor='transparent'
                close={this.state.selectedRow !== item.id}
                right={[{
                    text: 'Delete',
                    type: 'delete',
                    onPress: () => this.onDeleteProduct(item)
                }]}
            >
                {/* <AntDesign
                    style={styles.delete}
                    name="close"
                    color='gray'
                    size={22}
                    onPress={() => this.onDeleteProduct(item)}
                /> */}
                <Product
                    product={item}
                    navigation={this.props.navigation}
                    size={"rectangle"}
                />
            </Swipeout>
        );
    };

    onDeleteProduct(product) {
        switch (this.props.navigation.state.params.productType) {
            case ProductType.LovedProduct:
                this.props.deleteLovedProduct(product);
                break;

            case ProductType.ViewedProduct:
                this.props.deleteViewedProduct(product);
                break;

            case ProductType.BuyLateProduct:
                this.props.deleteBuyLateProduct(product);
                break;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <AntDesign
                        style={styles.back}
                        name="left"
                        color='#fff'
                        size={25}
                        onPress={() => this.props.navigation.goBack()}
                    />
                    <View style={styles.section}>
                        <Text style={styles.title}>{this._getTitle()}</Text>
                    </View>
                </View>
                <View style={styles.listData}>
                    {this._getProducts().length === 0 && <EmptyContent content={this._getTitle().toLowerCase()} navigation={this.props.navigation} />}
                    <FlatList
                        data={this._getProducts()}
                        renderItem={this._renderItem}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    lovedProducts: state.productReducer.lovedProducts,
    viewedProducts: state.productReducer.viewedProducts,
    buyLateProducts: state.productReducer.buyLateProducts,
});

const mapDispatchToProps = dispatch => ({
    deleteLovedProduct: (product) => dispatch(productActions.deleteLovedProduct(product)),
    deleteViewedProduct: (product) => dispatch(productActions.deleteViewedProduct(product)),
    deleteBuyLateProduct: (product) => dispatch(productActions.deleteBuyLateProduct(product)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Products);

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        backgroundColor: '#1ba8ff',
        height: Platform.OS === 'ios' ? 70 : 80,
        flexDirection: 'row',
        width: '100%',
        paddingTop: Platform.OS === 'ios' ? 0 : 7
    },
    back: {
        marginTop: 30,
        width: '15%',
        textAlign: 'center',
        zIndex: 2
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
    listData: {
        flex: 1,
        backgroundColor: "#fff"
    },
    // delete: {
    //     position: 'absolute',
    //     right: 10,
    //     top: 10,
    //     zIndex: 1
    // }
});