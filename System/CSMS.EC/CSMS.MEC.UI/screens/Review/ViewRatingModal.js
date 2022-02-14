import React from 'react';
import { View, StyleSheet, Modal, Text } from 'react-native';
import { AntDesign } from "react-native-vector-icons";

import Review from '../../components/Review';

export default class ViewRatingModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            rating: null
        }
    }

    componentDidMount() {
        this.props.onRef(this);
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    openModal(rating) {
        this.setState({
            modalVisible: true,
            rating: rating
        });
    }

    closeModal() {
        this.setState({ modalVisible: false });
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}
                style={styles.container}>

                <View style={styles.header}>
                    <AntDesign
                        style={styles.back}
                        name="close"
                        color='#fff'
                        size={25}
                        onPress={() => this.closeModal()}
                    />
                    <View style={styles.section}>
                        <Text style={styles.title}>Product Ratings</Text>
                    </View>
                </View>

                <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                    <Review review={this.state.rating} />
                </View>
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
        height: Platform.OS === 'ios' ? 70 : 60,
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
    }
});