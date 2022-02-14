import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import MapView, { ProviderPropType, Marker, AnimatedRegion, } from 'react-native-maps';

import { systemActions } from '../../redux/actions';
import CartIcon from '../../components/CartIcon';
import StoreCarousel from './StoreCarousel';
import Loader from '../../components/Loader';

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height * 0.5;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Stores extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            _mapView: null,
            coordinate: null
        }
    }

    componentDidMount = async () => {
        if (this.props.branchs.length === 0) {
            const response = await this.props.getBranchs();
            if (response.status === 200) {
                this.initData();
            }
        } else {
            this.initData();
        }
    }

    initData() {
        this.setState({
            coordinate: new AnimatedRegion({
                latitude: parseFloat(this.props.branchs[0].latitude),
                longitude: parseFloat(this.props.branchs[0].longitude),
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            })
        }, () => {
            this.setState({ loading: false });
        });
    }

    onChange(latitude, longitude) {
        const { coordinate } = this.state;
        const newCoordinate = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };

        coordinate.timing(newCoordinate).start();
        newCoordinate.latitude -= 0.015;
        this.mapView.animateToRegion(newCoordinate, 500);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.borderCart} />
                <CartIcon navigation={this.props.navigation} />

                {!this.state.loading &&
                    <View style={styles.map_container}>
                        <MapView
                            provider={this.props.provider}
                            style={styles.map}
                            ref={mapView => {
                                this.mapView = mapView;
                            }}
                            initialRegion={{
                                latitude: this.props.branchs[0].latitude - 0.015,
                                longitude: this.props.branchs[0].longitude,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            }}
                        >
                            <Marker.Animated
                                ref={marker => {
                                    this.marker = marker;
                                }}
                                coordinate={this.state.coordinate}
                            />
                        </MapView>
                    </View>
                }

                <View style={styles.carousel}>
                    <StoreCarousel
                        stores={this.props.branchs}
                        navigation={this.props.navigation}
                        onChange={(latitude, longitude) => this.onChange(latitude, longitude)}
                    />
                </View>

                {this.state.loading && <Loader />}
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    branchs: state.systemReducer.branchReducer
})

const mapDispatchToProps = (dispatch) => ({
    getBranchs: () => dispatch(systemActions.getBranchs())
})

export default connect(mapStateToProps, mapDispatchToProps)(Stores);


Stores.propTypes = {
    provider: ProviderPropType,
};

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    map_container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bubble: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    latlng: {
        width: 200,
        alignItems: 'stretch',
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    carousel: {
        width: screen.width,
        height: screen.width * 0.55,
        position: 'absolute',
        bottom: 10
    },
    borderCart: {
        backgroundColor: '#000',
        opacity: 0.2,
        zIndex: 1,
        width: 46,
        height: 46,
        position: 'absolute',
        right: 7,
        top: Platform.OS === "android" ? 28 : 18,
        borderRadius: 23
    }
});