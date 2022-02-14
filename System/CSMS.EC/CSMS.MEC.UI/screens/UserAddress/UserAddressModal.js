import React from 'react';
import { View, StyleSheet, Platform, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import { AntDesign } from 'react-native-vector-icons';
import { Button, CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';

import Loader from '../../components/Loader';
import EmptyContent from '../../components/EmptyContent';
import ActionSheet from '../../components/commons/ActionSheet';
import { userService } from '../../services'
import AddEditAddressModal from './AddEditAddressModal';

class UserAddressModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			listAddress: null,
			loading: true,
			errorMessage: null,
			textInputValue: '',
			addressSelected: null,
			allowSelect: false
		}
	}

	componentDidMount = async () => {
		this.props.onRef(this);

		const { getUser } = this.props;
		if (getUser.userDetails) {
			const response = await userService.getListAddress(getUser.userDetails.id);
			if (response.status === 200) {
				this.setState({
					listAddress: response.data,
					loading: false
				})
			} else {
				this.setState({
					errorMessage: `Can't connect to server. Please check your internet`,
					loading: false
				})
			}

		} else {
			this.props.navigation.navigate('AccountScreen');
		}
	}
	componentWillUnmount() {
		this.props.onRef(undefined);
	}

	openModal(address = null, allowSelect = false) {
		this.setState({
			modalVisible: true,
			addressSelected: address,
			allowSelect: allowSelect,
			loading: false
		});
	}

	toggleModal() {

		if(this.state.allowSelect) {
			this.props.callback(this.state.addressSelected);
		}

		this.setState({
			modalVisible: !this.state.modalVisible,
			addressSelected: null,
			allowSelect: false,
			loading: false
		});
	}

	formatAddress = (item) => {
		let address = item.ward + ', ' + item.district + ', ' + item.province;
		return item.detail ? item.detail + ', ' + address : address;
	}

	renderItem = ({ item }) => {
		return (
			<View style={styles.item}>
				<View style={styles.content}>
					<Text style={styles.textReceiver}>{item.receiver}</Text>
					<Text style={styles.textPhoneNumber}>{item.phoneNumber}</Text>
					<Text style={styles.textAddress}>{this.formatAddress(item)}</Text>

					{item.isDefault &&
						<Text style={styles.textDefault}>Default address</Text>
					}
				</View>
				<TouchableOpacity
					onPress={() => this.onOpenActionSheet(item)}
					style={styles.button}>
					<AntDesign
						name="circledowno"
						color='#1ba8ff'
						size={20}
					/>
				</TouchableOpacity>
				{this.state.allowSelect &&
					<CheckBox
						containerStyle={{
							backgroundColor: '#fff',
							borderColor: '#fff',
							marginLeft: 0,
							width: 30,
							position: 'absolute',
							right: 5,
							bottom: 0
						}}
						checked={this.state.addressSelected.id === item.id}
						onPress={() => this.setState({ addressSelected: item })}
					/>
				}
			</View>
		)
	}

	ItemSeparatorComponent = () => { return (<View style={styles.hr} />) }

	onOpenActionSheet = (address) => {
		const options = address.isDefault ? ['Edit', 'Cancel'] : ['Edit', 'Set default', 'Delete', 'Cancel'];
		const cancelButtonIndex = address.isDefault ? 1 : 3;
		const destructiveButtonIndex = address.isDefault ? null : 2;

		this.actionSheet.showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
				destructiveButtonIndex,
			},
			buttonIndex => {
				if (buttonIndex === 0) {
					this.onAddEditAddress(address);
				} else if (buttonIndex === 1 && !address.isDefault) {
					this.setDefaultAddress(address);
				} else if (buttonIndex === 2 && !address.isDefault) {
					this.deleteAddress(address);
				}
			},
		);
	};

	updateListAddress = (address) => {
		let addresses = this.state.listAddress;
		const itemIndex = addresses.findIndex(x => x.id === address.id);

		if (address.isDefault) {
			for (const item of addresses) {
				item.isDefault = false;
			}
		}

		if (itemIndex === -1) {
			addresses.push(address);
			this.setState({ listAddress: addresses });
		} else {
			addresses[itemIndex] = address;
			this.setState({ listAddress: addresses });
		}
	}

	async setDefaultAddress(address) {
		this.setState({ loading: true });

		address.isDefault = true;
		const response = await userService.saveAddress(address);
		if (response.status === 200) {
			let addresses = this.state.listAddress;
			addresses.forEach((item, index) => {
				if (item.id === address.id) {
					addresses[index].isDefault = true;
				} else {
					addresses[index].isDefault = false;
				}
			});

			this.setState({
				listAddress: addresses,
				loading: false
			});
		} else {
			this.setState({
				errorMessage: `Can't connect to server. Please check your internet`,
				loading: false
			});
		}
	}

	async deleteAddress(address) {
		this.setState({ loading: true });
		const response = await userService.deleteAddress(address.id);

		if (response.status === 200) {
			let addresses = this.state.listAddress;
			addresses = addresses.filter(item => item.id !== address.id);
			this.setState({
				listAddress: addresses,
				loading: false
			});
		} else {
			this.setState({
				errorMessage: `Can't connect to server. Please check your internet`,
				loading: false
			});
		}
	}

	onAddEditAddress(address) {
		const { getUser } = this.props;
		this.addEditModal.openModal(address, getUser.userDetails.id);
	}

	render() {
		return (
			<Modal
				animationType={"slide"}
				transparent={false}
				visible={this.state.modalVisible}
				style={styles.container}
			>
				<View style={styles.header}>
					<AntDesign
						style={styles.back}
						name="left"
						color='#fff'
						size={25}
						onPress={() => this.toggleModal()}
					/>
					<View style={styles.section}>
						<Text style={styles.title}>Address book</Text>
					</View>
				</View>

				{this.state.loading && <Loader />}

				{this.state.errorMessage && <Text>{this.state.errorMessage}</Text>}

				{!this.state.loading && this.state.listAddress.length === 0 &&
					<EmptyContent
						navigation={this.props.navigation}
						content='address'
						hideButton={true}
					/>
				}

				{this.state.listAddress &&
					<View style={{ backgroundColor: '#f2f2f2', height: '100%' }}>
						<FlatList
							data={this.state.listAddress}
							renderItem={this.renderItem}
							keyExtractor={(item, index) => index.toString()}
							ItemSeparatorComponent={this.ItemSeparatorComponent}
							showsVerticalScrollIndicator={false}
						/>
					</View>
				}

				<View style={styles.footer}>
					<Button
						buttonStyle={styles.btn_add}
						title='Add new address'
						onPress={() => this.onAddEditAddress()}
					/>
				</View>

				<AddEditAddressModal
					onRef={ref => (this.addEditModal = ref)}
					updateListAddress={(address) => this.updateListAddress(address)}
				/>

				<ActionSheet
					onRef={ref => (this.actionSheet = ref)}
				/>
			</Modal>
		)
	}
}

const mapStateToProps = (state) => ({
	getUser: state.userReducer.getUser
})

export default connect(mapStateToProps, null)(UserAddressModal);

var styles = StyleSheet.create({
	container: {
		flex: 1,
		zIndex: 2
	},
	header: {
		backgroundColor: '#1ba8ff',
		height: Platform.OS === 'ios' ? 75 : 60,
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
	footer: {
		backgroundColor: '#fff',
		position: 'absolute',
		bottom: 0,
		width: '100%'
	},
	btn_add: {
		backgroundColor: '#ff424e',
		marginHorizontal: 12,
		marginVertical: 10
	},
	item: {
		flex: 1,
		paddingVertical: 15,
		paddingHorizontal: 10,
		flexDirection: 'row',
		backgroundColor: '#fff'
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 10
	},
	button: {
		width: 30,
		height: 30,
		backgroundColor: 'white',
		borderRadius: 15,
		justifyContent: 'center',
		alignItems: 'center'
	},
	hr: {
		borderBottomColor: '#d4d4d4',
		borderBottomWidth: 1
	},
	textReceiver: {
		fontSize: 16,
		marginBottom: 5,
		fontWeight: '400'
	},
	textPhoneNumber: {
		color: 'gray',
		marginVertical: 4
	},
	textAddress: {
		color: 'gray'
	},
	textDefault: {
		marginTop: 10,
		fontSize: 12,
		color: '#ffaa00',
		fontWeight: '500'
	}
});