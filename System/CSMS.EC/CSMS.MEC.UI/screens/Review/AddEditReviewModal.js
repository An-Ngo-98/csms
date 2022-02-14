import React from 'react';
import { View, StyleSheet, ScrollView, Modal, Text, TextInput } from 'react-native';
import { AntDesign } from "react-native-vector-icons";
import { Button } from 'react-native-elements';
import { AirbnbRating } from 'react-native-elements';

import { productService } from '../../services'

export default class AddEditReviewModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            submited: false,
            id: 0,
            productId: 0,
            userId: 0,
            fullName: '',
            score: 0,
            title: '',
            comment: '',
            invoiceId: null,
            loading: false,
            errorMessage: ''
        }
    }

    componentDidMount = async () => {
        this.props.onRef(this);
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    openModal(productId, userId, fullName, id = 0, invoiceId = null) {
        this.setState({
            modalVisible: true,
            submited: false,
            id: id,
            productId: productId,
            userId: userId,
            fullName: fullName,
            score: 0,
            title: '',
            comment: '',
            invoiceId: invoiceId,
            loading: false,
            errorMessage: ''
        });
    }

    closeModal() {
        this.setState({ modalVisible: false });
    }

    onSelectStar(rating) {
        switch (rating) {
            case 1:
                this.setState({ title: TitleType.OneStar });
                break;
            case 2:
                this.setState({ title: TitleType.TwoStar });
                break;
            case 3:
                this.setState({ title: TitleType.ThreeStar });
                break;
            case 4:
                this.setState({ title: TitleType.FourStar });
                break;
            case 5:
                this.setState({ title: TitleType.FiveStar });
                break;
        }

        this.setState({ score: rating });
    }

    onSubmit = async () => {
        this.setState({ submited: true });
        if (this.state.score === 0 || this.state.comment.length < 25) {
            return;
        }

        this.setState({ loading: true });
        const review = {
            id: this.state.id,
            productId: this.state.productId,
            userId: this.state.userId,
            fullName: this.state.fullName,
            score: this.state.score,
            title: this.state.title,
            comment: this.state.comment,
            invoiceId: this.state.invoiceId
        }

        const response = await productService.saveReview(review);
        if (response.status === 200) {
            if (this.props.callback) {
                this.props.callback(response.data);
            }
            this.closeModal();
        } else {
            this.setState({ errorMessage: 'Cannot connect to server. Please check your internet.' });
        }
    }

    render() {
        return (
            <View>
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
                            <Text style={styles.title}>Your comments</Text>
                        </View>
                    </View>

                    <ScrollView>
                        {this.state.score === 0 &&
                            <Text style={styles.textNoScore}>
                                Please select your satisfaction level
                            </Text>
                        }

                        <AirbnbRating
                            count={5}
                            reviews={[TitleType.OneStar, TitleType.TwoStar, TitleType.ThreeStar, TitleType.FourStar, TitleType.FiveStar]}
                            defaultRating={0}
                            size={32}
                            onFinishRating={(rating) => this.onSelectStar(rating)}
                        />
                        {this.state.submited && this.state.score === 0 &&
                            <Text style={[styles.textError, { textAlign: 'center' }]}>
                                You must select your comment
                            </Text>
                        }

                        <TextInput
                            multiline={true}
                            numberOfLines={15}
                            placeholder='Share your comment with this product ...'
                            onChangeText={(comment) => this.setState({ comment })}
                            value={this.state.comment}
                            style={styles.textarea}
                        />
                        {this.state.submited && this.state.comment.length < 25 &&
                            <Text style={styles.textError}>
                                Share at least 25 characters about your comment
                            </Text>
                        }
                        {this.state.errorMessage.length > 0 &&
                            <Text style={styles.textError}>
                                {this.state.errorMessage}
                            </Text>
                        }
                    </ScrollView>

                    <View style={styles.btn_footer}>
                        <Button
                            buttonStyle={styles.btn_add}
                            title='Send'
                            loading={this.state.loading}
                            onPress={() => this.onSubmit()}
                        />
                    </View>
                </Modal>
            </View>
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
    },
    btn_footer: {
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTopColor: '#d4d4d4',
        borderTopWidth: 0.5,
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    btn_add: {
        backgroundColor: '#ff424e'
    },
    textarea: {
        marginHorizontal: 15,
        marginTop: 30,
        borderWidth: 0.5,
        borderColor: '#d4d4d4',
        borderRadius: 5,
        textAlignVertical: 'top',
        padding: 15,
        paddingTop: 10,
        height: 200
    },
    textNoScore: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 15
    },
    textError: {
        fontSize: 14,
        color: '#ff424e',
        paddingVertical: 5,
        marginHorizontal: 15
    }
});

const TitleType = Object.freeze({
    'OneStar': 'Terrible',
    "TwoStar": 'Bad',
    "ThreeStar": 'Normal',
    "FourStar": 'OK',
    "FiveStar": 'Good'
})