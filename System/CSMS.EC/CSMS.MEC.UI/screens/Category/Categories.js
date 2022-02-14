import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import CartIcon from '../../components/CartIcon';
import { systemActions } from '../../redux/actions';
import { ApiController } from '../../commons/constants';
import { getApiUrl } from '../../configs/api.config';

class Categories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidMount = async () => {
        if (this.props.categories.length === 0) {
            await this.props.getCategories();
        }
    }

    _getPhotoUrl(categoryId) {
        return getApiUrl(ApiController.CdnApi.Categories) + categoryId + '?size=100';
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.section}>
                        <Text style={styles.title}>Categories</Text>
                    </View>

                    <CartIcon navigation={this.props.navigation} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}
                >
                    {this.props.categories.map((item, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.border}
                            activeOpacity={1}
                            onPress={() => this.props.navigation.navigate('SearchScreen', {
                                navigation: this.props.navigation,
                                category: item,
                                unFocusInput: true
                            })}
                        >
                            <View style={styles.content}>
                                <Image style={styles.image} source={{ uri: this._getPhotoUrl(item.id) }} />
                                <Text style={styles.textTitle}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                    }
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    categories: state.systemReducer.categoryReducer
})

const mapDispatchToProps = (dispatch) => ({
    getCategories: () => dispatch(systemActions.getCategories())
})

export default connect(mapStateToProps, mapDispatchToProps)(Categories);

const dimensions = Dimensions.get('window');
var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        backgroundColor: '#1ba8ff',
        height: Platform.OS === 'ios' ? 70 : 80,
        flexDirection: 'row',
        width: '100%',
        paddingTop: Platform.OS === 'ios' ? 0 : 7
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
    border: {
        width: dimensions.width / 3,
        height: dimensions.width / 3 + 20,
        paddingVertical: 15,
        paddingHorizontal: 15
    },
    content: {
        flex: 1
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    textTitle: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        paddingTop: 5
    }
});