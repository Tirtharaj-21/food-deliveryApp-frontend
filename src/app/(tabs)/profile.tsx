import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import colors from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  getAddressById,
} from "../../services/addressApi";
import { getProfile, updateProfile } from "../../services/profileApi";
import type { Address, AddressRequest } from "../../types/address";
import type { Profile } from "../../types/profile";

const EMPTY_ADDRESS_FORM: AddressRequest = {
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
};

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const userId = user ? Number(user.userId) : null;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] =
    useState<AddressRequest>(EMPTY_ADDRESS_FORM);
  const [savingAddress, setSavingAddress] = useState(false);

  const loadData = useCallback(async () => {
    if (userId == null || Number.isNaN(userId)) {
      setLoading(false);
      setError("User information is missing. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [profileData, addressData] = await Promise.all([
        getProfile(),
        getAddresses(userId),
      ]);

      console.log(
        "PROFILE ADDRESS DATA:",
        JSON.stringify(addressData, null, 2),
      );
      setProfile(profileData);
      setProfileForm({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone ?? "",
      });
      setAddresses(addressData);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError("Couldn't load your profile. Tap to try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveProfile = async () => {
    if (!userId) return;

    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      Alert.alert("First and last name are required.");
      return;
    }

    try {
      setSavingProfile(true);

      const updated = await updateProfile(userId, {
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phone: profileForm.phone.trim() || undefined,
      });

      setProfile(updated);
      setIsEditingProfile(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      Alert.alert("Something went wrong updating your profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async () => {
    if (!userId) return;

    const { addressLine, city, state, pincode } = addressForm;

    if (
      !addressLine?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !pincode?.trim()
    ) {
      Alert.alert("Please fill in all required address fields.");
      return;
    }

    try {
      setSavingAddress(true);

      // 1. Save address
      const addressId = await createAddress(userId, {
        addressLine: addressLine.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
      });

      console.log("CREATED ADDRESS ID:", addressId);

      // 2. Get complete address
      const createdAddress = await getAddressById(addressId, userId);

      console.log("CREATED ADDRESS:", JSON.stringify(createdAddress, null, 2));

      // 3. Add complete address to state
      setAddresses((prev) => [...prev, createdAddress]);

      // 4. Reset form
      setAddressForm(EMPTY_ADDRESS_FORM);
      setIsAddingAddress(false);
    } catch (err: any) {
      console.error("ADD ADDRESS ERROR");
      console.error("Message:", err?.message);
      console.error("Status:", err?.response?.status);
      console.error("Response:", err?.response?.data);
      console.error("URL:", err?.config?.url);
      console.error("Method:", err?.config?.method);

      Alert.alert(
        "Add Address Error",
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong adding that address.",
      );
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = (addressId: number, userId: number) => {
    Alert.alert(
      "Remove address",
      "Are you sure you want to remove this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAddress(userId, addressId);
              setAddresses((prev) =>
                prev.filter((item) => item.id !== addressId),
              );
            } catch (err) {
              console.error("Failed to delete address:", err);
              Alert.alert("Couldn't remove that address.");
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <Pressable style={styles.centered} onPress={loadData}>
        <Text style={styles.errorText}>{error}</Text>
      </Pressable>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          {profile?.profileImage ? (
            <Image
              source={{ uri: profile.profileImage }}
              style={styles.avatarImage}
            />
          ) : (
            <Ionicons name="person" size={40} color={colors.primary} />
          )}
        </View>

        {!isEditingProfile && (
          <>
            <Text style={styles.name}>
              {profile?.firstName} {profile?.lastName}
            </Text>

            <Text style={styles.email}>{profile?.email}</Text>

            {!!profile?.phone && (
              <Text style={styles.phone}>{profile.phone}</Text>
            )}

            <Pressable
              style={styles.editButton}
              onPress={() => setIsEditingProfile(true)}
            >
              <Text style={styles.editButtonText}>Edit profile</Text>
            </Pressable>
          </>
        )}
      </View>

      {isEditingProfile && (
        <View style={styles.formCard}>
          <Text style={styles.formLabel}>First name</Text>
          <TextInput
            style={styles.input}
            value={profileForm.firstName}
            onChangeText={(text) =>
              setProfileForm((prev) => ({ ...prev, firstName: text }))
            }
          />

          <Text style={styles.formLabel}>Last name</Text>
          <TextInput
            style={styles.input}
            value={profileForm.lastName}
            onChangeText={(text) =>
              setProfileForm((prev) => ({ ...prev, lastName: text }))
            }
          />

          <Text style={styles.formLabel}>Phone</Text>
          <TextInput
            style={styles.input}
            value={profileForm.phone}
            onChangeText={(text) =>
              setProfileForm((prev) => ({ ...prev, phone: text }))
            }
            keyboardType="phone-pad"
          />

          <View style={styles.formActions}>
            <Pressable
              style={[styles.formButton, styles.cancelButton]}
              onPress={() => {
                setIsEditingProfile(false);
                if (profile) {
                  setProfileForm({
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    phone: profile.phone ?? "",
                  });
                }
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[styles.formButton, styles.saveButton]}
              onPress={handleSaveProfile}
              disabled={savingProfile}
            >
              <Text style={styles.saveButtonText}>
                {savingProfile ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Addresses</Text>

          {!isAddingAddress && (
            <Pressable onPress={() => setIsAddingAddress(true)}>
              <Ionicons
                name="add-circle-outline"
                size={26}
                color={colors.primary}
              />
            </Pressable>
          )}
        </View>

        {addresses.length === 0 && !isAddingAddress && (
          <Text style={styles.emptyText}>No saved addresses yet.</Text>
        )}

        {addresses.map((address) => (
          <View key={address.id} style={styles.addressCard}>
            <View style={styles.addressInfo}>
              <Text style={styles.addressLine}>{address.addressLine}</Text>

              <Text style={styles.addressSubLine}>
                {address.city}, {address.state} {address.pincode}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                if (!user) return;
                handleDeleteAddress(address.id, user.userId);
              }}
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>
        ))}

        {isAddingAddress && (
          <View style={styles.formCard}>
            <Text style={styles.formLabel}>Address line </Text>
            <TextInput
              style={styles.input}
              value={addressForm.addressLine}
              onChangeText={(text) =>
                setAddressForm((prev) => ({ ...prev, addressLine: text }))
              }
            />

            <Text style={styles.formLabel}>City</Text>
            <TextInput
              style={styles.input}
              value={addressForm.city}
              onChangeText={(text) =>
                setAddressForm((prev) => ({ ...prev, city: text }))
              }
            />

            <Text style={styles.formLabel}>State</Text>
            <TextInput
              style={styles.input}
              value={addressForm.state}
              onChangeText={(text) =>
                setAddressForm((prev) => ({ ...prev, state: text }))
              }
            />

            <Text style={styles.formLabel}>Pincode</Text>
            <TextInput
              style={styles.input}
              value={addressForm.pincode}
              onChangeText={(text) =>
                setAddressForm((prev) => ({ ...prev, pincode: text }))
              }
            />

            <View style={styles.formActions}>
              <Pressable
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => {
                  setIsAddingAddress(false);
                  setAddressForm(EMPTY_ADDRESS_FORM);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.formButton, styles.saveButton]}
                onPress={handleAddAddress}
                disabled={savingAddress}
              >
                <Text style={styles.saveButtonText}>
                  {savingAddress ? "Saving..." : "Add"}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      <Pressable style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingBottom: 40,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 30,
  },

  errorText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },

  avatarSection: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFF1EB",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  name: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 18,
  },

  email: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 5,
  },

  phone: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 3,
  },

  editButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  editButtonText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 13,
  },

  formCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
  },

  formLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },

  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },

  formButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 10,
  },

  cancelButton: {
    backgroundColor: "#F1F1F1",
  },

  cancelButtonText: {
    color: colors.textSecondary,
    fontWeight: "700",
    fontSize: 13,
  },

  saveButton: {
    backgroundColor: colors.primary,
  },

  saveButtonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 13,
  },

  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 10,
  },

  addressCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
  },

  addressInfo: {
    flex: 1,
    marginRight: 10,
  },

  addressLine: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  addressSubLine: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  logoutButton: {
    marginTop: 30,
    marginHorizontal: 20,
    alignItems: "center",
    paddingVertical: 14,
  },

  logoutText: {
    color: "#E24C4C",
    fontWeight: "700",
    fontSize: 14,
  },
});
