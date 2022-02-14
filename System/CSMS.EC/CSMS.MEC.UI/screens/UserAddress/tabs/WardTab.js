import React from 'react';
import { StyleSheet, Text, FlatList, View, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default class WardTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wards: this.props.wards,
            wards_temp: this.props.wards,
            search: ''
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.wards !== state.wards_temp) {
            return {
                wards: props.wards,
                wards_temp: props.wards,
                search: ''
            }
        }

        return null;
    }

    _search(text) {
        let result = [];

        this.state.wards_temp.map(function (value) {
            if (value.name.indexOf(text) > -1) {
                result.push(value);
            }
        });
        this.setState({
            wards: result,
            search: text
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.section}>
                    <AntDesign style={styles.searchIcon} name='search1' size={20} color="#000" />
                    <TextInput
                        placeholder='Where is your ward ?'
                        style={styles.text}
                        value={this.state.search}
                        onChangeText={(text) => this._search(text)}
                    />

                    <AntDesign
                        style={styles.close}
                        onPress={() => this._search('')}
                        name='close'
                        color='gray'
                        size={20}
                    />
                </View>
                <FlatList
                    data={this.state.wards}
                    keyExtractor={item => item.code}
                    renderItem={({ item }) =>
                        <Text
                            style={styles.item}
                            onPress={() => this.props.onChooseWard(item.name)}
                        >
                            {item.name}
                        </Text>
                    }
                />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 5
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey'
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        borderColor: 'gray',
        borderWidth: 1,
        backgroundColor: '#fff'
    },
    searchIcon: {
        padding: 2
    },
    text: {
        flex: 1,
        marginLeft: 10
    },
    close: {
        paddingHorizontal: 5,
        zIndex: 99
    }
});