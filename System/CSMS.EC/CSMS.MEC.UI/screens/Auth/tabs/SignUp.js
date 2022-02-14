import React from 'react';
import { KeyboardAvoidingView, StyleSheet, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Button, Input, CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';

import { authActions } from '../../../redux/actions';
import DatePickerModel from '../../../components/commons/DatePickerModel';
import { formatDate } from '../../../commons/helpers';

class SignUp extends React.Component {

    state = {
        firstName: 'An',
        middleName: 'Cong',
        lastName: 'Ngo',
        phoneNumber: '0987654321',
        email: 'annc0211@gmail.com',
        password: '123',
        birthday: '11/02/2019',
        gender: 'Male',
        submitted: false,
        errorMessage: null
    }

    onSubmit = async () => {
        var { firstName, middleName, lastName, phoneNumber, email, password, birthday, gender } = this.state;
        this.setState({
            submitted: true
        });

        if (!firstName || !lastName || !phoneNumber || !email || !password) {
            return;
        }

        const userInfo = {
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email,
            password: password,
            birthday: birthday,
            gender: gender
        };

        try {
            const response = await this.props.createUser(userInfo);
            if (response.succeeded && this.props.createUserState.isSuccess) {
                this.props.closeModal();
            } else {
                this.setState({
                    errorMessage: this.props.createUserState.errors[0].description
                })
            }
        } catch (error) {
            this.setState({
                errorMessage: 'Cannot connect to server. Please try again later'
            })
        }
    }

    render() {
        const { createUserState } = this.props;

        return (
            <ScrollView style={styles.container} ref='scroll'>

                <KeyboardAvoidingView behavior="padding" style={styles.form}>
                    <View style={{ flexDirection: 'row' }}>
                        <Input
                            value={this.state.firstName}
                            onChangeText={(text) => this.setState({ firstName: text })}
                            returnKeyType='next'
                            placeholder='First name'
                            containerStyle={{ marginVertical: 10, height: 30, width: '50%' }}
                            inputStyle={{ fontSize: 16 }}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.submitted && !this.state.firstName ? 'Please enter your first name' : ''}
                            onFocus={() => this.refs['scroll'].scrollTo({ y: 0 })}
                        />
                        <Input
                            value={this.state.middleName}
                            onChangeText={(text) => this.setState({ middleName: text })}
                            returnKeyType='next'
                            placeholder='Middle name'
                            containerStyle={{ marginVertical: 10, height: 30, width: '50%' }}
                            inputStyle={{ fontSize: 16 }}
                            errorStyle={{ color: 'red' }}
                            onFocus={() => this.refs['scroll'].scrollTo({ y: 30 })}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Input
                            value={this.state.lastName}
                            onChangeText={(text) => this.setState({ lastName: text })}
                            returnKeyType='next'
                            placeholder='Last name'
                            containerStyle={{ marginVertical: 10, height: 30, width: '50%' }}
                            inputStyle={{ fontSize: 16 }}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.submitted && !this.state.lastName ? 'Please enter your last name' : ''}
                            onFocus={() => this.refs['scroll'].scrollTo({ y: 60 })}
                        />
                        <TouchableOpacity
                            onPress={() => this.child.toggleModel()}
                            activeOpacity={1}
                            style={styles.section}>
                            <Text style={{ fontSize: 16, paddingTop: 10, width: '100%' }}>
                                {formatDate(this.state.birthday)}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Input
                        value={this.state.phoneNumber}
                        onChangeText={(text) => this.setState({ phoneNumber: text })}
                        returnKeyType='next'
                        placeholder='Phone number'
                        containerStyle={{ marginVertical: 10, height: 30 }}
                        inputStyle={{ fontSize: 16 }}
                        errorStyle={{ color: 'red' }}
                        errorMessage={this.state.submitted && !this.state.phoneNumber ? 'Please enter your phone number' : ''}
                        onFocus={() => this.refs['scroll'].scrollTo({ y: 90 })}
                    />
                    <Input
                        value={this.state.email}
                        onChangeText={(text) => this.setState({ email: text })}
                        returnKeyType='next'
                        placeholder='Email'
                        autoCapitalize = 'none'
                        containerStyle={{ marginVertical: 10, height: 30 }}
                        inputStyle={{ fontSize: 16 }}
                        errorStyle={{ color: 'red' }}
                        errorMessage={this.state.submitted && !this.state.email ? 'Please enter your email' : ''}
                        onFocus={() => this.refs['scroll'].scrollTo({ y: 120 })}
                    />
                    <Input
                        value={this.state.password}
                        onChangeText={(text) => this.setState({ password: text })}
                        secureTextEntry={true}
                        returnKeyType='next'
                        placeholder='Password'
                        containerStyle={{ marginVertical: 10, height: 30 }}
                        inputStyle={{ fontSize: 16 }}
                        errorStyle={{ color: 'red' }}
                        errorMessage={this.state.submitted && !this.state.password ? 'Please enter your password' : ''}
                        onFocus={() => this.refs['scroll'].scrollTo({ y: 170 })}
                    />

                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <CheckBox
                            title='Male'
                            containerStyle={{ backgroundColor: '#fff', borderColor: '#fff', marginLeft: 0, width: 80 }}
                            checked={this.state.gender === 'Male'}
                            onPress={() => this.setState({ gender: 'Male' })}
                        />
                        <CheckBox
                            title='Female'
                            containerStyle={{ backgroundColor: '#fff', borderColor: '#fff', width: 100 }}
                            checked={this.state.gender === 'Female'}
                            onPress={() => this.setState({ gender: 'Female' })}
                        />
                    </View>

                    {
                        this.state.errorMessage &&
                        <Text style={{ color: 'red', marginLeft: 10 }}>
                            {this.state.errorMessage}
                        </Text>
                    }

                    <View style={{ marginHorizontal: 10, marginTop: 42, marginBottom: 112 }}>
                        <Button
                            buttonStyle={{ backgroundColor: '#ff424e' }}
                            title='Save'
                            loading={this.state.submitted && createUserState && createUserState.isLoading}
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
    createUserState: state.authReducer.createUser
})

const mapDispatchToProps = (dispatch) => ({
    createUser: (userInfo) => dispatch(authActions.createNewUser(userInfo))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textForget: {
        textAlign: 'center',
        marginVertical: 20,
        color: '#1ba8ff'
    },
    textOther: {
        textAlign: 'center',
        color: 'gray',
        marginTop: 10,
        marginBottom: 5
    },
    section: {
        flexDirection: 'row',
        width: '45%',
        alignItems: 'center',
        borderBottomWidth: 0.7,
        marginHorizontal: 10
    }
});