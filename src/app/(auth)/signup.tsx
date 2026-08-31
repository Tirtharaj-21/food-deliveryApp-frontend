import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik, FormikHelpers } from "formik";

import CustomButton from "../../components/CustomButton";
import InputField from "../../components/InputField";
import colors from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { signupSchema } from "../../utils/validationSchemas";

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialValues: SignupFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignupScreen = () => {
  const { signup } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [authError, setAuthError] = useState("");

  const handleSignup = async (
    values: SignupFormValues,
    { setSubmitting }: FormikHelpers<SignupFormValues>
  ) => {
    try {
      setAuthError("");

      await signup(
        values.name.trim(),
        values.email.trim(),
        values.password
      );

      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Signup failed:", error);

      setAuthError(
        "Unable to create your account. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.text}
          />
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>
            Create your account
          </Text>

          <Text style={styles.subtitle}>
            Join Foodie and start ordering delicious
            meals.
          </Text>
        </View>

        {authError ? (
          <View style={styles.errorBanner}>
            <Ionicons
              name="alert-circle"
              size={20}
              color={colors.danger}
            />

            <Text style={styles.errorBannerText}>
              {authError}
            </Text>
          </View>
        ) : null}

        <Formik
          initialValues={initialValues}
          validationSchema={signupSchema}
          onSubmit={handleSignup}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <View>
              <InputField
                label="Full Name"
                placeholder="Enter your full name"
                autoCapitalize="words"
                leftIcon="person-outline"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                error={errors.name}
                touched={touched.name}
              />

              <InputField
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon="mail-outline"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                error={errors.email}
                touched={touched.email}
              />

              <InputField
                label="Password"
                placeholder="Create a password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                leftIcon="lock-closed-outline"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={errors.password}
                touched={touched.password}
              />

              <Pressable
                onPress={() =>
                  setShowPassword((current) => !current)
                }
                style={styles.passwordToggle}
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={18}
                  color={colors.textSecondary}
                />

                <Text style={styles.passwordToggleText}>
                  {showPassword
                    ? "Hide password"
                    : "Show password"}
                </Text>
              </Pressable>

              <InputField
                label="Confirm Password"
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                leftIcon="shield-checkmark-outline"
                value={values.confirmPassword}
                onChangeText={handleChange(
                  "confirmPassword"
                )}
                onBlur={handleBlur("confirmPassword")}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
              />

              <Pressable
                onPress={() =>
                  setShowConfirmPassword(
                    (current) => !current
                  )
                }
                style={styles.passwordToggle}
              >
                <Ionicons
                  name={
                    showConfirmPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={18}
                  color={colors.textSecondary}
                />

                <Text style={styles.passwordToggleText}>
                  {showConfirmPassword
                    ? "Hide password"
                    : "Show password"}
                </Text>
              </Pressable>

              <CustomButton
                title="Create Account"
                onPress={() => handleSubmit()}
                loading={isSubmitting}
                style={styles.signupButton}
              />
            </View>
          )}
        </Formik>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>

          <Pressable
            onPress={() =>
              router.replace("/(auth)/login")
            }
          >
            <Text style={styles.loginLink}>
              {" "}
              Sign In
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 55,
    paddingBottom: 30,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  header: {
    marginBottom: 28,
  },

  title: {
    fontSize: 29,
    fontWeight: "800",
    color: colors.text,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginTop: 8,
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },

  errorBannerText: {
    flex: 1,
    color: colors.danger,
    fontSize: 13,
    marginLeft: 8,
  },

  passwordToggle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: -8,
    marginBottom: 16,
  },

  passwordToggleText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginLeft: 6,
  },

  signupButton: {
    marginTop: 10,
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },

  loginText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  loginLink: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },
});