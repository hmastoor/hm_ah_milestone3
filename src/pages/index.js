import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import firebaseApp from '../firebase';

export default function Home() {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(''); // To store and display the user type
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        setUser(user);
        // Fetch the user type from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserType(userDoc.data().userType);
        } else {
          console.error("User data not found in Firestore.");
        }
      } else {
        setUser(null);
        setUserType(''); // Clear user type when signed out
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Set user type only during sign up
      if (isSignUp) {
        await setDoc(doc(db, "users", user.uid), {
          email: email,
          userType: userType
        });
      }
      setEmail('');
      setPassword('');
      setUserType('');
      alert('User created successfully!');
    } catch (error) {
      console.error('Error during sign up:', error.message);
      alert('Failed to create user: ' + error.message);
    }
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      alert('Signed in successfully!');
    } catch (error) {
      console.error('Error during sign in:', error.message);
      alert('Failed to sign in: ' + error.message);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <div>
      <h1>Welcome to My Portfolio</h1>
      {user ? (
        <>
          <p>You are signed in as {user.email} ({userType})</p>
          <button onClick={handleSignOut}>Sign out</button>
        </>
      ) : (
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
          {isSignUp && (
            <select value={userType} onChange={e => setUserType(e.target.value)} required>
              <option value="">Select User Type...</option>
              <option value="investor">Investor</option>
              <option value="creator">Creator</option>
            </select>
          )}
          <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
          <br></br>
          <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
            Switch to {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
      )}
    </div>
  );
}
