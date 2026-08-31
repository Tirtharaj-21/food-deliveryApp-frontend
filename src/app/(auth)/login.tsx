import React, { useState } from "react";
import {
  Alert,
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
import { loginSchema } from "../../utils/validationSchemas";

interface LoginFormValues {
  email: string;
  password: string;
}

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

const LoginScreen = () => {
  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [authError, setAuthError] = useState("");

  const handleLogin = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      setAuthError("");

      await login(
        values.email.trim(),
        values.password
      );

      // AuthContext updates the user state.
      // Root routing will then render the authenticated app.
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Login failed:", error);

      setAuthError(
        "Unable to sign in. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Password reset is not connected to a backend in this assessment."
    );
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
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons
              name="restaurant"
              size={28}
              color={colors.white}
            />
          </View>

          <Text style={styles.title}>
            Welcome back!
          </Text>

          <Text style={styles.subtitle}>
            Sign in to continue ordering your favorite
            food.
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
          validationSchema={loginSchema}
          onSubmit={handleLogin}
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
                placeholder="Enter your password"
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

              <Pressable
                onPress={handleForgotPassword}
                style={styles.forgotButton}
              >
                <Text style={styles.forgotText}>
                  Forgot Password?
                </Text>
              </Pressable>

              <CustomButton
                title="Sign In"
                onPress={() => handleSubmit()}
                loading={isSubmitting}
                style={styles.loginButton}
              />
            </View>
          )}
        </Formik>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            Don't have an account?
          </Text>

          <Pressable
            onPress={() =>
              router.push("/(auth)/signup")
            }
          >
            <Text style={styles.signupLink}>
              {" "}
              Sign Up
            </Text>
          </Pressable>
        </View>

        <Text style={styles.demoText}>
          Demo authentication — no backend required
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 30,
  },

  header: {
    marginBottom: 32,
  },

  logo: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },

  title: {
    fontSize: 30,
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
  },

  passwordToggleText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginLeft: 6,
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 16,
    marginBottom: 20,
  },

  forgotText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },

  loginButton: {
    marginTop: 4,
  },

  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },

  signupText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  signupLink: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },

  demoText: {
    textAlign: "center",
    color: colors.textLight,
    fontSize: 11,
    marginTop: 25,
  },
});