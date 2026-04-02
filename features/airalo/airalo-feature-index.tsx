import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import ChartBarIcon from "@/components/icons/ChartBarIcon";
import WorldIcon from "@/components/icons/WorldIcon";
import DialpadIcon from "@/components/icons/DialpadIcon";
import GearIcon from "@/components/icons/GearIcon";
import TelephoneIcon from "@/components/icons/TelephoneIcon";
import MailFilledIcon from "@/components/icons/MailFilledIcon";
import QuestionMark from "@/components/icons/QuestionMark";

const COUNTRIES = [
  { id: "1", name: "United States", flag: "🇺🇸", price: "$4.50" },
  { id: "2", name: "United Kingdom", flag: "🇬🇧", price: "$5.00" },
  { id: "3", name: "Japan", flag: "🇯🇵", price: "$4.00" },
  { id: "4", name: "Thailand", flag: "🇹🇭", price: "$3.50" },
  { id: "5", name: "United Arab Emirates", flag: "🇦🇪", price: "$6.00" },
  { id: "6", name: "Singapore", flag: "🇸🇬", price: "$4.50" },
];

export function AiraloFeatureIndex() {
  const [activeTab, setActiveTab] = useState("data-plans");

  const renderDataPlans = () => (
    <View style={styles.section}>
      <Text style={styles.heading}>Popular Countries</Text>
      <View style={styles.list}>
        {COUNTRIES.map((country) => (
          <View key={country.id} style={styles.countryCard}>
            <View style={styles.countryLeft}>
              <Text style={styles.flag}>{country.flag}</Text>
              <Text style={styles.countryName}>{country.name}</Text>
            </View>
            <View style={styles.countryRight}>
              <Text style={styles.countryPrice}>from {country.price}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderHelp = () => (
    <View style={styles.section}>
      <Text style={styles.heading}>Help Center</Text>
      <View style={styles.helpList}>
        <View style={styles.helpCard}>
          <TelephoneIcon size={32} color="#ffffff" />
          <View style={styles.helpTextContainer}>
            <Text style={styles.helpTitle}>Contact Tech Support</Text>
            <Text style={styles.helpDescription}>
              24/7 technical assistance for connectivity issues.
            </Text>
          </View>
        </View>

        <View style={styles.helpCard}>
          <MailFilledIcon size={32} color="#ffffff" />
          <View style={styles.helpTextContainer}>
            <Text style={styles.helpTitle}>Contact via Email</Text>
            <Text style={styles.helpDescription}>
              Send us an email and we'll reply within 24 hours.
            </Text>
          </View>
        </View>

        <View style={styles.helpCard}>
          <QuestionMark size={32} color="#ffffff" />
          <View style={styles.helpTextContainer}>
            <Text style={styles.helpTitle}>FAQ</Text>
            <Text style={styles.helpDescription}>
              Find answers to common questions about eSIMs.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "data-plans":
        return renderDataPlans();
      case "help":
        return renderHelp();
      case "pay-and-fly":
      case "virtual-number":
        return (
          <View style={styles.centeredPlaceholder}>
            <Text style={styles.placeholderText}>
              Coming Soon: {activeTab.replace(/-/g, " ").toUpperCase()}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        {renderContent()}
      </ScrollView>

      {/* Bottom Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
          <Pressable
            style={[styles.tab, activeTab === "data-plans" && styles.activeTab]}
            onPress={() => setActiveTab("data-plans")}
          >
            <ChartBarIcon size={20} color={activeTab === "data-plans" ? "#4f46e5" : "#9ca3af"} />
            <Text style={[styles.tabText, activeTab === "data-plans" && styles.activeTabText]}>
              Data Plans
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === "pay-and-fly" && styles.activeTab]}
            onPress={() => setActiveTab("pay-and-fly")}
          >
            <WorldIcon size={20} color={activeTab === "pay-and-fly" ? "#4f46e5" : "#9ca3af"} />
            <Text style={[styles.tabText, activeTab === "pay-and-fly" && styles.activeTabText]}>
              Pay and Fly
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === "virtual-number" && styles.activeTab]}
            onPress={() => setActiveTab("virtual-number")}
          >
            <DialpadIcon size={20} color={activeTab === "virtual-number" ? "#4f46e5" : "#9ca3af"} />
            <Text style={[styles.tabText, activeTab === "virtual-number" && styles.activeTabText]}>
              Virtual Number
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === "help" && styles.activeTab]}
            onPress={() => setActiveTab("help")}
          >
            <GearIcon size={20} color={activeTab === "help" ? "#4f46e5" : "#9ca3af"} />
            <Text style={[styles.tabText, activeTab === "help" && styles.activeTabText]}>
              Help
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a", // Match dark modern Aura aesthetic
  },
  tabContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(10, 10, 10, 0.95)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  tabScrollContent: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  activeTab: {
    backgroundColor: "rgba(79, 70, 229, 0.1)", // indigo tint
    borderColor: "#4f46e5",
  },
  tabText: {
    color: "#9ca3af",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 14,
  },
  activeTabText: {
    color: "#4f46e5",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    marginBottom: 80, // Space for bottom tabs
  },
  section: {
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  list: {
    gap: 12,
  },
  countryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  countryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  flag: {
    fontSize: 28,
  },
  countryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  countryRight: {
    alignItems: "flex-end",
  },
  countryPrice: {
    fontSize: 14,
    color: "#9ca3af",
    fontWeight: "500",
  },
  helpList: {
    gap: 16,
  },
  helpCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    gap: 16,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 13,
    color: "#9ca3af",
    lineHeight: 18,
  },
  centeredPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  placeholderText: {
    color: "#9ca3af",
    fontSize: 16,
    fontWeight: "600",
  },
});
