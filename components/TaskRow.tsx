import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format, isToday, isPast, parseISO } from "date-fns";
import { colors, radius, spacing, type, priorityColor } from "../lib/theme";
import { Task, TaskList } from "../lib/types";

type Props = {
  task: Task;
  list?: TaskList;
  onToggle: () => void;
  onPress: () => void;
};

export default function TaskRow({ task, list, onToggle, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => Animated.timing(scale, { toValue: 0.985, duration: 90, useNativeDriver: true }).start();
  const pressOut = () => Animated.timing(scale, { toValue: 1, duration: 90, useNativeDriver: true }).start();

  const due = task.dueDate ? parseISO(task.dueDate) : null;
  const overdue = !!due && !task.completed && isPast(due) && !isToday(due);
  const dueLabel = due ? (isToday(due) ? "Oggi" : format(due, "d MMM")) : null;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={styles.row}
      >
        <Pressable hitSlop={10} onPress={onToggle} style={styles.checkWrap}>
          <View
            style={[
              styles.check,
              task.completed && { backgroundColor: colors.accent, borderColor: colors.accent },
            ]}
          >
            {task.completed && <Ionicons name="checkmark" size={14} color={colors.white} />}
          </View>
        </Pressable>

        <View style={styles.body}>
          <Text
            numberOfLines={2}
            style={[styles.title, task.completed && styles.titleDone]}
          >
            {task.title}
          </Text>
          <View style={styles.metaRow}>
            {list && (
              <View style={styles.metaChip}>
                <Ionicons name={list.icon as any} size={11} color={list.color} />
                <Text style={[styles.metaText, { color: list.color }]}>{list.name}</Text>
              </View>
            )}
            {dueLabel && (
              <View style={styles.metaChip}>
                <Ionicons
                  name="calendar-outline"
                  size={11}
                  color={overdue ? colors.danger : colors.mutedText}
                />
                <Text style={[styles.metaText, { color: overdue ? colors.danger : colors.mutedText }]}>
                  {dueLabel}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.priorityDot, { backgroundColor: priorityColor(task.priority) }]} />
        <Ionicons name="chevron-forward" size={16} color={colors.mutedText} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkWrap: { marginRight: spacing.md },
  check: {
    width: 24,
    height: 24,
    borderRadius: radius.sm - 2,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, marginRight: spacing.sm },
  title: { ...type.body, color: colors.text },
  titleDone: { color: colors.mutedText, textDecorationLine: "line-through" },
  metaRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 4, gap: 8 },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { fontSize: 11.5, fontWeight: "600" },
  priorityDot: { width: 7, height: 7, borderRadius: 4, marginRight: spacing.sm },
});
