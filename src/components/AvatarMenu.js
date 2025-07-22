import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function AvatarMenu() {
    const { user, logout } = useAuth();
    const navigation = useNavigation();
    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
        : user?.email?.[0]?.toUpperCase() ?? '?';

    const [modalVisible, setModalVisible] = useState(false);

    const handleLogout = async () => {
        setModalVisible(false);
        await logout();
        if (navigation) {
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
    };

    const handleNavigate = (screen) => {
        setModalVisible(false);
        navigation.navigate(screen);
    };

    return (
        <View>
            <Pressable style={styles.avatarButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.avatarText}>{initials}</Text>
            </Pressable>

            <Modal
                animationType="fade"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalEmail}>{user?.email}</Text>

                        <Pressable onPress={() => handleNavigate('UserProfile')} style={styles.menuItem}>
                            <Text style={styles.menuText}>👤 Profil</Text>
                        </Pressable>

                        <Pressable onPress={() => handleNavigate('PaymentPlans')} style={styles.menuItem}>
                            <Text style={styles.menuText}>💳 Pakiety</Text>
                        </Pressable>

                        <Pressable onPress={() => handleNavigate('Main')} style={styles.menuItem}>
                            <Text style={styles.menuText}>📝 Sesje</Text>
                        </Pressable>

                        <Pressable onPress={handleLogout} style={styles.logoutButton}>
                            <Text style={styles.logoutText}>📤 Wyloguj się</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    avatarButton: {
        backgroundColor: '#6B46C1',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 60,
        paddingRight: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        width: 220,
        elevation: 5,
    },
    modalEmail: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
        fontWeight: 'bold',
    },
    menuItem: {
        paddingVertical: 10,
    },
    menuText: {
        fontSize: 15,
        color: '#333',
    },
    logoutButton: {
        marginTop: 10,
        backgroundColor: '#6B46C1',
        paddingVertical: 10,
        borderRadius: 6,
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});