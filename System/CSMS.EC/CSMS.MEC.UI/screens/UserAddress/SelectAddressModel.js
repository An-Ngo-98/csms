import React from 'react';
import { View, StyleSheet, Platform, Modal, Text } from 'react-native';
import { AntDesign } from 'react-native-vector-icons';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

import ProvinceTab from './tabs/ProvinceTab';
import DistrictTab from './tabs/DistrictTab';
import WardTab from './tabs/WardTab';
import { locationService, storeService } from '../../services';
import Loader from '../../components/Loader';

export default class SelectAddressModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            title: this.props.title ? this.props.title : 'Shipping area',
            provinces: [],
            districts: [],
            wards: [],
            province: null,
            district: null,
            loading: false
        }
    }

    componentDidMount = async () => {
        this.props.onRef(this);

        const [resProvince, resEP] = await Promise.all([
            locationService.getListProvince(),
            storeService.getEnableProvinces()
        ]);

        if (resProvince.status === 200 && resEP.status === 200) {
            const provinces = resProvince.data.filter(province => {
                return resEP.data.some(enableP => {
                    return enableP === province.name
                })
            });

            this.setState({ provinces: provinces });
        }
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    openModel = async (provinceName, districtName) => {
        this.setState({
            modalVisible: true,
            province: provinceName,
            district: districtName,
            districts: null,
            wards: null,
        });

        if (provinceName) {
            await this.onChooseProvince(provinceName, districtName);
        }

        if (districtName) {
            await this.onChooseDistrict(districtName);
        }
    }

    toggleModel() {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    }

    onChooseProvince = async (provinceName, districtName) => {
        this.setState({
            province: provinceName,
            district: districtName ? districtName : null,
            loading: true
        });

        const province = this.state.provinces.find(item => item.name === provinceName);
        const response = await locationService.getListDistrictByProvinceId(province.id);

        if (response.status === 200) {
            this.setState({
                districts: response.data,
                loading: false
            });
            if (!this.state.district) {
                this.tabView.goToPage(1);
            }
        }
    }

    onChooseDistrict = async (districtName) => {
        this.setState({
            district: districtName,
            loading: true
        });

        const district = this.state.districts.find(item => item.name === districtName);
        const response = await locationService.getListWardByDistrictId(district.id);

        if (response.status === 200) {
            this.setState({
                wards: response.data,
                loading: false
            });
            this.tabView.goToPage(2);
        }
    }

    onChooseWard(wardName) {
        this.props.onChange(this.state.province, this.state.district, wardName);
        this.toggleModel();
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
                            onPress={() => this.toggleModel()}
                        />
                        <View style={styles.section}>
                            <Text style={styles.title}>{this.state.title}</Text>
                        </View>
                    </View>

                    <View style={styles.tabbar}>
                        <ScrollableTabView
                            tabBarActiveTextColor='#157cdb'
                            initialPage={!this.state.province ? 0 : (!this.state.district ? 1 : 2)}
                            renderTabBar={() => <DefaultTabBar underlineStyle={{ backgroundColor: '#157cdb' }} />}
                            ref={(tabView) => { this.tabView = tabView }}
                        >
                            <ProvinceTab
                                tabLabel={this.state.province ? this.state.province : 'Province'}
                                provinces={this.state.provinces}
                                navigation={this.props.navigation}
                                onChooseProvince={(provinceName) => this.onChooseProvince(provinceName, null)}
                            />

                            <DistrictTab
                                tabLabel={this.state.district ? this.state.district : 'District'}
                                districts={this.state.districts}
                                navigation={this.props.navigation}
                                onChooseDistrict={(districtName) => this.onChooseDistrict(districtName)}
                            />

                            <WardTab
                                tabLabel={this.state.ward ? this.state.ward : 'Ward'}
                                wards={this.state.wards}
                                navigation={this.props.navigation}
                                onChooseWard={(wardName) => this.onChooseWard(wardName)}
                            />
                        </ScrollableTabView>
                    </View>
                    {this.state.loading && <Loader />}
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
    tabbar: {
        flex: 1,
        marginTop: 0
    }
});