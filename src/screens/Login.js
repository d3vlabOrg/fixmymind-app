import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthLayout from '../components/layout/AuthLayout';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';

const LoginScreen = () => {
    const navigation = useNavigation();
    const { login, loginWithGoogle } = useSupabaseAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const data = await login(email, password);
            if (data && navigation) {
                navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const data = await loginWithGoogle();
            if (data && navigation) {
                navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
            }
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    return (
        <AuthLayout>
            <View style={styles.container}>
                <Text style={styles.title}>Zaloguj się</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Hasło"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Zaloguj się</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
                    <Text style={styles.buttonText}>Zaloguj przez Google</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.link}>Nie masz konta? Zarejestruj się</Text>
                </TouchableOpacity>

                <Text style={styles.infoText}>
                    🛡 Twoje dane są przechowywane anonimowo. Nawet administratorzy nie mają dostępu do tego, kim jesteś.
                    Sesje terapeutyczne nie są powiązane z Twoją tożsamością.
                </Text>
            </View>
        </AuthLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        width: '100%',
        backgroundColor: '#4b3cc2',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    googleButton: {
        width: '100%',
        backgroundColor: '#db4437',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    link: {
        color: '#fff',
        textDecorationLine: 'underline',
        fontSize: 14,
        marginBottom: 12,
    },
    infoText: {
        fontSize: 12,
        color: '#ddd',
        textAlign: 'center',
        paddingTop: 12,
        paddingHorizontal: 4,
    },
});

export default LoginScreen;
