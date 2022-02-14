import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

export default class NotFound extends React.Component {
    render() {
        const { content = 'product'} = this.props;
        return (
            <View style={styles.container}>
                <Image
                    source={require('../assets/apps/sad-panda.png')}
                    style={styles.image}
                    resizeMode='cover'
                />
                <Text style={styles.text}>No {content} found</Text>
            </View>
        );
    }
}

const width = Dimensions.get('screen').width;
var styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width * 0.6,
        height: width * 0.4,
        marginTop: width * 0.2
    },
    text: {
        marginTop: 25,
        fontSize: 16,
        color: 'gray'
    }
});