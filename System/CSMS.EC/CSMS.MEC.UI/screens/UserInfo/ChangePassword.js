import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Input, Button } from 'react-native-elements';
import DatePickerModel from '../../components/commons/DatePickerModel';
import { connect } from 'react-redux';

import { userService } from '../../services/users.service'

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.getUserState.userDetails.id,
            oldPassword: null,
            newPassword: null,
            newPasswordRepeat: null,
            errorMessage: null,
            loading: false
        }
    }

    _dataInvalid() {
        var { oldPassword, newPassword, newPasswordRepeat } = this.state;
        if (!oldPassword || !newPassword || !newPasswordRepeat || newPassword.length < 6 || newPassword !== newPasswordRepeat) {
            return true;
        }

        return false;
    }

    onSubmit = async () => {
        var { userId, oldPassword, newPassword } = this.state;
        this.setState({
            loading: true
        });

        const updatePasswordViewModel = {
            userId: userId,
            oldPassword: oldPassword,
            newPassword: newPassword
        };

        try {
            const response = await userService.updatePassword(updatePasswordViewModel);
            if (response.succeeded) {
                this.props.navigation.goBack();
            } else {
                this.setState({
                    loading: false,
                    errorMessage: response.errors[0].description
                })
            }
        } catch (error) {
            this.setState({
                loading: false,
                errorMessage: 'Cannot connect to server. Please try again later'
            })
        }
    }

    render() {
        return (
            <ScrollView style={styles.container} ref='scroll'>
                <KeyboardAvoidingView behavior="padding" style={styles.form}>
                    <Input
                        value={this.state.oldPassword}
                        onChangeText={(text) => this.setState({ oldPassword: text })}
                        secureTextEntry={true}
                        returnKeyType='next'
                        placeholder='Current password'
                        containerStyle={{ marginVertical: 10, height: 30 }}
                        inputStyle={{ fontSize: 16 }}
                    />
                    <Input
                        value={this.state.newPassword}
                        onChangeText={(text) => this.setState({ newPassword: text })}
                        secureTextEntry={true}
                        returnKeyType='next'
                        placeholder='New password'
                        containerStyle={{ marginVertical: 10, height: 30 }}
                        inputStyle={{ fontSize: 16 }}
                        errorStyle={{ color: 'red' }}
                        errorMessage={
                            this.state.newPassword && this.state.newPassword?.length < 6
                                ? 'Too short' : null
                        }
                    />
                    <Input
                        value={this.state.newPasswordRepeat}
                        onChangeText={(text) => this.setState({ newPasswordRepeat: text })}
                        secureTextEntry={true}
                        returnKeyType='next'
                        placeholder='Retype new password'
                        containerStyle={{ marginVertical: 10, height: 30 }}
                        inputStyle={{ fontSize: 16 }}
                        errorStyle={{ color: 'red' }}
                        errorMessage={
                            this.state.newPasswordRepeat && this.state.newPassword !== this.state.newPasswordRepeat
                                ? `New password and retype password isn'n match` : null
                        }
                    />

                    {
                        this.state.errorMessage &&
                        <Text style={styles.errorText}>
                            {this.state.errorMessage}
                        </Text>
                    }

                    <View style={{ marginHorizontal: 10, marginTop: 30, marginBottom: 112 }}>
                        <Button
                            buttonStyle={{ backgroundColor: '#ff424e' }}
                            title='Save'
                            loading={this.state.loading}
                            disabled={this._dataInvalid()}
                            onPress={() => this.onSubmit()}
                        />
                    </View>
                </KeyboardAvoidingView>

                <DatePickerModel
                    onRef={ref => (this.child = ref)}
                    value={this.state.birthday}
                    mode='date'
                    title='Select birthday'
                    onChange={date => this.setState({ birthday: date })}
                />
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => ({
    getUserState: state.userReducer.getUser
})

export default connect(mapStateToProps, null)(ChangePassword);

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    errorText: {
        color: 'red',
        marginTop: 30,
        marginLeft: 10
    }
});