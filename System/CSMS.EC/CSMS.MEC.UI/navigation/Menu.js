import React from "react";
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

import { HomeStack, CategoriesStack, StoresStack, NotificationsStack, AccountStack } from './Screens';

const Menu = createBottomTabNavigator({
    Home: {
        screen: HomeStack,
        navigationOptions: {
            tabBarLabel: 'Home',
            tabBarIcon: ({ tintColor }) => (
                <MaterialCommunityIcons name='silverware' color={tintColor} size={24} />
            )
        }
    },
    Categories: {
        screen: CategoriesStack,
        navigationOptions: {
            tabBarLabel: 'Categories',
            tabBarIcon: ({ tintColor }) => (
                <MaterialCommunityIcons name='food' color={tintColor} size={24} />
            )
        }
    },
    Stores: {
        screen: StoresStack,
        navigationOptions: {
            tabBarLabel: 'Stores',
            tabBarIcon: ({ tintColor }) => (
                <MaterialCommunityIcons name='store' color={tintColor} size={24} />
            )
        }
    },
    Notifications: {
        screen: NotificationsStack,
        navigationOptions: {
            tabBarLabel: 'Notifications',
            tabBarIcon: ({ tintColor }) => (
                <MaterialCommunityIcons name='bell' color={tintColor} size={24} />
            )
        }
    },
    Account: {
        screen: AccountStack,
        navigationOptions: {
            tabBarLabel: 'Account',
            tabBarIcon: ({ tintColor }) => (
                <MaterialCommunityIcons name='account' color={tintColor} size={24} />
            )
        }
    }
}, {
    tabBarOptions: {
        activeTintColor: '#157cdb',
        inactiveTintColor: 'black'
    }
});

export default createAppContainer(Menu);
