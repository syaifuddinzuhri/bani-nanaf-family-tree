// plugins/firebase.client.ts
import { initializeApp, type FirebaseOptions } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export default defineNuxtPlugin(() => {
    // Ambil config dan beri tahu TS bahwa ini adalah FirebaseOptions
    const config = useRuntimeConfig().public.firebase as FirebaseOptions

    // Pastikan config tidak kosong sebelum init
    if (!config.apiKey) {
        console.error("Firebase config is missing! Check your .env file.")
    }

    const app = initializeApp(config)
    const db = getFirestore(app)
    const auth = getAuth(app)

    return {
        provide: {
            db,
            auth
        }
    }
})