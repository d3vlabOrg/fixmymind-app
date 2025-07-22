import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';

const SplashScreen = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (navigation) {
                if (user) {
                    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
                } else {
                    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
                }
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [user, navigation]);

    return (
        <AuthLayout>
            <View style={styles.spinnerContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        </AuthLayout>
    );
};

const styles = StyleSheet.create({
    spinnerContainer: {
        marginTop: 48,
        alignItems: 'center',
    },
});

export default SplashScreen;