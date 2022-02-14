import React from "react";
import { View, StyleSheet, Text, Dimensions, Image, StatusBar, Modal, Animated, Share } from "react-native";
import { Rating, Button } from "react-native-elements";
import { AntDesign } from "react-native-vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";

import CartIcon from "../../components/CartIcon";
import Review from "../../components/Review";
import AddToCartAlertModal from "../../components/modals/AddToCartAlertModal";
import CartModal from "../Cart/CartModal";
import AddEditReviewModal from '../Review/AddEditReviewModal';
import AllReviewsModal from '../Review/AllReviewsModal';
import AuthModal from '../Auth/AuthModal';
import { ApiController } from "../../commons/constants/api.controller";
import { getApiUrl } from "../../configs/api.config";
import { productActions, cartActions } from '../../redux/actions';
import { productService } from '../../services';

class DetailModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
            modalVisible: false,
            product: null,
            reviews: [],
            btnAddInsideHeight: 0
        };
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    openModal = async (product) => {
        this.setState({
            modalVisible: true,
            product: product,
            reviews: []
        });

        const response = await productService.getProductReviews(product.id, 1, 3);
        if (response.status === 200) {
            this.setState({
                reviews: response.data.items
            })
        }

        this.props.addViewedProduct(product);
    }

    closeModal() {
        this.setState({ modalVisible: false });
    }

    _getPhotoUrl() {
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

    _lovedProduct() {
        return this.state.product && this.props.lovedProducts.findIndex(item => item.id === this.state.product.id) >= 0
            ? true
            : false;
    }

    _getFullName() {
        let fullName = this.props.activeUser.firstName
            + ' ' + this.props.activeUser.middleName
            + ' ' + this.props.activeUser.lastName;
        return fullName.trim().replace('  ', ' ');
    }

    _calculateRatePercent(total) {
        if (!this.state.product.totalRate || this.state.product.totalRate === 0) {
            return '0%';
        }

        return Math.round(total / this.state.product.totalRate * 100) + '%';
    }

    onAddDeleteFavoriteProduct = () => {
        if (this._lovedProduct()) {
            this.props.deleteLovedProduct(this.state.product);
        } else {
            this.props.addLovedProduct(this.state.product);
        }
    }

    onShare = async () => {
        await Share.share({
            message: 'Panda food! ' + this.state.product.name + ` - Let's eat together`,
            url: 'http://52.74.41.113:30002/' + this.state.product.id
        });
    };

    onAddToCart() {
        this.props.addToCart(this.state.product, 1);
        this.alertAddCartModal.openModal(this.state.product);
    }

    onViewAllReview() {
        this.allReviewsModal.openModal(this.state.product);
    }

    onLayout = event => {
        if (this.state.dimensions) {
            return;
        }
        let { height } = event.nativeEvent.layout;
        this.setState({ btnAddInsideHeight: height });
    }

    onAddReview() {
        if (this.props.activeUser) {
            this.addReviewModal.openModal(this.state.product.id, this.props.activeUser.id, this._getFullName());
        } else {
            this.authModal.toggleModal();
        }
    }

    render() {
        const headerOpacity = this.state.scrollY.interpolate({
            inputRange: [0, dimensions.width * 0.6],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })
        const btnFooterOpacity = this.state.scrollY.interpolate({
            inputRange: [
                dimensions.width * 0.6 + this.state.btnAddInsideHeight + 70,
                dimensions.width * 0.6 + this.state.btnAddInsideHeight + 90
            ],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })

        return (
            this.state.product &&
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}
                style={styles.container}
            >
                <StatusBar barStyle="light-content" />
                <Animated.View style={[styles.header, { opacity: headerOpacity }]} />

                <AntDesign
                    style={styles.back}
                    name="close"
                    color='#fff'
                    size={25}
                    onPress={() => this.closeModal()}
                />

                <AntDesign
                    style={styles.btnShare}
                    name={'sharealt'}
                    color={'white'}
                    size={25}
                    onPress={() => this.onShare()}
                />

                <AntDesign
                    style={styles.heart}
                    name={this._lovedProduct() ? 'heart' : 'hearto'}
                    color={this._lovedProduct() ? 'red' : 'white'}
                    size={25}
                    onPress={() => this.onAddDeleteFavoriteProduct()}
                />

                <CartIcon
                    isModal={true}
                    navigation={this.props.navigation}
                    callback={() => this.closeModal()}
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.footer}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
                    )}
                >
                    <Image
                        source={{ uri: this._getPhotoUrl() }}
                        style={styles.image}
                    />
                    <View style={styles.content}>
                        <View style={{ paddingHorizontal: 15, backgroundColor: '#fff', marginBottom: 5 }}>
                            <Text numberOfLines={2} style={styles.textName}>
                                {this.state.product.name}
                            </Text>
                            <Text style={styles.textPrice}>{this.formatCurrency()}</Text>
                            <View style={{ flexDirection: "row" }}>
                                <Rating
                                    imageSize={14}
                                    readonly
                                    startingValue={this.state.product.rate}
                                    style={{ width: 70, marginTop: 5 }}
                                />
                                <Text style={styles.textViewAllReview}
                                    onPress={() => this.onViewAllReview()}
                                >
                                    {'(VIEW  ' + this.state.product.totalRate + ' COMMENTS)'}
                                </Text>
                            </View>
                            <Text style={styles.textDetail}>
                                {this.state.product.shortDescription}
                            </Text>

                            <Button
                                buttonStyle={{ backgroundColor: '#ff424e', marginVertical: 10 }}
                                title='Add to cart'
                                onPress={() => this.onAddToCart()}
                                onLayout={this.onLayout}
                            />
                        </View>
                        <View style={{ paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#fff', marginBottom: 5 }}>
                            <Text style={styles.titleDescription}>Detailed description</Text>
                            <Text style={styles.textDetail}>
                                {this.state.product.description}
                            </Text>
                        </View>

                        <View style={{ backgroundColor: '#fff', paddingVertical: 10 }}>
                            <View style={{ flexDirection: 'row', paddingHorizontal: 15, marginBottom: 5 }}>
                                <Text style={styles.textReview}>Reviews</Text>
                                <Text style={{ fontSize: 12, color: '#2089dc', marginTop: 5, position: 'absolute', right: 15 }}
                                    onPress={() => this.onViewAllReview()}
                                >
                                    {'VIEW ALL COMMENTS'}
                                </Text>
                            </View>
                            <View style={styles.review_container}>
                                <View style={styles.review_score}>
                                    <Text style={styles.textScore}>
                                        {this.state.product.rate + '/5'}
                                    </Text>
                                    <Rating
                                        imageSize={18}
                                        readonly
                                        startingValue={this.state.product.rate}
                                    />
                                    <Text style={styles.textTotalReview}>
                                        {this.state.product.totalRate}{" "}
                                        {this.state.product.totalRate < 2 ? "review" : "reviews"}
                                    </Text>
                                </View>
                                <View style={styles.review_detail}>
                                    {this.state.product.totalRateDetail.map((item, index) => {
                                        const total = this.state.product.totalRateDetail[5 - index - 1];
                                        return (
                                            <View key={index} style={{ flexDirection: "row", marginLeft: 25 }}>
                                                <Rating
                                                    imageSize={12}
                                                    readonly
                                                    startingValue={5 - index}
                                                    style={styles.star_review_detail}
                                                />
                                                <Text style={styles.textDetailReview}>{this._calculateRatePercent(total)}</Text>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>

                            {this.state.reviews.map((item) => {
                                return (
                                    <Review key={item.id} review={item} />
                                )
                            })}

                            <View style={styles.btnReview}>
                                <Text style={{ fontSize: 12, color: '#2089dc', textAlign: 'center' }}
                                    onPress={() => this.onViewAllReview()}
                                >
                                    {'VIEW ALL ' + this.state.product.totalRate + ' COMMENTS'}
                                </Text>
                            </View>

                            <View style={[styles.btnReview, { paddingBottom: 40 }]}>
                                <Button
                                    title="Write your review"
                                    type="outline"
                                    onPress={() => this.onAddReview()}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <Animated.View style={[styles.btn_footer, { opacity: btnFooterOpacity }]}>
                    <Button
                        buttonStyle={styles.btn_add}
                        title='Add to cart'
                        onPress={() => this.onAddToCart()}
                    />
                </Animated.View>

                <AddToCartAlertModal
                    onRef={ref => (this.alertAddCartModal = ref)}
                    navigation={this.props.navigation}
                    onGoToCart={() => this.cartModal.toggleModal()}
                />

                <CartModal
                    navigation={this.props.navigation}
                    onRef={ref => (this.cartModal = ref)}
                />

                <AddEditReviewModal
                    navigation={this.props.navigation}
                    onRef={ref => (this.addReviewModal = ref)}
                />

                <AllReviewsModal
                    navigation={this.props.navigation}
                    onRef={ref => (this.allReviewsModal = ref)}
                />

                <AuthModal
                    navigation={this.props.navigation}
                    onRef={ref => (this.authModal = ref)}
                />
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    lovedProducts: state.productReducer.lovedProducts,
    activeUser: state.userReducer.getUser.userDetails,
});

const mapDispatchToProps = dispatch => ({
    addToCart: (product, units) => dispatch(cartActions.addToCart(product, units)),
    addViewedProduct: (product) => dispatch(productActions.addViewedProduct(product)),
    addLovedProduct: (product) => dispatch(productActions.addLovedProduct(product)),
    deleteLovedProduct: (product) => dispatch(productActions.deleteLovedProduct(product)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailModal);

const dimensions = Dimensions.get('window');

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    footer: {
        backgroundColor: '#f2f2f2'
    },
    image: {
        width: '100%',
        height: dimensions.width * 0.6,
        resizeMode: 'cover',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    back: {
        position: "absolute",
        left: 0,
        marginTop: Platform.OS === 'ios' ? 30 : 18,
        marginLeft: 15,
        zIndex: 2
    },
    heart: {
        position: "absolute",
        right: 0,
        marginTop: Platform.OS === 'ios' ? 30 : 18,
        marginRight: 100,
        zIndex: 2
    },
    btnShare: {
        position: "absolute",
        right: 0,
        marginTop: Platform.OS === 'ios' ? 30 : 18,
        marginRight: 60,
        zIndex: 2
    },
    header: {
        backgroundColor: '#1ba8ff',
        height: Platform.OS === 'ios' ? 75 : 60,
        flexDirection: 'row',
        width: '100%',
        position: 'absolute',
        zIndex: 2
    },
    cart: {
        position: "absolute",
        right: 0,
        marginTop: 30,
        marginRight: 20
    },
    textPrice: {
        color: "#1ba8ff",
        fontWeight: "bold",
        fontSize: 26,
        marginTop: 5
    },
    textName: {
        color: "#3e3c3e",
        fontWeight: "bold",
        fontSize: 30,
        marginTop: 5
    },
    textDetail: {
        color: "gray",
        marginTop: 10,
        lineHeight: 20
    },
    titleDescription: {
        fontSize: 18,
        color: "#1ba8ff",
        fontWeight: "bold"
    },
    textReview: {
        fontSize: 18,
        color: "#1ba8ff",
        fontWeight: "bold",
        marginBottom: 5
    },
    review_container: {
        flexDirection: "row",
        paddingBottom: 15
    },
    review_score: {
        flexDirection: "column",
        width: "50%",
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 0.4,
        borderColor: "#c7c7c7"
    },
    review_detail: {
        width: "50%"
    },
    star_review_detail: {
        marginVertical: 4,
        marginRight: 30
    },
    textScore: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#157cdb",
        marginVertical: 5
    },
    textTotalReview: {
        marginVertical: 15,
        color: "gray"
    },
    textDetailReview: {
        color: "gray"
    },
    btnReview: {
        marginTop: 15,
        paddingTop: 15,
        paddingHorizontal: 15,
        borderTopColor: '#d4d4d4',
        borderTopWidth: 0.5
    },
    btn_footer: {
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTopColor: '#d4d4d4',
        borderTopWidth: 0.5
    },
    btn_add: {
        backgroundColor: '#ff424e',
        marginHorizontal: 12,
        marginVertical: 10
    },
    content: {
        marginBottom: 20,
        backgroundColor: '#f2f2f2',
    },
    textViewAllReview: {
        color: "#2089dc",
        width: 200,
        marginTop: 3,
        marginLeft: 10,
        fontSize: 12
    }
});
