import React, { createContext, useState, useEffect,useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';

// Firebase config - you'll need to replace this with your actual config
const firebaseConfig = {

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  fitbitConnected: false,
  setFitbitConnected: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fitbitConnected, setFitbitConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Expose createUserWithEmailAndPassword for direct use (e.g., with extra profile fields)
  const registerWithEmail = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    setFitbitConnected(false);
    return signOut(auth);
  };

  const updateUserProfile = async (displayName) => {
    if (auth.currentUser) {
      return updateProfile(auth.currentUser, { displayName });
    }
    throw new Error('No user is currently signed in');
  };

  const value = useMemo(() => ({
    user,
    loading,
    login,
    signup,
    logout,
    createUserWithEmailAndPassword: registerWithEmail,
    updateUserProfile,
    fitbitConnected,
    setFitbitConnected,
  }), [user, loading, fitbitConnected]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
