import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_USER_KEY = "@food_delivery_auth_user";
const ONBOARDING_KEY = "@food_delivery_onboarding_completed";

/**
 * Store the authenticated user locally.
 *
 * AsyncStorage stores strings, so the user object
 * needs to be serialized with JSON.stringify().
 */
export const saveAuthUser = async (
  user: object
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify(user)
    );
  } catch (error) {
    console.error("Failed to save auth user:", error);
    throw error;
  }
};

/**
 * Retrieve the authenticated user from local storage.
 *
 * Returns null when there is no saved session.
 */
export const getAuthUser = async () => {
  try {
    const storedUser = await AsyncStorage.getItem(AUTH_USER_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Failed to retrieve auth user:", error);
    return null;
  }
};

/**
 * Remove the authenticated user.
 */
export const removeAuthUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_USER_KEY);
  } catch (error) {
    console.error("Failed to remove auth user:", error);
    throw error;
  }
};

/**
 * Mark onboarding as completed on this device.
 */
export const setOnboardingCompleted = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
  } catch (error) {
    console.error("Failed to set onboarding completed:", error);
    throw error;
  }
};

/**
 * Check whether onboarding has already been
 * completed on this device.
 */
export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === "true";
  } catch (error) {
    console.error("Failed to read onboarding status:", error);
    return false;
  }
};

/**
 * Grouped export so callers can do `storage.method()`.
 */
export const storage = {
  saveAuthUser,
  getAuthUser,
  removeAuthUser,
  setOnboardingCompleted,
  hasCompletedOnboarding,
};