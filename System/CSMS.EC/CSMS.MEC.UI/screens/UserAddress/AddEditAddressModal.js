import React from 'react';
import { View, StyleSheet, Platform, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, Modal } from 'react-native';
import { Button, Input, CheckBox } from 'react-native-elements';
import { AntDesign } from 'react-native-vector-icons';

import SelectAddressModal from './SelectAddressModel';
import { userService } from '../../services';

export default class AddEditAddressModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            id: 0,
            userId: 0,
            receiver: '',
            phoneNumber: '',
            province: '',
            district: '',
            ward: '',
            detail: '',
            isDefault: false,
            disabledCheckBox: false,
            loading: false,
            submitted: false,
            errorMessage: null
        }
    }

    componentDidMount = async () => {
        this.props.onRef(this);
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    openModal = async (address, userId) => {
        this.setState({
            modalVisible: true,
            id: address?.id,
            userId: userId,
            receiver: address?.receiver,
            phoneNumber: address?.phoneNumber,
            province: address?.province,
            district: address?.district,
            ward: address?.ward,
            detail: address?.detail,
            isDefault: address?.isDefault,
            disabledCheckBox: address?.isDefault,
        });
    }

    closeModal() {
        this.setState({
            modalVisible: false,
            loading: false
        });
    }

    async onSubmit() {
        this.setState({ submitted: true });

        var { id, userId, receiver, phoneNumber, province, district, ward, detail, isDefault } = this.state;
        if (!receiver || !phoneNumber || !province || !district || !ward || !detail) {
            return;
        }

        this.setState({ loading: true });

        const address = {
            id: id,
            userId: userId,
            receiver: receiver,
            phoneNumber: phoneNumber,
            country: 'Việt Nam',
            province: province,
            district: district,
            ward: ward,
            detail: detail,
            isDefault: isDefault,
        }

        const response = await userService.saveAddress(address);
        if (response.status === 200) {
            this.props.updateListAddress(response.data);
            this.closeModal();
        } else {
            this.setState({
                errorMessage: 'Cannot connect to server. Please check your internet.',
                loading: false
            });
        }
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}
                style={styles.container}
            >
                <View style={styles.header}>
                    <AntDesign
                        style={styles.back}
                        name="left"
                        color='#fff'
                        size={25}
                        onPress={() => this.closeModal()}
                    />
                    <View style={styles.section}>
                        <Text style={styles.title}>Shipping address</Text>
                    </View>
                </View>
                <ScrollView ref='scroll'>
                    <KeyboardAvoidingView behavior="padding" style={styles.content}>
                        <Text style={styles.inputTitle}>Receiver</Text>
                        <Input
                            value={this.state.receiver}
                            onChangeText={(text) => this.setState({ receiver: text })}
                            returnKeyType='next'
                            placeholder='Full name'
                            containerStyle={{ marginBottom: 10, height: 40, borderColor: '#fff' }}
                            inputStyle={{ fontSize: 16 }}
                            errorStyle={{ color: 'red', marginTop: -15, marginLeft: 0 }}
                            errorMessage={this.state.submitted && !this.state.receiver ? 'Please enter receiver' : ''}
                            onFocus={() => this.refs['scroll'].scrollTo({ y: 0 })}
                        />
                        <Text style={styles.inputTitle}>Phone number</Text>
                        <Input
                            value={this.state.phoneNumber}
                            onChangeText={(text) => this.setState({ phoneNumber: text })}
                            keyboardType='numeric'
                            returnKeyType='next'
                            placeholder='Phone number'
                            containerStyle={{ marginBottom: 10, height: 40 }}
                            inputStyle={{ fontSize: 16 }}
                            errorStyle={{ color: 'red', marginTop: -15, marginLeft: 0 }}
                            errorMessage={this.state.submitted && !this.state.phoneNumber ? 'Please enter phone number' : ''}
                            onFocus={() => this.refs['scroll'].scrollTo({ y: 40 })}
                        />
                        <Text style={styles.inputTitle}>Shipping address</Text>
                        <Input
                            value={this.state.detail}
                            onChangeText={(text) => this.setState({ detail: text })}
                            returnKeyType='next'
                            placeholder='Detail address'
                            containerStyle={{ marginBottom: 10, height: 40 }}
                            inputStyle={{ fontSize: 16 }}
                            errorStyle={{ color: 'red', marginTop: -15, marginLeft: 0 }}
                            errorMessage={this.state.submitted && !this.state.detail ? 'Please enter detail address' : ''}
                            onFocus={() => this.refs['scroll'].scrollTo({ y: 80 })}
                        />
                        <Text style={styles.inputTitle}>Province</Text>
                        <TouchableOpacity
                            onPress={() => this.child.openModel(null, null)}
                            activeOpacity={1}>
                            <Input
                                value={this.state.province}
                                placeholder='Province'
                                containerStyle={{ marginBottom: 10, height: 40 }}
                                inputStyle={{ fontSize: 16 }}
                                errorStyle={{ color: 'red', marginTop: -15, marginLeft: 0 }}
                                pointerEvents='none'
                                editable={false}
                                errorMessage={this.state.submitted && !this.state.province ? 'Please enter province' : ''}
                                rightIcon={
                                    <AntDesign
                                        name='down'
                                        size={18}
                                        color='gray'
                                    />
                                }
                            />
                        </TouchableOpacity>
                        <Text style={styles.inputTitle}>District</Text>
                        <TouchableOpacity
                            onPress={() => this.child.openModel(this.state.province, null)}
                            activeOpacity={1}>
                            <Input
                                value={this.state.district}
                                placeholder='District'
                                containerStyle={{ marginBottom: 10, height: 40 }}
                                inputStyle={{ fontSize: 16 }}
                                errorStyle={{ color: 'red', marginTop: -15, marginLeft: 0 }}
                                pointerEvents='none'
                                editable={false}
                                errorMessage={this.state.submitted && !this.state.district ? 'Please enter district' : ''}
                                rightIcon={
                                    <AntDesign
                                        name='down'
                                        size={18}
                                        color='gray'
                                    />
                                }
                            />
                        </TouchableOpacity>
                        <Text style={styles.inputTitle}>Ward</Text>
                        <TouchableOpacity
                            onPress={() => this.child.openModel(this.state.province, this.state.district)}
                            activeOpacity={1}>
                            <Input
                                value={this.state.ward}
                                placeholder='Ward'
                                containerStyle={{ marginBottom: 10, height: 40, marginBottom: 30 }}
                                inputStyle={{ fontSize: 16 }}
                                errorStyle={{ color: 'red', marginTop: -15, marginLeft: 0 }}
                                pointerEvents='none'
                                editable={false}
                                errorMessage={this.state.submitted && !this.state.ward ? 'Please enter ward' : ''}
                                rightIcon={
                                    <AntDesign
                                        name='down'
                                        size={18}
                                        color='gray'
                                    />
                                }
                            />
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </ScrollView>


                <View style={styles.footer}>
                    <CheckBox
                        title='Set default address'
                        containerStyle={{ backgroundColor: '#fff', borderColor: '#fff', marginBottom: 0, paddingBottom: 3, marginLeft: 5, width: '100%' }}
                        checkedColor={this.state.disabledCheckBox ? '#a6a6a6' : '#1ba8ff'}
                        disabled={this.state.disabledCheckBox}
                        checked={this.state.isDefault}
                        onPress={() => this.setState({ isDefault: !this.state.isDefault })}
                    />
                    {
                        this.state.errorMessage &&
                        <Text style={{ color: 'red', marginLeft: 10, paddingVertical: 5 }}>
                            {this.state.errorMessage}
                        </Text>
                    }
                    <Button
                        buttonStyle={styles.btnSave}
                        title='Delivery to this address'
                        loading={this.state.submitted && this.state.loading}
                        onPress={() => this.onSubmit()}
                    />
                </View>

                <SelectAddressModal
                    onRef={ref => (this.child = ref)}
                    onChange={(province, district, ward) =>
                        this.setState({
                            province: province,
                            district: district,
                            ward: ward
                        })
                    }
                />
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
        height: Platform.OS === 'ios' ? 75 : 60,
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
        width: '100%'
    },
    btnSave: {
        backgroundColor: '#ff424e',
        marginHorizontal: 12,
        marginVertical: 10
    },
    content: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    inputTitle: {
        marginBottom: 0,
        fontWeight: '300'
    }
});