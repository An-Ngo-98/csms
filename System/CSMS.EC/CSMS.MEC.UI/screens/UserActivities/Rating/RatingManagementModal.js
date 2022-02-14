import React from 'react';
import { View, StyleSheet, ScrollView, Modal, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from "react-native-vector-icons";

import Loader from '../../../components/Loader';
import { productService } from '../../../services';
import Review from '../../../components/Review';

export default class RatingManagementModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            loading: true,
            ratings: null,
            ratings_temp: null,
            filterType: FilterType.All
        }
    }

    componentDidMount() {
        this.props.onRef(this);
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    openModal = async (userId) => {
        this.setState({ modalVisible: true, loading: true });

        const response = await productService.getUserReviews(userId);
        if (response.status === 200) {
            this.setState({
                ratings: response.data,
                ratings_temp: response.data,
                filterType: FilterType.All,
                loading: false
            });
        }
    }

    closeModal() {
        this.setState({ modalVisible: false });
    }

    onChangeFilter(filterType) {
        this.setState({
            loading: true,
            filterType: filterType
        });

        switch (filterType) {
            case FilterType.All:
                this.setState({
                    ratings: this.state.ratings_temp,
                    loading: false
                });
                break;

            case FilterType.OneStar:
                this.setState({
                    ratings: this.state.ratings_temp.filter(item => item.score === 1),
                    loading: false
                });
                break;

            case FilterType.TwoStar:
                this.setState({
                    ratings: this.state.ratings_temp.filter(item => item.score === 2),
                    loading: false
                });
                break;

            case FilterType.ThreeStar:
                this.setState({
                    ratings: this.state.ratings_temp.filter(item => item.score === 3),
                    loading: false
                });
                break;

            case FilterType.FourStar:
                this.setState({
                    ratings: this.state.ratings_temp.filter(item => item.score === 4),
                    loading: false
                });
                break;

            case FilterType.FiveStar:
                this.setState({
                    ratings: this.state.ratings_temp.filter(item => item.score === 5),
                    loading: false
                });
                break;
        }
    }

    render() {
        return (
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
                        <Text style={styles.title}>My Rating</Text>
                    </View>
                </View>

                {this.state.loading && <Loader />}

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
                                        {'All (' + this.state.ratings_temp.length + ')'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '33%' }}>
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
                                        {'5 stars (' + this.state.ratings_temp.filter(item => item.score === 5).length + ')'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '33%' }}>
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
                                        {'4 stars (' + this.state.ratings_temp.filter(item => item.score === 4).length + ')'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>

                            <View style={{ width: '33%' }}>
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
                                        {'3 stars (' + this.state.ratings_temp.filter(item => item.score === 3).length + ')'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '33%' }}>
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
                                        {'2 stars (' + this.state.ratings_temp.filter(item => item.score === 2).length + ')'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '33%' }}>
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
                                        {'1 star (' + this.state.ratings_temp.filter(item => item.score === 1).length + ')'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
                <ScrollView style={{ backgroundColor: '#f2f2f2' }}>
                    {this.state.ratings?.map((item, index) => {
                        return (
                            <Review key={index + (new Date().toString())} review={item} />
                        )
                    })}
                </ScrollView>
            </Modal>
        )
    }
}

const FilterType = Object.freeze({
    'All': 0,
    'OneStar': 1,
    'TwoStar': 2,
    'ThreeStar': 3,
    'FourStar': 4,
    'FiveStar': 5
});

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