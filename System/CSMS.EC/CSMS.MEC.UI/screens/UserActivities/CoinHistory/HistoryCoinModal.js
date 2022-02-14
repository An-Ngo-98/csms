import React from 'react';
import { View, StyleSheet, Modal, Text } from 'react-native';
import { AntDesign } from "react-native-vector-icons";
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

import HistoryCoinDetailTab from './HistoryCoinDetailTab';
import { userService } from '../../../services/users.service';
import Loader from '../../../components/Loader';

export default class HistoryCoinModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            loading: true,
            coins: 0
        }
    }

    componentDidMount() {
        this.props.onRef(this);
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    openModal = async (coins, userId) => {
        this.setState({
            modalVisible: true,
            coins: coins,
            loading: true
        });

        const response = await userService.getUserCoinHistory(userId);
        if (response.status === 200) {
            this.setState({
                activities: response.data,
                loading: false
            })
        }
    }

    closeModal() {
        this.setState({ modalVisible: false });
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
                        <Text style={styles.title}>Coins History</Text>
                    </View>
                </View>

                {this.state.loading && <Loader />}

                <View style={{ alignItems: 'center', width: '100%', backgroundColor: '#fff6e2', paddingVertical: 10 }}>
                    <Text style={{ color: '#f6a700', fontSize: 26, fontWeight: 'bold' }}>{this.state.coins}</Text>
                    <Text style={{ color: '#f6a700', fontSize: 16, paddingVertical: 5 }}>
                        {this.state.coins > 1 ? 'coins available' : 'coin available'}
                    </Text>
                </View>

                {!this.state.loading &&
                    <ScrollableTabView
                        tabBarActiveTextColor='#157cdb'
                        renderTabBar={() => <DefaultTabBar underlineStyle={{ backgroundColor: '#157cdb' }} />}
                    >
                        <HistoryCoinDetailTab
                            tabLabel={'All History'}
                            activities={this.state.activities}
                        />
                        <HistoryCoinDetailTab
                            tabLabel={'Earnings'}
                            activities={this.state.activities.filter(item => item.isEarned === true)}
                        />
                        <HistoryCoinDetailTab
                            tabLabel={'Spendings'}
                            activities={this.state.activities.filter(item => item.isUsed === true)}
                        />
                    </ScrollableTabView>
                }
            </Modal>
        )
    }
}

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
    }
});