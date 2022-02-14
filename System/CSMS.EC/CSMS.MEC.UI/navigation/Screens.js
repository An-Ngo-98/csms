import { createStackNavigator } from 'react-navigation-stack';

import Home from '../screens/Home';
import Categories from '../screens/Category/Categories';
import Stores from '../screens/Store/Stores';
import Search from '../screens/Search/Search';
import Notifications from '../screens/Notification/Notifications';
import Account from '../screens/Account';
import UserInfo from '../screens/UserInfo/UserInfo';
import Products from '../screens/Products';

export const HomeStack = createStackNavigator({
    HomeScreen: {
        screen: Home,
        navigationOptions: {
            headerShown: false
        }
    },
    SearchScreen: {
        screen: Search,
        navigationOptions: {
            headerShown: false
        }
    }
});

export const CategoriesStack = createStackNavigator({
    CategoriesScreen: {
        screen: Categories,
        navigationOptions: {
            headerShown: false
        }
    },
    SearchScreen: {
        screen: Search,
        navigationOptions: {
            headerShown: false
        }
    }
});

export const StoresStack = createStackNavigator({
    StoresScreen: {
        screen: Stores,
        navigationOptions: {
            headerShown: false
        }
    },
    SearchScreen: {
        screen: Search,
        navigationOptions: {
            headerShown: false
        }
    }
});

export const NotificationsStack = createStackNavigator({
    NotificationsScreen: {
        screen: Notifications,
        navigationOptions: {
            headerShown: false
        }
    }
});

export const AccountStack = createStackNavigator({
    AccountScreen: {
        screen: Account,
        navigationOptions: {
            headerShown: false
        }
    },
    UserInfoScreen: {
        screen: UserInfo,
        navigationOptions: {
            headerShown: false
        }
    },
    ProductsScreen: {
        screen: Products,
        navigationOptions: {
            headerShown: false
        }
    }
});