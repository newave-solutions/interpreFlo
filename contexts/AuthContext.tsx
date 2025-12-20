'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  sendPasswordResetEmail,
  AuthError
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: FirebaseUser | null;
  session: FirebaseUser | null; // Firebase doesn't have sessions like Supabase, using user instead
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithMicrosoft: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const profileDoc = await getDoc(doc(db, 'user_profiles', userId));
      
      if (profileDoc.exists()) {
        const data = profileDoc.data();
        setProfile({
          id: profileDoc.id,
          email: data.email || '',
          full_name: data.full_name,
          organization: data.organization,
          job_title: data.job_title,
          experience_level: data.experience_level,
          languages: data.languages || [],
          avatar_url: data.avatar_url,
          created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
          updated_at: data.updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        });
      } else {
        // Create profile if it doesn't exist (for existing users)
        const user = auth.currentUser;
        if (user) {
          const newProfile: UserProfile = {
            id: user.uid,
            email: user.email || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          await setDoc(doc(db, 'user_profiles', user.uid), {
            ...newProfile,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
          });
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const profileData: Omit<UserProfile, 'id'> = {
        email: user.email || email,
        full_name: fullName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await setDoc(doc(db, 'user_profiles', user.uid), {
        ...profileData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      // Create user progress entry
      await setDoc(doc(db, 'user_progress', user.uid), {
        user_id: user.uid,
        total_practice_time: 0,
        scenarios_completed: 0,
        average_score: 0,
        streak_days: 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Create profile if doesn't exist
      const profileDoc = await getDoc(doc(db, 'user_profiles', userCredential.user.uid));
      if (!profileDoc.exists()) {
        await setDoc(doc(db, 'user_profiles', userCredential.user.uid), {
          email: userCredential.user.email || '',
          full_name: userCredential.user.displayName || '',
          avatar_url: userCredential.user.photoURL || '',
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
        
        // Create user progress entry
        await setDoc(doc(db, 'user_progress', userCredential.user.uid), {
          user_id: userCredential.user.uid,
          total_practice_time: 0,
          scenarios_completed: 0,
          average_score: 0,
          streak_days: 0,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signInWithMicrosoft = async () => {
    try {
      const provider = new OAuthProvider('microsoft.com');
      const userCredential = await signInWithPopup(auth, provider);
      
      // Create profile if doesn't exist
      const profileDoc = await getDoc(doc(db, 'user_profiles', userCredential.user.uid));
      if (!profileDoc.exists()) {
        await setDoc(doc(db, 'user_profiles', userCredential.user.uid), {
          email: userCredential.user.email || '',
          full_name: userCredential.user.displayName || '',
          avatar_url: userCredential.user.photoURL || '',
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
        
        // Create user progress entry
        await setDoc(doc(db, 'user_progress', userCredential.user.uid), {
          user_id: userCredential.user.uid,
          total_practice_time: 0,
          scenarios_completed: 0,
          average_score: 0,
          streak_days: 0,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      await updateDoc(doc(db, 'user_profiles', user.uid), {
        ...updates,
        updated_at: serverTimestamp(),
      });
      await fetchProfile(user.uid);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value = {
    user,
    session: user, // Firebase uses user instead of session
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithMicrosoft,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
