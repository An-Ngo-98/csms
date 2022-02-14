import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import CartIcon from '../../components/CartIcon';
import EmptyContent from '../../components/EmptyContent';

export default class Notifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.section}>
                        <Text style={styles.title}>Notifications</Text>
                    </View>

                    <CartIcon navigation={this.props.navigation} />
                </View>

                {this.state.notifications.length === 0 &&
                    <EmptyContent navigation={this.props.navigation} content='notification' />
                }
            </View>
        )
    }
}

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
    }
});