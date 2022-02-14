import React from 'react';
import { StyleSheet, Text, FlatList, View, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default class DistrictTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            districts: this.props.districts,
            districts_temp: this.props.districts,
            search: ''
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.districts !== state.districts_temp) {
            return {
                districts: props.districts,
                districts_temp: props.districts,
                search: ''
            }
        }

        return null;
    }

    _search(text) {
        let result = [];

        this.state.districts_temp.map(function (value) {
            if (value.searchString.toLowerCase().indexOf(text.toLowerCase()) > -1) {
                result.push(value);
            }
        });
        this.setState({
            districts: result,
            search: text
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.section}>
                    <AntDesign style={styles.searchIcon} name='search1' size={20} color="#000" />
                    <TextInput
                        placeholder='Where is your district ?'
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
                    data={this.state.districts}
                    keyExtractor={item => item.code}
                    renderItem={({ item }) =>
                        <Text
                            style={styles.item}
                            onPress={() => this.props.onChooseDistrict(item.name)}
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