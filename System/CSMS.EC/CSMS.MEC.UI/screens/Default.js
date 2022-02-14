import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { AntDesign } from 'react-native-vector-icons';

export default class Default extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

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
                        <Text style={styles.title}>Default</Text>
                    </View>
                </View>
                <View>

                </View>
            </View>
        )
    }
}

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
    }
});