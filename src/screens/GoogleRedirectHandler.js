import { useEffect, useState } from 'react';
import { supabase } from '../utils/SupabaseService';

export default function GoogleRedirectHandler() {
    const [status, setStatus] = useState('Oczekiwanie na token...');

    const handleSupabaseOAuthCallback = async () => {
        try {
            console.log('🔍 Processing Supabase OAuth callback...');
            
            // Let Supabase handle the OAuth callback automatically
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
                console.error('🔍 Error getting session after OAuth:', error);
                setStatus('❌ Błąd podczas uwierzytelniania.');
                return;
            }

            if (data.session) {
                console.log('🔍 Session established successfully:', !!data.session.user);
                setStatus('✅ Uwierzytelnienie zakończone sukcesem. Przekierowuję...');
                
                // Redirect to main app after successful authentication
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                console.log('🔍 No session found, trying to exchange tokens...');
                // If no session, try to handle the OAuth callback manually
                const { data: authData, error: authError } = await supabase.auth.getUser();
                
                if (authError) {
                    console.error('🔍 Error getting user after OAuth:', authError);
                    setStatus('❌ Błąd podczas pobierania danych użytkownika.');
                } else if (authData.user) {
                    console.log('🔍 User authenticated successfully:', !!authData.user);
                    setStatus('✅ Uwierzytelnienie zakończone sukcesem. Przekierowuję...');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                } else {
                    setStatus('❌ Nie udało się uwierzytelnić użytkownika.');
                }
            }
        } catch (error) {
            console.error('🔍 Unexpected error in OAuth callback:', error);
            setStatus('❌ Nieoczekiwany błąd podczas uwierzytelniania.');
        }
    };

    useEffect(() => {
        console.log('🔍 GoogleRedirectHandler: Starting OAuth callback processing');
        console.log('🔍 Current URL:', window.location.href);
        console.log('🔍 Hash:', window.location.hash);
        console.log('🔍 Search params:', window.location.search);
        
        const hashParams = new URLSearchParams(window.location.hash.slice(1)); // usuń #
        const searchParams = new URLSearchParams(window.location.search);
        const id_token = hashParams.get('id_token') || searchParams.get('id_token');
        const access_token = hashParams.get('access_token') || searchParams.get('access_token');
        const refresh_token = hashParams.get('refresh_token') || searchParams.get('refresh_token');
        
        console.log('🔍 Extracted tokens:', { id_token: !!id_token, access_token: !!access_token, refresh_token: !!refresh_token });
        console.log('🔍 Window opener exists:', !!window.opener);
        console.log('🔍 Is popup flow:', !!window.opener);

        if (id_token && window.opener) {
            // Popup flow
            console.log('🔍 Using popup flow - posting message to opener');
            window.opener.postMessage({
                source: 'fixmymind-google-auth',
                id_token,
                access_token,
                refresh_token,
            }, '*');
            setStatus('✅ Token wysłany. Zamykam...');
            setTimeout(() => window.close(), 500);
        } else if (id_token || access_token) {
            // Redirect flow - handle tokens directly
            console.log('🔍 Using redirect flow - handling tokens directly');
            setStatus('✅ Tokeny otrzymane. Przekierowuję...');
            
            // Handle the OAuth callback using Supabase's built-in method
            handleSupabaseOAuthCallback();
        } else {
            console.log('🔍 No tokens found or no opener window');
            setStatus('❌ Brak tokena lub brak okna nadrzędnego.');
        }
    }, []);

    return (
        <div style={{
            color: '#fff',
            backgroundColor: '#111',
            padding: 32,
            fontFamily: 'sans-serif',
            textAlign: 'center',
        }}>
            <h2>FixMyMind</h2>
            <p>{status}</p>
        </div>
    );
}