import React from 'react';
import { View, StyleSheet, Modal, Platform, StatusBar, Text, TouchableOpacity, ActionSheetIOS } from 'react-native';

export default class DatePickerModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            options: null,
            cancelButtonIndex: null,
            destructiveButtonIndex: null,
            callback: null
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    showActionSheetWithOptions(data, callback) {
        if (Platform.OS === 'android') {
            this.setState({
                options: data.options,
                cancelButtonIndex: data.cancelButtonIndex,
                destructiveButtonIndex: data.destructiveButtonIndex,
                callback: callback,
                modalVisible: true
            });
        } else {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: data.options,
                    destructiveButtonIndex: data.destructiveButtonIndex,
                    cancelButtonIndex: data.cancelButtonIndex
                },
                buttonIndex => callback(buttonIndex)
            );
        }
    }

    callback(index) {
        this.state.callback(index);
        this.setState({ modalVisible: false });
    }

    render() {
        return (
            <View style={styles.container}>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}>

                    <TouchableOpacity
                        onPress={() => this.setState({ modalVisible: false })}
                        activeOpacity={1}
                        style={{ backgroundColor: 'rgba(52, 52, 52, 0.3)', height: '100%' }}
                    />

                    <View
                        showsVerticalScrollIndicator={false}
                        style={styles.footer}
                    >
                        <StatusBar barStyle='light-content' />

                        {this.state.options?.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    // activeOpacity={null}
                                    style={{ paddingVertical: 17, paddingHorizontal: 12 }}
                                    onPress={() => this.callback(index)}
                                >
                                    <Text style={{
                                        fontSize: 16,
                                        color: index === this.state.cancelButtonIndex
                                            || index === this.state.destructiveButtonIndex
                                            ? '#e80e0e' : 'black'
                                    }}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Modal>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray'
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff'
    }
});