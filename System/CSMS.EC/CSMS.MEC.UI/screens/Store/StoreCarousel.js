import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, ImageBackground, Linking } from 'react-native';
import Carousel from 'react-native-anchor-carousel';
import { Button } from "react-native-elements";

import { getApiUrl } from '../../configs/api.config';
import { ApiController } from '../../commons/constants';

export default class ImageCarousel extends React.Component {
    _getPhotoUrl(storeId) {
        return getApiUrl(ApiController.CdnApi.Stores) + storeId + "?size=300";
    }

    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.item}
                onPress={() => this.numberCarousel.scrollToIndex(index)}
            >
                <ImageBackground source={{ uri: this._getPhotoUrl(item.id) }} style={styles.imageBackground}>
                    <View style={styles.rightTextContainer}>
                        <Text style={styles.rightText}>Open Time: {item.openTime}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.lowerContainer}>
                    <Text style={styles.titleText}>{item.name}</Text>
                    <Text style={styles.contentText}>{item.address}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5, marginBottom: 5 }}>
                    <Button
                        title="Menu"
                        buttonStyle={{
                            paddingHorizontal: 20,
                            paddingVertical: 5,
                            marginRight: 5
                        }}
                        titleStyle={{ fontSize: 14 }}
                        onPress={() =>
                            this.props.navigation.navigate('SearchScreen', {
                                navigation: this.props.navigation,
                                branch: item,
                                unFocusInput: true
                            })
                        }
                    />
                    <Button
                        title="Directions"
                        buttonStyle={{
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            marginRight: 5,
                            backgroundColor: '#ff424e'
                        }}
                        titleStyle={{ fontSize: 14 }}
                        onPress={() => {
                            Platform.select({
                                ios: () => {
                                    Linking.openURL('http://maps.apple.com/maps?daddr=' + item.latitude + ',' + item.longitude);
                                },
                                android: () => {
                                    Linking.openURL('http://maps.google.com/maps?daddr=' + item.latitude + ',' + item.longitude);
                                }
                            })();
                        }}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    onChange(data) {
        this.props.onChange(data.latitude, data.longitude);
    }

    render() {
        return (
            <Carousel
                style={styles.carousel}
                data={this.props.stores}
                renderItem={this.renderItem}
                itemWidth={0.7 * width}
                inActiveOpacity={0.3}
                containerWidth={width}
                ref={c => {
                    this.numberCarousel = c;
                }}
                onScrollEnd={(data) => this.onChange(data)}
            />
        );
    }
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    carousel: {
        flex: 1,
        backgroundColor: '#141518',
    },
    item: {
        borderWidth: 2,
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        borderColor: 'white',
        elevation: 3
    },
    imageBackground: {
        flex: 2,
        backgroundColor: '#EBEBEB',
        borderWidth: 5,
        borderColor: 'white',
    },
    rightTextContainer: {
        marginLeft: 'auto',
        marginRight: -2,
        backgroundColor: 'rgba(49, 49, 51,0.5)',
        padding: 3,
        marginTop: 3,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    rightText: {
        color: 'white'
    },
    lowerContainer: {
        flex: 1,
        marginHorizontal: 10
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 2
    },
    contentText: {
        fontSize: 12,
    },
});
