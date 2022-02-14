import React from 'react';
import { View, StyleSheet, Platform, Modal, Text, ScrollView, TextInput } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from "react-native-vector-icons";
import { connect } from 'react-redux';
import { Button, CheckBox } from 'react-native-elements';

import Loader from '../../../../components/Loader';
import { voucherActions } from '../../../../redux/actions';
import VoucherDetailModal from './VoucherDetailModal';
import { voucherService } from '../../../../services';

class VoucherModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            loading: true,
            errorMessage: null,
            editable: true,
            code: '',
            loadingButton: false,
            voucherSelected: null
        }
    }

    componentDidMount() {
        this.props.onRef(this);
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    openModal = async (userId, voucher, editable = true) => {
        this.setState({
            modalVisible: true,
            editable: editable
        });

        if (!this.props.voucherReducer.vouchers) {
            const response = await this.props.getVouchers(userId);
            if (response.success) {
                this.setState({ loading: false });
            } else {
                this.setState({
                    loading: false,
                    errorMessage: 'Cannot connect to server. Please check your internet connection'
                });
            }
        } else {
            this.setState({ loading: false });
        }

        if (voucher) {
            this.setState({ voucherSelected: voucher });
        }
    }

    closeModal() {
        if (this.state.editable) {
            this.props.onChange(this.state.voucherSelected);
        }

        this.setState({ modalVisible: false });
    }

    onSearch = async () => {
        if (this.state.code?.length === 0) {
            return;
        }

        const response = await voucherService.getVoucherByCode(this.state.code);
        this.setState({ loadingButton: true });
        if (response && response.status === 200) {
            this.setState({
                voucherSelected: response.data,
                loadingButton: false
            });
            this.closeModal();
        } else {
            this.setState({
                loadingButton: false,
                errorMessage: 'Oops! Cannot find this voucher code. Please check the code and expiry date.'
            });
        }
    }

    onChoose(voucher) {
        if (this.state.voucherSelected && this.state.voucherSelected.id === voucher.id) {
            this.setState({ voucherSelected: null });
        } else {
            this.setState({ voucherSelected: voucher });
        }
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
                            <Text style={styles.title}>Vouchers</Text>
                        </View>
                    </View>
                    {this.state.loading && <Loader />}
                    {this.state.editable &&
                        <View style={{ marginHorizontal: 10, borderBottomColor: 'black', borderBottomWidth: .5 }}>
                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                <TextInput
                                    placeholder="Voucher code ..."
                                    style={{ color: '#000', padding: 5, borderColor: 'gray', borderWidth: .5, borderRadius: 3, width: '70%' }}
                                    value={this.state.code}
                                    returnKeyType="search"
                                    onChangeText={text => this.setState({ code: text })}
                                    onSubmitEditing={() => this.onSearch()}
                                />
                                <Button
                                    containerStyle={{ width: '30%', paddingLeft: 10 }}
                                    title='Apply'
                                    disabled={!this.state.code}
                                    loading={this.state.loadingButton}
                                    onPress={() => this.onSearch()}
                                />
                            </View>
                            {this.state.errorMessage && true &&
                                <Text style={{ color: 'red', marginBottom: 10, fontSize: 14, lineHeight: 20 }}>{this.state.errorMessage}</Text>
                            }
                        </View>
                    }
                    <View style={{ flex: 1, backgroundColor: '#fff', paddingVertical: 5 }}>
                        {this.props.voucherReducer.vouchers &&
                            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginBottom: this.state.editable ? 60 : 0 }}>
                                {this.props.voucherReducer.vouchers.map((item) => {
                                    return (
                                        <View key={item.id.toString()} style={styles.item}>
                                            <View style={{ width: '30%', backgroundColor: '#1ba8ff', alignItems: 'center', paddingVertical: 7 }}>
                                                <MaterialCommunityIcons
                                                    name="ticket-percent"
                                                    color="#fff"
                                                    size={50}
                                                />
                                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>
                                                    {item.eventTypeCode}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'column', marginLeft: 10, width: '70%' }}>
                                                <Text style={{ color: 'gray', fontSize: 16, marginVertical: 7 }}>
                                                    {item.title}
                                                </Text>
                                                <Text style={{ marginVertical: 3 }}>
                                                    Products: {item.appliedAllProducts ? 'All products' : 'Any products'}
                                                </Text>
                                                <Text style={{ color: 'red', marginVertical: 3 }}>
                                                    Expiry date : {item.endTime ? item.endTime : 'No limit'}
                                                </Text>
                                                <Text
                                                    style={{ position: 'absolute', right: 15, bottom: 10, color: "#1ba8ff" }}
                                                    onPress={() => this.voucherDetailModal.openModal(item)}
                                                >
                                                    Condition
                                                </Text>
                                                {this.state.editable &&
                                                    <CheckBox
                                                        containerStyle={{
                                                            backgroundColor: '#fff',
                                                            borderColor: '#fff',
                                                            marginLeft: 0,
                                                            width: 30,
                                                            position: 'absolute',
                                                            right: 15
                                                        }}
                                                        checked={this.state.voucherSelected === item}
                                                        onPress={() => this.onChoose(item)}
                                                    />
                                                }
                                            </View>
                                        </View>
                                    )
                                })}
                            </ScrollView>
                        }
                        {this.state.editable &&
                            <View style={styles.footer}>
                                <Button
                                    buttonStyle={styles.btn_footer}
                                    title='OK'
                                    onPress={() => this.closeModal()}
                                />
                            </View>
                        }
                    </View>

                    <VoucherDetailModal
                        onRef={ref => (this.voucherDetailModal = ref)}
                    />
                </Modal>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    voucherReducer: state.voucherReducer
});

const mapDispatchToProps = dispatch => ({
    getVouchers: (userId) => dispatch(voucherActions.getVouchers(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(VoucherModal);

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
    item: {
        flex: 1,
        paddingVertical: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '100%'
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10
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
});