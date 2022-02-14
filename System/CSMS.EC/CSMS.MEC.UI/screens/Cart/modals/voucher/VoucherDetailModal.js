import React from 'react';
import { View, StyleSheet, Platform, Modal, Text, ScrollView } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from "react-native-vector-icons";

import { Button } from 'react-native-elements';

export default class VoucherDetailModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            loading: true,
            errorMessage: null,
            voucher: ''
        }
    }

    componentDidMount() {
        this.props.onRef(this);
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    openModal(voucher) {
        this.setState({
            voucher: voucher,
            modalVisible: true
        });
    }

    closeModal() {
        this.setState({ modalVisible: false });
    }

    getTimeRange() {
        let result = '';
        if (this.state.voucher.startTime) {
            result = this.state.voucher.startTime + ' - ';
        }
        if (this.state.voucher.endTime) {
            result += this.state.voucher.endTime;
        } else {
            result += 'No limit';
        }

        return result;
    }

    render() {
        return (
            <View>
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
                            <Text style={styles.title}>Voucher Details</Text>
                        </View>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginBottom: 60 }}>
                        <View style={styles.item}>
                            <View style={{ width: '30%', backgroundColor: '#1ba8ff', alignItems: 'center', paddingVertical: 7 }}>
                                <MaterialCommunityIcons
                                    name="ticket-percent"
                                    color="#fff"
                                    size={50}
                                />
                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>
                                    {this.state.voucher.eventTypeCode}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'column', paddingLeft: 10, width: '70%' }}>
                                <Text style={{ color: 'gray', fontSize: 16, marginVertical: 7 }}>
                                    {this.state.voucher.title}
                                </Text>
                                <Text style={{ marginVertical: 3 }}>
                                    Products: {this.state.voucher.appliedAllProducts ? 'All products' : 'Any products'}
                                </Text>
                                <Text style={{ color: 'red', marginVertical: 3 }}>
                                    Expiry date : {this.state.voucher.endTime ? this.state.voucher.endTime : 'No limit'}
                                </Text>
                            </View>
                        </View>
                        <View style={{ marginHorizontal: 15 }}>
                            <Text style={styles.condition}>Promotion</Text>
                            <Text style={styles.detail}>{this.state.voucher.title}</Text>
                            <Text style={styles.condition}>Time takes place</Text>
                            <Text style={styles.detail}>{this.getTimeRange()}</Text>
                            <Text style={styles.condition}>Devices</Text>
                            <Text style={styles.detail}>{this.state.voucher.devices ? this.state.voucher.devices.join(', ') : ''}</Text>
                            <Text style={styles.condition}>Condition</Text>
                            <Text style={styles.detail}>{this.state.voucher.description}</Text>
                        </View>
                    </ScrollView>
                    <View style={styles.footer}>
                        <Button
                            buttonStyle={styles.btn_footer}
                            title='Agree'
                            onPress={() => this.closeModal()}
                        />
                    </View>
                </Modal>
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
    footer: {
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTopColor: '#d4d4d4',
        borderTopWidth: 0.5
    },
    btn_footer: {
        backgroundColor: '#ff424e',
        marginHorizontal: 12,
        marginVertical: 10
    },
    item: {
        flex: 1,
        marginVertical: 15,
        marginHorizontal: 10,
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '96%',
        borderWidth: .5,
        borderRadius: 10,
        borderColor: 'grey',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 5
    },
    condition: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 25
    },
    detail: {
        fontSize: 14,
        color: 'gray',
        lineHeight: 25
    }
});