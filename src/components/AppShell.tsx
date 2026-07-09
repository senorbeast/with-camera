import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ReactNode } from "react";
import { Image, Text, useWindowDimensions, View } from "react-native";

import { styles } from "../styles";

const MMRCL_LOGO = require("../../assets/images/mmrcl_logo.png");
const VISHWASAMUDRA_LOGO = require("../../assets/images/vishwasamudra_logo.png");

function StatusItem({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <View style={styles.statusItem}>
      {active && <View style={styles.statusDot} />}
      <Text style={styles.statusLabel}>{label}</Text>
      <Text style={styles.statusValue}>{value}</Text>
    </View>
  );
}

function TopNav({ stationName, today }: { stationName: string; today: string }) {
  const { width } = useWindowDimensions();
  const compact = width < 640;

  if (compact) {
    return (
      <View>
        <View style={styles.systemRail}>
          <StatusItem label="VERSION" value="1.0.0" />
          <StatusItem label="EQUIPMENT" value="100205" />
          {/* <StatusItem label="USER" value="N/A" /> */}
          <StatusItem label="SHIFT" value="32" />
          <StatusItem label="PRINTER" value="C" active />
          <StatusItem label="QR SCANNER" value="C" active />
        </View>

        <View style={[styles.topNav, styles.topNavCompact]}>
          <View style={styles.compactMetaRow}>
            <View style={styles.brandBlock}>
              <Image source={MMRCL_LOGO} style={styles.brandLogo} resizeMode="contain" />
              <Text style={styles.brandText}>NHLML</Text>
            </View>

            <View style={styles.logoBlock}>
              <View style={styles.logoBadge}>
                <Image source={VISHWASAMUDRA_LOGO} style={styles.logoImage} resizeMode="contain" />
              </View>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-clear-outline" size={14} color="#fff1ec" />
                <Text style={styles.navDate} numberOfLines={1}>
                  {today}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.stationBlock, styles.stationBlockCompact]}>
            <View style={styles.stationTitleRow}>
              <FontAwesome6 name="train-subway" size={18} color="#fff4ef" />
              <Text style={[styles.navTitle, styles.navTitleCompact]} numberOfLines={2}>
                {stationName}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.systemRail}>
        <StatusItem label="VERSION" value="1.0.0" />
        <StatusItem label="EQUIPMENT" value="100205" />
        <StatusItem label="USER" value="N/A" />
        <StatusItem label="SHIFT" value="32" />
        <StatusItem label="PRINTER" value="C" active />
        <StatusItem label="QR SCANNER" value="C" active />
      </View>

      <View style={styles.topNav}>
        <View style={styles.brandBlock}>
          <Image source={MMRCL_LOGO} style={styles.brandLogo} resizeMode="contain" />
          <Text style={styles.brandText}>NHLML</Text>
        </View>

        <View style={styles.stationBlock}>
          <View style={styles.stationTitleRow}>
            <FontAwesome6 name="train-subway" size={20} color="#fff4ef" />
            <Text style={styles.navTitle} numberOfLines={2}>
              {stationName}
            </Text>
          </View>
        </View>

        <View style={styles.logoBlock}>
          <View style={styles.logoBadge}>
            <Image source={VISHWASAMUDRA_LOGO} style={styles.logoImage} resizeMode="contain" />
          </View>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-clear-outline" size={14} color="#fff1ec" />
            <Text style={styles.navDate} numberOfLines={1}>
              {today}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export function AppShell({
  stationName,
  today,
  children,
}: {
  stationName: string;
  today: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.app}>
      <TopNav stationName={stationName} today={today} />
      <View style={styles.screen}>{children}</View>
    </View>
  );
}
