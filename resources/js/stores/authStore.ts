import { defineStore } from 'pinia';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth } from '@/firebase';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { uid: string; email: string } | null,
    token: localStorage.getItem('firebase_token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async initAuth(): Promise<void> {
      return new Promise((resolve) => {
        if (auth.currentUser) {
          this.user = {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email ?? '',
          };
          auth.currentUser.getIdToken().then((idToken) => {
            this.token = idToken;
            axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
            resolve();
          });
        } else {
          onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
              const idToken = await getIdToken(firebaseUser);
              this.user = {
                uid: firebaseUser.uid,
                email: firebaseUser.email ?? '',
              };
              this.token = idToken;
              localStorage.setItem('firebase_uid', firebaseUser.uid);
              localStorage.setItem('firebase_token', idToken);
              axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
            } else {
              this.user = null;
              this.token = null;
              localStorage.removeItem('firebase_uid');
              localStorage.removeItem('firebase_token');
              delete axios.defaults.headers.common['Authorization'];
            }
            resolve();
          });
        }
      });
    },

    async logout() {
      await auth.signOut();
      this.user = null;
      this.token = null;
      localStorage.removeItem('firebase_uid');
      localStorage.removeItem('firebase_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  },
});
