import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { AntDesign } from 'react-native-vector-icons';

import PersonalInfo from './PersonalInfo';
import ChangePassword from './ChangePassword';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

export default class UserInfo extends React.Component {

    componentDidMount() {
        if (Platform.OS === 'android') {
            startHeaderHeight = 90 + StatusBar.currentHeight;
        }
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
                        <Text style={styles.title}>Account Information</Text>
                    </View>
                </View>

                <View style={styles.tabbar}>
                    <ScrollableTabView
                        tabBarActiveTextColor='#157cdb'

                        renderTabBar={() =>
                            <DefaultTabBar
                                underlineStyle={{
                                    backgroundColor: '#157cdb'
                                }}
                            />}
                    >
                        <PersonalInfo tabLabel='Personal information' navigation={this.props.navigation} />
                        <ChangePassword tabLabel='Change password' navigation={this.props.navigation} />
                    </ScrollableTabView>
                </View>
            </View>
        )
    }
}

var startHeaderHeight = 70;
var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        backgroundColor: '#1ba8ff',
        height: startHeaderHeight,
        flexDirection: 'row',
        width: '100%'
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 25,
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
    tabbar: {
        flex: 1,
        marginTop: 0
    },
    back: {
        marginTop: 30,
        width: '15%',
        textAlign: 'center',
        zIndex: 2
    }
});