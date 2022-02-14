import React from 'react';
import { View, StyleSheet, StatusBar, Modal, ImageBackground } from 'react-native';
import { AntDesign } from 'react-native-vector-icons';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

import SignIn from './tabs/SignIn';
import SignUp from './tabs/SignUp';

export default class AuthModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        }
    }

    componentDidMount() {
        this.props.onRef(this);
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    toggleModal() {
        this.setState({ modalVisible: !this.state.modalVisible });
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}>
                <View
                    showsVerticalScrollIndicator={false}
                    style={styles.container}
                >
                    <StatusBar barStyle='light-content' />
                    <ImageBackground
                        source={require('../../assets/headers/header_auth.png')}
                        style={styles.imageBackground}
                    >
                        <View style={styles.close}>
                            <AntDesign
                                name="close"
                                color='#fff'
                                size={25}
                                onPress={() => this.toggleModal()}
                            />
                        </View>
                    </ImageBackground>

                    <View style={styles.footer}>
                        <ScrollableTabView
                            tabBarActiveTextColor='#157cdb'
                            renderTabBar={() =>
                                <DefaultTabBar
                                    underlineStyle={{
                                        backgroundColor: '#157cdb'
                                    }}
                                />}
                        >
                            <SignIn
                                tabLabel='Sign in'
                                navigation={this.props.navigation}
                                closeModal={() => this.toggleModal()}
                            />
                            <SignUp
                                tabLabel='Sign up'
                                navigation={this.props.navigation}
                                closeModal={() => this.toggleModal()}
                            />
                        </ScrollableTabView>
                    </View>
                </View>
            </Modal>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    imageBackground: {
        flex: 1,
        alignItems: 'center'
    },
    footer: {
        flex: 4
    },
    close: {
        position: 'absolute',
        left: 0,
        marginTop: 40,
        marginLeft: 25,
        color: 'black'
    }
});