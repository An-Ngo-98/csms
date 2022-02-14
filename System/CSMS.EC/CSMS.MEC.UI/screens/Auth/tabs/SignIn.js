import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Input, SocialIcon } from 'react-native-elements';
import { connect } from 'react-redux';

import { authActions } from '../../../redux/actions';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 15
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
    }
});
class SignIn extends React.Component {

    state = {
        username: 'annc0211@gmail.com',
        password: '123456',
        submitted: false,
        errorMessage: null
    }

    onSubmit = async () => {
        var { username, password } = this.state;
        this.setState({
            submitted: true
        });

        if (!username || !password) {
            return;
        }

        try {
            const response = await this.props.loginUser(username, password);
            if (response.success && this.props.loginUserState.isSuccess) {
                this.props.closeModal();
            }
        } catch (error) {
            this.setState({
                errorMessage: 'Cannot connect to server. Please try again later'
            })
        }
    }

    render() {
        const { loginUserState } = this.props;

        return (
            <ScrollView style={styles.container}>
                <Input
                    value={this.state.username}
                    onChangeText={(text) => this.setState({ username: text })}
                    returnKeyType='next'
                    placeholder='Email / Phone number'
                    autoCapitalize = 'none'
                    containerStyle={{ marginVertical: 20, paddingHorizontal: 0 }}
                    inputStyle={{ fontSize: 16 }}
                    errorStyle={{ color: 'red' }}
                    errorMessage={this.state.submitted && !this.state.username ? 'Please enter your email or phone number' : ''}
                    onSubmitEditing={() => this.password.focus()}
                />

                <Input
                    ref={(input) => this.password = input}
                    value={this.state.password}
                    onChangeText={(text) => this.setState({ password: text })}
                    secureTextEntry={true}
                    returnKeyType='go'
                    placeholder='Password'
                    containerStyle={{ marginVertical: 5, paddingHorizontal: 0 }}
                    inputStyle={{ fontSize: 16 }}
                    errorStyle={{ color: 'red' }}
                    errorMessage={this.state.submitted && !this.state.password ? 'Please enter your password' : ''}
                    onSubmitEditing={() => this.onSubmit()}

                />

                {(this.state.submitted && (loginUserState && loginUserState.isError) || this.state.errorMessage) &&
                    <Text style={{ color: 'red' }}>
                        {this.state.errorMessage ? this.state.errorMessage : 'Username or password is incorrect'}
                    </Text>
                }

                <Button
                    buttonStyle={{ backgroundColor: '#ff424e', marginTop: 20, marginBottom: 10, paddingVertical: 12 }}
                    title='Sign in'
                    loading={this.state.submitted && loginUserState && loginUserState.isLoading}
                    onPress={() => this.onSubmit()}
                />
                <Text style={styles.textForget}>Foget password?</Text>
                <Text style={styles.textOther}> Or sign in with</Text>
                <SocialIcon
                    title='Sign In With Facebook'
                    button
                    type='facebook'
                />
                <SocialIcon
                    title='Sign In With Google'
                    button
                    type='google'
                />
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => ({
    loginUserState: state.authReducer.loginUser
})

const mapDispatchToProps = (dispatch) => ({
    loginUser: (username, password) => dispatch(authActions.loginUser(username, password))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)