import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { format, parseISO } from "date-fns";
import { colors, spacing, radius, type, shadow, priorityColor } from "../lib/theme";
import { useTaskStore } from "../lib/store";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "TaskDetail">;

const PRIORITY_LABEL: Record<string, string> = { low: "Bassa", medium: "Media", high: "Alta" };

export default function TaskDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { tasks, lists, toggleTask, deleteTask } = useTaskStore();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const task = tasks.find((t) => t.id === route.params.taskId);
  const list = lists.find((l) => l.id === task?.listId);

  const goBackOrHome = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    }
  };

  if (!task) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={goBackOrHome} hitSlop={10} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.center}>
          <Text style={type.bodyRegular}>Attività non trovata</Text>
          <Pressable style={styles.notFoundBtn} onPress={goBackOrHome}>
            <Text style={styles.notFoundBtnText}>Torna alla home</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const onDelete = async () => {
    await deleteTask(task.id);
    goBackOrHome();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={goBackOrHome} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("AddTask", { taskId: task.id })}
          hitSlop={10}
          style={styles.backBtn}
        >
          <Ionicons name="create-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          {list && (
            <View style={[styles.listChip, { backgroundColor: list.color + "22" }]}>
              <Ionicons name={list.icon as any} size={13} color={list.color} />
              <Text style={[styles.listChipText, { color: list.color }]}>{list.name}</Text>
            </View>
          )}
          <View style={styles.priorityChip}>
            <View style={[styles.priorityDot, { backgroundColor: priorityColor(task.priority) }]} />
            <Text style={styles.listChipText}>{PRIORITY_LABEL[task.priority]}</Text>
          </View>
        </View>

        <Text style={[styles.title, task.completed && styles.titleDone]}>{task.title}</Text>

        {task.notes ? <Text style={styles.notes}>{task.notes}</Text> : null}

        {task.dueDate && (
          <View style={styles.dueRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.mutedText} />
            <Text style={styles.dueText}>Scadenza: {format(parseISO(task.dueDate), "d MMMM yyyy")}</Text>
          </View>
        )}

        <Pressable
          style={[styles.completeBtn, task.completed && styles.completeBtnDone]}
          onPress={() => toggleTask(task.id)}
        >
          <Ionicons
            name={task.completed ? "arrow-undo" : "checkmark"}
            size={18}
            color={task.completed ? colors.text : colors.white}
          />
          <Text style={[styles.completeBtnText, task.completed && { color: colors.text }]}>
            {task.completed ? "Segna come da fare" : "Segna come completata"}
          </Text>
        </Pressable>

        {!confirmDelete ? (
          <Pressable style={styles.deleteBtn} onPress={() => setConfirmDelete(true)}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text style={styles.deleteText}>Elimina attività</Text>
          </Pressable>
        ) : (
          <View style={styles.confirmBox}>
            <Text style={styles.confirmText}>Eliminare questa attività?</Text>
            <View style={styles.confirmRow}>
              <Pressable style={styles.confirmCancel} onPress={() => setConfirmDelete(false)}>
                <Text style={styles.confirmCancelText}>Annulla</Text>
              </Pressable>
              <Pressable style={styles.confirmOk} onPress={onDelete}>
                <Text style={styles.confirmOkText}>Elimina</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.lg },
  notFoundBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
  },
  notFoundBtnText: { ...type.body, color: colors.white, fontWeight: "700" },
  body: { padding: spacing.lg, paddingTop: spacing.md },
  topRow: { flexDirection: "row", gap: 8 },
  listChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  priorityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  listChipText: { fontSize: 12.5, fontWeight: "700" },
  title: { ...type.display, fontSize: 26, color: colors.text, marginTop: spacing.lg },
  titleDone: { textDecorationLine: "line-through", color: colors.mutedText },
  notes: { ...type.bodyRegular, color: colors.mutedText, marginTop: spacing.md, lineHeight: 22 },
  dueRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: spacing.xl },
  dueText: { ...type.bodyRegular, color: colors.mutedText },
  completeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.xxl,
    ...shadow.floating,
  },
  completeBtnDone: { backgroundColor: colors.accentTint, shadowOpacity: 0 },
  completeBtnText: { ...type.body, color: colors.white, fontWeight: "700" },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  deleteText: { ...type.body, color: colors.danger, fontWeight: "600" },
  confirmBox: {
    marginTop: spacing.md,
    backgroundColor: colors.dangerTint,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  confirmText: { ...type.body, color: colors.text, marginBottom: spacing.md },
  confirmRow: { flexDirection: "row", gap: spacing.md },
  confirmCancel: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  confirmCancelText: { ...type.body, color: colors.text, fontWeight: "600" },
  confirmOk: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: "center",
    backgroundColor: colors.danger,
  },
  confirmOkText: { ...type.body, color: colors.white, fontWeight: "700" },
});
