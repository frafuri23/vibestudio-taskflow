import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { isToday, parseISO } from "date-fns";
import { colors, spacing, radius, type, shadow } from "../lib/theme";
import { useTaskStore } from "../lib/store";
import TaskRow from "../components/TaskRow";
import EmptyState from "../components/EmptyState";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;
type Filter = "today" | "all" | "done";

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { tasks, lists, hydrate, hydrated, toggleTask } = useTaskStore();
  const [filter, setFilter] = useState<Filter>("today");
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 280, useNativeDriver: true }).start();
  }, []);

  const listById = useMemo(() => {
    const map: Record<string, (typeof lists)[number]> = {};
    lists.forEach((l) => (map[l.id] = l));
    return map;
  }, [lists]);

  const filtered = useMemo(() => {
    let base = tasks;
    if (filter === "today") {
      // "Oggi" shows: tasks with no due date, tasks due today, and overdue tasks (any list) — all still pending.
      base = tasks.filter((t) => {
        if (t.completed) return false;
        if (!t.dueDate) return true;
        const due = parseISO(t.dueDate);
        return isToday(due) || due < new Date();
      });
    } else if (filter === "done") {
      base = tasks.filter((t) => t.completed);
    } else {
      base = tasks.filter((t) => !t.completed);
    }
    return [...base].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });
  }, [tasks, filter]);

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const doneToday = tasks.filter((t) => t.completed && t.completedAt && isToday(parseISO(t.completedAt))).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View style={{ opacity: fade, flex: 1 }}>
        <LinearGradient
          colors={[colors.accent, "#8B7CF7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroGreeting}>Le tue attività</Text>
              <Text style={styles.heroTitle}>TaskFlow</Text>
            </View>
            <Pressable
              style={styles.listsBtn}
              onPress={() => navigation.navigate("Lists")}
              hitSlop={8}
            >
              <Ionicons name="folder-outline" size={20} color={colors.white} />
            </Pressable>
          </View>

          <View style={styles.heroStats}>
            <View style={styles.statBlock}>
              <Text style={styles.statNumber}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Da fare</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statNumber}>{doneToday}</Text>
              <Text style={styles.statLabel}>Fatte oggi</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.tabs}>
          {(
            [
              { key: "today", label: "Oggi" },
              { key: "all", label: "Tutte" },
              { key: "done", label: "Completate" },
            ] as { key: Filter; label: string }[]
          ).map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setFilter(tab.key)}
              style={[styles.tab, filter === tab.key && styles.tabActive]}
            >
              <Text style={[styles.tabText, filter === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {!hydrated ? (
          <View style={styles.center}>
            <Text style={styles.loadingText}>Caricamento...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="checkmark-done-circle-outline"
            title="Niente da fare qui"
            subtitle={
              filter === "today"
                ? "Aggiungi una nuova attività per iniziare la giornata"
                : filter === "done"
                ? "Le attività completate appariranno qui"
                : "Aggiungi la tua prima attività"
            }
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + 110 }}
            renderItem={({ item }) => (
              <TaskRow
                task={item}
                list={listById[item.listId]}
                onToggle={() => toggleTask(item.id)}
                onPress={() => navigation.navigate("TaskDetail", { taskId: item.id })}
              />
            )}
          />
        )}
      </Animated.View>

      <Pressable
        style={[styles.fab, { bottom: insets.bottom + spacing.xl }]}
        onPress={() => navigation.navigate("AddTask", {})}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.xl,
    ...shadow.floating,
  },
  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  heroGreeting: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "600" },
  heroTitle: { color: colors.white, fontSize: 26, fontWeight: "800", marginTop: 2 },
  listsBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroStats: { flexDirection: "row", marginTop: spacing.xl, alignItems: "center" },
  statBlock: { flex: 1 },
  statNumber: { color: colors.white, fontSize: 30, fontWeight: "800" },
  statLabel: { color: "rgba(255,255,255,0.75)", fontSize: 12.5, fontWeight: "600", marginTop: 2 },
  statDivider: { width: 1, height: 34, backgroundColor: "rgba(255,255,255,0.25)", marginHorizontal: spacing.lg },
  tabs: {
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: { flex: 1, paddingVertical: 9, borderRadius: radius.sm, alignItems: "center" },
  tabActive: { backgroundColor: colors.accentTint },
  tabText: { ...type.caption, color: colors.mutedText, textTransform: "none" },
  tabTextActive: { color: colors.accent },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { ...type.bodyRegular, color: colors.mutedText },
  fab: {
    position: "absolute",
    right: spacing.xl,
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.floating,
  },
});
