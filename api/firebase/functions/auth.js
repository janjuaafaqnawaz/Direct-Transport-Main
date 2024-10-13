"use client";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { app } from "../config";
import { fetchAllEmail, fetchAllFirstNames, fetchDocById } from "./fetch";
import { deleteDocument } from "./upload";

const auth = getAuth(app);
const db = getFirestore();

const notify = (msg) => console.log(msg);

async function signUpWithEmail(email, password, userData) {
  try {
    const existingFirstNames = await fetchAllFirstNames();
    const existingEmails = await fetchAllEmail();

    if (existingFirstNames.includes(userData.firstName)) {
      alert("Username already exists");
      return false;
    }

    if (existingEmails.includes(email)) {
      alert("Email already exists");
      return false;
    }

    await saveUserDataToUserDoc(email, userData);

    notify("Sign up successful!");
    return true;
  } catch (error) {
    notify(error.message);
    throw error;
  }
}

async function signInWithEmail(usernameOrEmail, password) {
  try {
    const qWithUsername = query(
      collection(db, "users"),
      where("firstName", "==", usernameOrEmail),
      where("password", "==", password)
    );

    const qWithEmail = query(
      collection(db, "users"),
      where("email", "==", usernameOrEmail),
      where("password", "==", password)
    );

    const querySnapshotWithUsername = await getDocs(qWithUsername);
    const querySnapshotWithEmail = await getDocs(qWithEmail);

    if (querySnapshotWithUsername.empty && querySnapshotWithEmail.empty) {
      notify("User not found or invalid credentials");
      return false;
    }

    let userData;
    if (!querySnapshotWithUsername.empty) {
      userData = querySnapshotWithUsername.docs[0].data();
    } else {
      userData = querySnapshotWithEmail.docs[0].data();
    }

    await saveUserDataToUserDoc(userData.email, userData);
    localStorage.setItem("user", JSON.stringify(userData));
    await fetchUserData();
    // location.reload();
    window.location.href = "/";
    notify("Sign in successful!");
    return true;
  } catch (error) {
    notify(error.message);
    throw error;
  }
}

async function saveUserDataToUserDoc(email, userData) {
  try {
    const userDocRef = doc(db, "users", email);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      // The document exists, update it
      for (const key in userData) {
        if (userData.hasOwnProperty(key)) {
          await updateDoc(userDocRef, { [key]: userData[key] });
        }
      }
    } else {
      // The document doesn't exist, create a new one
      await setDoc(userDocRef, userData);
    }

    notify("Info Updated!");
  } catch (error) {
    notify(error.message);
  }
}

async function fetchUserData() {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    const userData = await fetchDocById(user.email, "users");
    localStorage.setItem("userDoc", JSON.stringify(userData));
    return userData;
  } catch (error) {
    notify(error.message);
    return null;
  }
}

async function userRole() {
  try {
    const role =
      (JSON.parse(localStorage.getItem("userDoc")) || {}).role || null;
    (JSON.parse(localStorage.getItem("user")) || {}).role || null;
    return role;
  } catch (error) {
    notify(error.message);
    return null;
  }
}

async function logout() {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("userDoc");
    location.reload();
    notify("Logout Successfully");
    return true;
  } catch (error) {
    notify(error.message);
    return null;
  }
}

async function sendPasswordResetEmailLink(email, password) {
  try {
    notify(`Password reset email sent to ${email}`);
  } catch (error) {
    notify(error.message);
  }
}
async function ResetPassword(email, oldPassword, newPassword) {
  try {
    const q = query(
      collection(db, "users"),
      where("email", "==", email),
      where("password", "==", oldPassword) // Changed 'password' to 'oldPassword'
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      notify("User not found or invalid credentials");
    }

    const userData = querySnapshot.docs[0].data();

    await saveUserDataToUserDoc(email, {
      ...userData,
      password: newPassword,
      oldPassword: oldPassword, // Added oldPassword to update
    });

    notify("Password changed"); // Corrected the spelling of 'changed'

    // Password reset successful
    return { success: true, message: "Password reset successfully." };
  } catch (error) {
    // Password reset failed
    return { success: false, message: error.message };
  }
}

const deleteUserAcc = async (email, pass) => {
  try {
    // Display a confirmation dialog
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the account for ${email}?`
    );

    if (!isConfirmed) {
      return false;
    }

    const user = await fetchDocById(email, "users");

    if (!user) {
      notify("No matching user document found.");
      return false;
    }

    const res = await deleteDocument("users", email);
    console.log(res);

    notify(`Successfully deleted ${user.email}.`);

    return true;
  } catch (error) {
    console.log("Error deleting user", error);
    notify(error.message); // Notify the user about the error
    return false;
  }
};

async function verifyAuth() {
  const storedUserData = localStorage.getItem("user");

  if (!storedUserData) {
    window.location.href = "/Signin";
    console.log("go Signin");
    return null;
  }

  try {
    const user = JSON.parse(storedUserData);

    const userData = await fetchDocById(user.email, "users");

    localStorage.setItem("userDoc", JSON.stringify(userData));

    return userData;
  } catch (error) {
    notify(error.message);
    localStorage.removeItem("user");
    localStorage.removeItem("userDoc");
    window.location.href = "/Signin";
    console.log("go Signin");

    return null;
  }
}
async function verifyAuthNotNav() {
  const storedUserData = localStorage.getItem("user");

  if (!storedUserData) {
    console.log("go Signin");
    return null;
  }

  try {
    const user = JSON.parse(storedUserData);

    const userData = await fetchDocById(user.email, "users");

    localStorage.setItem("userDoc", JSON.stringify(userData));

    return userData;
  } catch (error) {
    notify(error.message);
    localStorage.removeItem("user");
    localStorage.removeItem("userDoc");
    console.log("go Signin");

    return null;
  }
}

export {
  signUpWithEmail,
  signInWithEmail,
  saveUserDataToUserDoc,
  fetchUserData,
  userRole,
  ResetPassword,
  logout,
  sendPasswordResetEmailLink,
  deleteUserAcc,
  verifyAuth,
  verifyAuthNotNav,
};
