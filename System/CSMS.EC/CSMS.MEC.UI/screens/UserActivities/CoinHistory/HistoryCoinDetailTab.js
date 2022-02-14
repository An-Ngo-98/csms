import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { DateFormat } from '../../../commons/constants';
import { formatDate } from '../../../commons/helpers'

export default class HistoryCoinDetailTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            histories: null
        }
    }

    _formatDateTime(datetime) {
        if (!datetime) {
            return 'N/A';
        }

        return formatDate(datetime, DateFormat.DateTimeFormatYYYYMMDD);
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {this.props.activities.map((act, index) => {
                    return (
                        <View key={index.toString()}
                            style={styles.content}
                        >
                            <MaterialCommunityIcons
                                name="coin"
                                color={act.isUsed ? "#bdbdbd" : "#f0ad16"}
                                size={50}
                                style={{ width: 60 }}
                            />
                            <View style={{ width: dimensions.width - 60 - 80, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 15, paddingBottom: 3 }}>{'Invoice: ' + act.invoiceId}</Text>
                                <Text style={{ fontSize: 12, color: 'gray' }}>
                                    {this._formatDateTime(act.time)}
                                    </Text>
                            </View>

                            <View style={{ width: 60, justifyContent: 'center' }}>
                                <Text style={{
                                    fontSize: 17,
                                    textAlign: 'right',
                                    color: act.isUsed ? "#000" : "#f0ad16"
                                }}>
                                    {(act.isUsed ? '- ' : '+ ') + act.coins}
                                </Text>
                            </View>

                        </View>
                    );
                })}
            </ScrollView>
        );
    }
}

const dimensions = Dimensions.get('screen');
var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        paddingBottom: 30
    },
    content: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#fff',
        padding: 10,
        borderBottomWidth: .5,
        borderBottomColor: '#d4d4d4'
    }
});