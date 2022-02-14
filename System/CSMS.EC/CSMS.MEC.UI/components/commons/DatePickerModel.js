import React from 'react';
import { View, StyleSheet, Modal, Platform, StatusBar, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { parseToDate, formatDate } from '../../commons/helpers';
import { Button } from 'react-native-elements';
import { DateFormat } from '../../commons/constants';

export default class DatePickerModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            title: this.props.title,
            value: this.props.value ? parseToDate(this.props.value) : null,
            mode: this.props.mode ? this.props.mode : 'datetime'
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    toggleModel() {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    }

    onSelectDate(date) {
        this.setState({
            value: date
        });
    }

    callback() {
        this.props.onChange(formatDate(this.state.value, DateFormat.DateFormatJson));
        this.toggleModel();
    }

    callbackAndroid(date) {
        this.toggleModel();
        if (date) {
            this.onSelectDate(date);
            this.props.onChange(formatDate(date, DateFormat.DateFormatJson));
        }
    }

    render() {
        if (Platform.OS === 'android' && this.state.modalVisible) {
            return (
                <DateTimePicker
                    value={this.state.value}
                    mode={this.state.mode}
                    onChange={(event, date) => this.callbackAndroid(date)}
                />
            );
        } else {
            return (
                <View style={styles.container}>
                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.modalVisible}>

                        <TouchableOpacity
                            onPress={() => this.toggleModel()}
                            activeOpacity={1}
                            style={{ flex: 1, backgroundColor: 'black' }}
                        />

                        <View
                            showsVerticalScrollIndicator={false}
                            style={styles.footer}
                        >
                            <StatusBar barStyle='light-content' />

                            <Text style={styles.title}>
                                {this.state.title}
                            </Text>

                            <DateTimePicker
                                value={this.state.value}
                                mode={this.state.mode}
                                onChange={(event, date) => this.onSelectDate(date)}
                            />

                            <View style={{ marginHorizontal: 10, marginTop: 20, marginBottom: 112 }}>
                                <Button
                                    buttonStyle={{ backgroundColor: '#ff424e' }}
                                    title='Update'
                                    loading={this.state.submitted && updateUserState && updateUserState.isLoading}
                                    onPress={() => this.callback()}
                                />
                            </View>
                        </View>
                    </Modal>
                </View>
            );
        }
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray'
    },
    footer: {
        flex: 1
    },
    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '500',
        marginVertical: 10
    }
});