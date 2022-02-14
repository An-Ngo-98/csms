import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';

export default class EmptyContent extends React.Component {

    onGoShopping() {
        if(typeof this.props.closeModal  === "function") {
            this.props.closeModal();
        } else {
            this.props.navigation.navigate('HomeScreen');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    source={require('../assets/apps/super-panda.png')}
                    style={styles.image}
                    resizeMode='cover'
                />
                <Text style={styles.text}>You haven't had any {this.props.content}</Text>
                {!this.props.hideButton &&
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.onGoShopping()}
                        underlayColor='#fff'>
                        <Text style={styles.textButton}>Continue shopping</Text>
                    </TouchableOpacity>
                }
            </View>
        );
    }
}

const dimensions = Dimensions.get('screen');
var styles = StyleSheet.create({
    container: {
        // justifyContent: 'center',
        alignItems: 'center',
        height: dimensions.height
    },
    image: {
        width: dimensions.width * 0.45,
        height: dimensions.width * 0.4,
        marginTop: dimensions.width * 0.1
    },
    text: {
        marginTop: 25,
        fontSize: 16
    },
    button: {
        borderRadius: 5,
        borderColor: 'black',
        borderStyle: "solid"
    },
    button: {
        marginHorizontal: 20,
        marginTop: 35,
        paddingVertical: 10,
        paddingVertical: 15,
        width: '85%',
        backgroundColor: '#ff424e',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    textButton: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
    }
});