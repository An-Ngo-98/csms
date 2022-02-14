import React from 'react';
import { View, StyleSheet, Platform, Modal, Text, Animated, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AntDesign } from "react-native-vector-icons";
import { ScrollView } from 'react-native-gesture-handler';

import Loader from '../../components/Loader';
import { productService } from '../../services';
import Review from '../../components/Review';

export default class AllReviewsModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
            modalVisible: false,
            loading: true,
            reviews: [],
            productId: 0,
            total: 0,
            page: 1,
            filterType: FilterType.All
        }
    }

    componentDidMount = async () => {
        this.props.onRef(this);
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    openModal(product) {
        this.setState({
            modalVisible: true,
            loading: true,
            reviews: [],
            productId: product.id,
            total: product.totalRate,
            page: 1,
            filterType: FilterType.All
        }, () => {
            this.loadReviews();
        });
    }

    loadReviews = async (productId = this.state.productId, page = this.state.page, pageSize = 10, filterType = this.state.filterType) => {
        if (this.state.total > this.state.reviews.length) {
            const response = await productService.getProductReviews(productId, page, pageSize, filterType);
            if (response.status === 200) {
                this.setState({
                    reviews: this.state.reviews.concat(response.data.items),
                    loading: false,
                    page: this.state.page + 1,
                    total: response.data.totalCount
                })
            }
        } else {
            this.setState({ loading: false });
        }
    }

    closeModal() {
        this.setState({
            modalVisible: false
        });
    }

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 50
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
    }

    onChangeFilter(filterType) {
        this.setState({
            loading: true,
            reviews: [],
            filterType: filterType,
            page: 1,
            total: 999999
        }, () => {
            this.loadReviews();
        })
    }

    render() {
        return (
            <View>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalVisible}
                    style={styles.container}>

                    <View style={styles.header}>
                        <AntDesign
                            style={styles.back}
                            name="close"
                            color='#fff'
                            size={25}
                            onPress={() => this.closeModal()}
                        />
                        <View style={styles.section}>
                            <Text style={styles.title}>Reviews</Text>
                        </View>
                    </View>

                    <View style={{ width: '100%', flex: 1 }}>
                        <ScrollView
                            scrollEventThrottle={16}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                                {
                                    listener: event => {
                                        if (Platform.OS === 'android' && this.isCloseToBottom(event.nativeEvent)) {
                                            this.loadReviews()
                                        }
                                    }
                                }
                            )}
                            onMomentumScrollEnd={({ nativeEvent }) => {
                                if (Platform.OS === 'ios' && this.isCloseToBottom(nativeEvent)) {
                                    this.loadReviews()
                                }
                            }}
                        >
                            {!this.state.loading &&
                                <View style={{ width: '100%', paddingVertical: 5, borderBottomWidth: 1.5, borderBottomColor: '#d4d4d4' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '33%' }}>
                                            <TouchableOpacity
                                                style={[styles.touchKey, {
                                                    backgroundColor: this.state.filterType === FilterType.All ? '#1ba8ff' : "#f0f0f0"
                                                }]}
                                                onPress={() => this.onChangeFilter(FilterType.All)}
                                            >
                                                <Text style={{
                                                    textAlign: 'center',
                                                    color: this.state.filterType === FilterType.All ? '#fff' : "#000"
                                                }}>
                                                    All
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ width: '33%' }}>
                                            <TouchableOpacity
                                                style={[styles.touchKey, {
                                                    backgroundColor: this.state.filterType === FilterType.Purchased ? '#1ba8ff' : "#f0f0f0"
                                                }]}
                                                onPress={() => this.onChangeFilter(FilterType.Purchased)}
                                            >
                                                <Text style={{
                                                    textAlign: 'center',
                                                    color: this.state.filterType === FilterType.Purchased ? '#fff' : "#000"
                                                }}
                                                >
                                                    Have enjoyed
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ width: '33%' }}>
                                            <TouchableOpacity
                                                style={[styles.touchKey, {
                                                    backgroundColor: this.state.filterType === FilterType.HasPhoto ? '#1ba8ff' : "#f0f0f0"
                                                }]}
                                                onPress={() => this.onChangeFilter(FilterType.HasPhoto)}
                                            >
                                                <Text style={{
                                                    textAlign: 'center',
                                                    color: this.state.filterType === FilterType.HasPhoto ? '#fff' : "#000"
                                                }}>
                                                    Include photo
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '20%' }}>
                                            <TouchableOpacity
                                                style={[styles.touchKey, {
                                                    backgroundColor: this.state.filterType === FilterType.FiveStar ? '#1ba8ff' : "#f0f0f0"
                                                }]}
                                                onPress={() => this.onChangeFilter(FilterType.FiveStar)}
                                            >
                                                <Text style={{
                                                    textAlign: 'center',
                                                    color: this.state.filterType === FilterType.FiveStar ? '#fff' : "#000"
                                                }}>
                                                    5 stars
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ width: '20%' }}>
                                            <TouchableOpacity
                                                style={[styles.touchKey, {
                                                    backgroundColor: this.state.filterType === FilterType.FourStar ? '#1ba8ff' : "#f0f0f0"
                                                }]}
                                                onPress={() => this.onChangeFilter(FilterType.FourStar)}
                                            >
                                                <Text style={{
                                                    textAlign: 'center',
                                                    color: this.state.filterType === FilterType.FourStar ? '#fff' : "#000"
                                                }}>
                                                    4 stars
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ width: '20%' }}>
                                            <TouchableOpacity
                                                style={[styles.touchKey, {
                                                    backgroundColor: this.state.filterType === FilterType.ThreeStar ? '#1ba8ff' : "#f0f0f0"
                                                }]}
                                                onPress={() => this.onChangeFilter(FilterType.ThreeStar)}
                                            >
                                                <Text style={{
                                                    textAlign: 'center',
                                                    color: this.state.filterType === FilterType.ThreeStar ? '#fff' : "#000"
                                                }}>
                                                    3 stars
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ width: '20%' }}>
                                            <TouchableOpacity
                                                style={[styles.touchKey, {
                                                    backgroundColor: this.state.filterType === FilterType.TwoStar ? '#1ba8ff' : "#f0f0f0"
                                                }]}
                                                onPress={() => this.onChangeFilter(FilterType.TwoStar)}
                                            >
                                                <Text style={{
                                                    textAlign: 'center',
                                                    color: this.state.filterType === FilterType.TwoStar ? '#fff' : "#000"
                                                }}>
                                                    2 stars
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ width: '20%' }}>
                                            <TouchableOpacity
                                                style={[styles.touchKey, {
                                                    backgroundColor: this.state.filterType === FilterType.OneStar ? '#1ba8ff' : "#f0f0f0"
                                                }]}
                                                onPress={() => this.onChangeFilter(FilterType.OneStar)}
                                            >
                                                <Text style={{
                                                    textAlign: 'center',
                                                    color: this.state.filterType === FilterType.OneStar ? '#fff' : "#000"
                                                }}>
                                                    1 star
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            }

                            {this.state.reviews.map((item) => {
                                return (
                                    <Review key={item.id} review={item} />
                                )
                            })}

                            {this.state.total === this.state.reviews.length && !this.state.loading &&
                                <Text style={{ color: 'gray', paddingVertical: 15, textAlign: 'center', borderTopColor: '#d4d4d4', borderTopWidth: 0.5 }}>
                                    You have viewed all reviews
                                </Text>
                            }

                            {this.state.total > this.state.reviews.length && !this.state.loading &&
                                <View style={{ width: '100%', justifyContent: 'center', paddingVertical: 15, borderTopColor: '#d4d4d4', borderTopWidth: 0.5 }}>
                                    <ActivityIndicator color="gray" size="small" />
                                </View>
                            }
                        </ScrollView>

                        {this.state.loading && <Loader />}
                    </View>
                </Modal>
            </View>
        )
    }
}

const FilterType = Object.freeze({
    'All': 0,
    'OneStar': 1,
    'TwoStar': 2,
    'ThreeStar': 3,
    'FourStar': 4,
    'FiveStar': 5,
    'HasPhoto': 6,
    'Purchased': 7
})

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        backgroundColor: '#1ba8ff',
        height: Platform.OS === 'ios' ? 70 : 60,
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
    touchKey: {
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 8,
        marginHorizontal: 5,
        marginVertical: 6
    }
});