import React from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, FlatList, Platform, Text, Keyboard } from "react-native";
import { AntDesign, MaterialIcons, MaterialCommunityIcons } from "react-native-vector-icons";
import { connect } from "react-redux";

import CartIcon from "../../components/CartIcon";
import { productActions, systemActions } from "../../redux/actions";
import Product from "../../components/Product";
import NotFound from "../../components/NotFound";

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            focused: true,
            products: null,
            result: null,
            category: this.props.navigation.state.params.category,
            branch: this.props.navigation.state.params.branch,
            searchString: "",
            openModel: 0
        };
    }

    componentDidMount = async () => {
        const { stateGetProducts, categories, branchs } = this.props;

        if (categories.length === 0) {
            await this.props.getCategories();
        }

        if (branchs.length === 0) {
            await this.props.getBranchs();
        }

        if (stateGetProducts.products) {
            this.setState({
                products: stateGetProducts.products
            }, () => {
                if (this.props.navigation.state.params.unFocusInput) {
                    this.onSearch(this.state.searchString);
                }
            });
        } else {
            const response = await this.props.getProducts();

            if (response && this.props.stateGetProducts.isSuccess && this.props.stateGetProducts.products) {
                this.setState({
                    products: this.props.stateGetProducts.products,
                    errorMessage: null
                }, () => {
                    if (this.props.navigation.state.params.unFocusInput) {
                        this.onSearch(this.state.searchString);
                    }
                });
            } else {
                this.setState({
                    errorMessage: "Cannot connect to server. Please try again later."
                });
            }
        }
    };

    onSearch(text) {
        this.setState({ searchString: text });

        let result = this.state.products ? this.state.products : [];
        if (text && text.length > 0) {
            result = result.filter(
                item =>
                    item.name.toLowerCase().includes(text.toLowerCase()) ||
                    (item.categoryName && item.categoryName.toLowerCase().includes(text.toLowerCase())) ||
                    (item.searchString && item.searchString.toLowerCase().includes(text.toLowerCase()))
            );
        }

        if (this.state.category) {
            result = result.filter(item => item.categoryId === this.state.category.id);
        }

        if (this.state.branch) {
            result = result.filter(
                item => item.availableBranchs.find(branchId => branchId === this.state.branch.id) > 0
            );
        }

        Keyboard.dismiss();
        this.setState({
            focused: false,
            result: result
        });
    }

    renderItem = ({ item }) => {
        return (
            <Product
                product={item}
                navigation={this.props.navigation}
                size={"rectangle"}
            />
        );
    };

    onSelectStore(branch) {
        this.setState({
            branch: branch,
            openModel: 0
        }, () => {
            this.onSearch(this.state.searchString);
        });
    }

    onSelectCategory(cat) {
        this.setState({
            category: cat,
            openModel: 0
        }, () => {
            this.onSearch(this.state.searchString);
        });
    }

    renderSelectItemBranch = ({ item }) => {
        return (
            <TouchableOpacity style={{ flexDirection: 'row', width: '100%', paddingVertical: 14, paddingHorizontal: 10 }}
                onPress={() => this.onSelectStore(item)}
            >
                <Text>{item.name}</Text>
                {this.state.branch && this.state.branch.id === item.id &&
                    <MaterialIcons style={{ position: 'absolute', right: 10, top: 10 }} name="check" color="#1ba8ff" size={18} />
                }
            </TouchableOpacity>
        );
    };

    renderSelectItemCategory = ({ item }) => {
        return (
            <TouchableOpacity style={{ flexDirection: 'row', width: '100%', paddingVertical: 14, paddingHorizontal: 10 }}
                onPress={() => this.onSelectCategory(item)}
            >
                <Text>{item.name}</Text>
                {this.state.category && this.state.category.id === item.id &&
                    <MaterialIcons style={{ position: 'absolute', right: 10, top: 10 }} name="check" color="#1ba8ff" size={18} />
                }
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <AntDesign
                        style={styles.back}
                        name="left"
                        color="#fff"
                        size={25}
                        onPress={() => this.props.navigation.goBack()}
                    />

                    <View style={styles.section}>
                        <AntDesign name="search1" size={20} color="#000" />
                        <TextInput
                            placeholder="Food, drink, dessert ..."
                            style={styles.text}
                            value={this.state.searchString}
                            returnKeyType="search"
                            autoFocus={this.props.navigation.state.params.unFocusInput ? false : true}
                            autoCapitalize="none"
                            onFocus={() => this.setState({ focused: true })}
                            onChangeText={text => this.setState({ searchString: text })}
                            onSubmitEditing={() => this.onSearch(this.state.searchString)}
                        />
                        {this.state.focused && (
                            <TouchableOpacity
                                onPress={() => this.setState({ searchString: "" })}
                                style={styles.close}
                            >
                                <AntDesign name="close" color="gray" size={20} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <CartIcon navigation={this.props.navigation} />
                </View>
                {!this.state.focused && this.state.result && (
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderWidth: 0.5, borderColor: "#d4d4d4", }}>
                        <TouchableOpacity style={{ flexDirection: 'row', width: '60%', paddingLeft: 10, paddingVertical: 14 }}
                            activeOpacity={1}
                            onPress={() => this.setState({ openModel: this.state.openModel === 1 ? 0 : 1 })}
                        >
                            <MaterialIcons
                                name={'location-on'}
                                color="gray"
                                size={24}
                                style={{ marginRight: 5, marginTop: -7 }}
                            />
                            <Text style={{ fontWeight: 'bold' }}>
                                {this.state.branch ? this.state.branch.name : 'All stores'}
                            </Text>
                            <MaterialIcons
                                name={this.state.openModel === 1 ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                                color="gray"
                                size={20}
                                style={{ marginLeft: 3 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', width: '40%', paddingRight: 10, paddingVertical: 14 }}
                            activeOpacity={1}
                            onPress={() => this.setState({ openModel: this.state.openModel === 2 ? 0 : 2 })}
                        >
                            <MaterialCommunityIcons
                                name={'food'}
                                color="gray"
                                size={25}
                                style={{ marginRight: 5, marginTop: -8 }}
                            />
                            <Text style={{ fontWeight: 'bold' }}>
                                {this.state.category ? this.state.category.name : 'All categories'}
                            </Text>
                            <MaterialIcons
                                name={this.state.openModel === 2 ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                                color="gray"
                                size={20}
                                style={{ marginLeft: 5 }}
                            />
                        </TouchableOpacity>
                    </View>
                )}

                {this.state.focused && (
                    <View style={styles.recommend}>
                        <View style={{ flexDirection: "row" }}>
                            <MaterialIcons name="whatshot" color="red" size={24} />
                            <Text style={styles.textTitle}>Most searched</Text>
                        </View>
                        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                            {keys.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        style={styles.touchKey}
                                        key={index}
                                        onPress={() => this.onSearch(item)}
                                    >
                                        <Text>{item}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}

                {!this.state.focused && (
                    <View style={styles.listData}>
                        {this.state.result && this.state.result.length === 0 && (
                            <NotFound />
                        )}

                        {this.state.errorMessage && (
                            <Text style={styles.textError}>{this.state.errorMessage}</Text>
                        )}

                        <FlatList
                            data={this.state.result}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.id.toString()}
                        />

                        {(this.state.openModel === 1 || this.state.openModel === 2) &&
                            <View style={{ position: 'absolute', height: '100%', width: '100%' }}>
                                {this.state.openModel === 1 &&
                                    <View style={{ backgroundColor: '#fff' }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', width: '100%', paddingVertical: 12, paddingHorizontal: 10 }}
                                            onPress={() => this.onSelectStore(null)}
                                        >
                                            <Text>All stores</Text>
                                            {!this.state.branch &&
                                                <MaterialIcons style={{ position: 'absolute', right: 10, top: 10 }} name="check" color="#1ba8ff" size={18} />
                                            }
                                        </TouchableOpacity>
                                        <FlatList
                                            data={this.props.branchs}
                                            renderItem={this.renderSelectItemBranch}
                                            keyExtractor={item => item.id.toString()}
                                        />
                                    </View>
                                }
                                {this.state.openModel === 2 &&
                                    <View style={{ backgroundColor: '#fff' }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', width: '100%', paddingVertical: 12, paddingHorizontal: 10 }}
                                            onPress={() => this.onSelectCategory(null)}
                                        >
                                            <Text>All categories</Text>
                                            {!this.state.category &&
                                                <MaterialIcons style={{ position: 'absolute', right: 10, top: 10 }} name="check" color="#1ba8ff" size={18} />
                                            }
                                        </TouchableOpacity>
                                        <FlatList
                                            data={this.props.categories}
                                            renderItem={this.renderSelectItemCategory}
                                            keyExtractor={item => item.id.toString()}
                                        />
                                    </View>
                                }
                                <View style={{ backgroundColor: 'black', height: '100%', opacity: 0.3 }} />
                            </View>
                        }
                    </View>
                )}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    stateGetProducts: state.productReducer.getProducts,
    categories: state.systemReducer.categoryReducer,
    branchs: state.systemReducer.branchReducer
});

const mapDispatchToProps = dispatch => ({
    getProducts: () => dispatch(productActions.getProducts()),
    getBranchs: () => dispatch(systemActions.getBranchs()),
    getCategories: () => dispatch(systemActions.getCategories())
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        backgroundColor: "#1ba8ff",
        height: Platform.OS === "ios" ? 70 : 80,
        flexDirection: "row",
        width: "100%",
        paddingTop: Platform.OS === "ios" ? 0 : 7
    },
    section: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: Platform.OS === "ios" ? 25 : 26,
        marginHorizontal: 5,
        borderRadius: 5,
        backgroundColor: "#fff",
        width: "68%",
        marginRight: 55,
        height: 35,
        flex: 1
    },
    text: {
        flex: 1,
        marginLeft: 10
    },
    close: {
        paddingHorizontal: 5
    },
    back: {
        marginTop: 30,
        width: "15%",
        textAlign: "center"
    },
    textError: {
        color: "red",
        textAlign: "center",
        marginHorizontal: 10,
        marginVertical: 20
    },
    listData: {
        flex: 1,
        backgroundColor: "#fff"
    },
    recommend: {
        backgroundColor: "#fff",
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    textTitle: {
        fontSize: 14,
        fontWeight: "500",
        paddingTop: 6,
        paddingBottom: 15,
        paddingLeft: 15
    },
    touchKey: {
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 8,
        marginHorizontal: 5,
        marginVertical: 6,
        backgroundColor: "#f0f0f0"
    }
});

const keys = [
    "chicken",
    "food",
    "drink",
    "dessert",
    "pancake",
    "pizza",
    "banh xeo",
    "sanchwich",
    "hamburger",
    "ga chien",
    "nuoc ngot",
    "kem"
];
