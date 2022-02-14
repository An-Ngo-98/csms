import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AntDesign } from 'react-native-vector-icons';
import { Rating } from 'react-native-elements';

import { formatDate } from '../commons/helpers';

export default class Review extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            review: this.props.review,
            loading: true
        }
    }

    render() {
        return (
            this.state.review &&
            <View style={styles.container}>
                <View style={{ flexDirection: "row", marginBottom: 5 }}>
                    <Rating
                        imageSize={18}
                        readonly
                        startingValue={this.state.review.score}
                    />
                    <Text style={styles.textDate}>
                        {formatDate(this.state.review.votedDate)}
                    </Text>
                </View>

                <Text style={{ fontSize: 16, fontWeight: 'bold', paddingVertical: 5 }}>{this.state.review.title}</Text>

                <View style={{ flexDirection: "row" }}>
                    <Text style={{ color: 'gray', marginRight: 10 }}>{this.state.review.fullname}</Text>
                    {this.state.review.purchased &&
                        <View style={{ flexDirection: 'row' }}>
                            <AntDesign
                                name="checkcircle"
                                color='#33c558'
                                size={16}
                            />
                            <Text style={{ color: '#33c558', marginLeft: 5 }}>Have enjoyed this dish</Text>
                        </View>
                    }
                </View>
                <Text style={{ marginTop: 15, lineHeight: 20 }}>
                    {this.state.review.comment}
                </Text>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        borderTopWidth: 0.5,
        borderTopColor: "#d4d4d4",
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#fff'
    },
    textDate: {
        color: "gray",
        marginTop: 3,
        right: 10,
        fontSize: 12,
        position: 'absolute'
    }
});