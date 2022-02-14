import React from 'react';
import { TouchableOpacity, TextInput, View, StyleSheet, Text, Platform, Image, Dimensions, Animated } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { AntDesign } from 'react-native-vector-icons';

import CartIcon from '../components/CartIcon';
import Product from '../components/Product';

import { connect } from 'react-redux';
import { productActions, systemActions } from '../redux/actions';

HEADER_MAX_HEIGHT = Platform.OS === 'ios' ? 125 : 135;
HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 70 : 80;

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
            loading: true,
            errorMessage: ''
        }
    }

    componentDidMount = async () => {
        const { stateGetProducts, categories } = this.props;

        if (categories.length === 0) {
            await this.props.getCategories();
        }

        if (!stateGetProducts.products || stateGetProducts.products.length === 0) {
            const response = await this.props.getProducts();

            if (!response || !this.props.stateGetProducts.isSuccess || !this.props.stateGetProducts.products) {
                this.setState({
                    errorMessage: "Cannot connect to server. Please try again later."
                });
            }
        }
    }

    renderItem = ({ item }) => {
        return (
            <Product product={item} navigation={this.props.navigation} size={'large'} />
        )
    }

    render() {

        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp'
        })

        const logoOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        })

        const widthSearchBar = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            outputRange: [dimensions.width, dimensions.width * 0.86],
            extrapolate: 'clamp'
        })

        const martinTopSearchBar = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            outputRange: [0, -55],
            extrapolate: 'clamp'
        })

        const products = this.props.stateGetProducts.products ? this.props.stateGetProducts.products : [];

        return (
            <View style={styles.container}>
                <Animated.View style={[styles.header, {
                    height: headerHeight,
                }]}>
                    <Animated.View style={[styles.image_container, {
                        opacity: logoOpacity
                    }]}>
                        <Image
                            source={require('../assets/apps/logo-panda.png')}
                            style={styles.image}
                        />
                    </Animated.View>
                    <Animated.View
                        style={{
                            width: widthSearchBar,
                            marginTop: martinTopSearchBar
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('SearchScreen', {
                                navigation: this.props.navigation
                            })}
                            activeOpacity={1}
                            style={styles.section}>
                            <AntDesign style={styles.searchIcon} name='search1' size={20} color="#000" />
                            <TextInput
                                placeholder='What are you eating today?'
                                style={styles.text}
                                pointerEvents='none'
                                editable={false}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                    <CartIcon navigation={this.props.navigation} />
                </Animated.View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
                    )}
                >
                    <View style={styles.firstList}>
                        <View style={styles.rowTitle}>
                            <Text style={styles.title}>Featured dishes</Text>
                            <Text style={styles.showMore}
                                onPress={() => this.props.navigation.navigate('SearchScreen', {
                                    navigation: this.props.navigation,
                                    unFocusInput: true
                                })}>Show more</Text>
                        </View>
                        <FlatList
                            data={products.slice(0, 10)}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    {this.props.categories.map((item) => {
                        return (
                            <View key={item.id} style={styles.firstList}>
                                <View style={styles.rowTitle}>
                                    <Text style={styles.title}>{item.name}</Text>
                                    <Text style={styles.showMore}
                                        onPress={() => this.props.navigation.navigate('SearchScreen', {
                                            navigation: this.props.navigation,
                                            category: item,
                                            unFocusInput: true
                                        })}>Show more</Text>
                                </View>
                                <FlatList
                                    data={products.filter(prod => prod.categoryId === item.id)}
                                    renderItem={this.renderItem}
                                    keyExtractor={(item, index) => item.id.toString() + '-' + index.toString()}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    stateGetProducts: state.productReducer.getProducts,
    categories: state.systemReducer.categoryReducer
});

const mapDispatchToProps = dispatch => ({
    getProducts: () => dispatch(productActions.getProducts()),
    getCategories: () => dispatch(systemActions.getCategories())
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const dimensions = Dimensions.get('window');
var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    header: {
        backgroundColor: '#1ba8ff',
        flexDirection: 'row',
        width: '100%',
        paddingTop: Platform.OS === 'ios' ? 20 : 26,
        flexDirection: 'column'
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginTop: 15,
        marginHorizontal: 5,
        borderRadius: 5,
        backgroundColor: '#f2f2f2'
    },
    searchIcon: {
        padding: 2
    },
    text: {
        flex: 1,
        marginLeft: 10
    },
    firstList: {
        marginTop: 10,
        backgroundColor: 'white',
        paddingHorizontal: 10
    },
    rowTitle: {
        flexDirection: 'row',
        marginVertical: 10,
        marginBottom: 20
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        width: '70%'
    },
    showMore: {
        marginTop: 5,
        textAlign: 'right',
        color: '#014fa7',
        width: '30%'
    },
    image_container: {
        alignItems: "center"
    },
    image: {
        width: dimensions.width * 0.4,
        height: dimensions.width * 0.12,
        resizeMode: 'cover'
    }
});