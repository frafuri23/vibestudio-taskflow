import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { format, addDays } from "date-fns";
import { colors, spacing, radius, type, priorityColor } from "../lib/theme";
import { useTaskStore } from "../lib/store";
import { Priority } from "../lib/types";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "AddTask">;

const PRIORITIES: Priority[] = ["low", "medium", "high"];
const PRIORITY_LABEL: Record<Priority, string> = { low: "Bassa", medium: "Media", high: "Alta" };

type DueOption = "none" | "today" | "tomorrow" | "week";

export default function AddTaskScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { lists, addTask, updateTask, tasks } = useTaskStore();
  const editingId = route.params?.taskId;
  const editingTask = tasks.find((t) => t.id === editingId);

  const [title, setTitle] = useState(editingTask?.title ?? "");
  const [notes, setNotes] = useState(editingTask?.notes ?? "");
  const [listId, setListId] = useState(editingTask?.listId ?? lists[0]?.id ?? "personal");
  const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? "medium");
  const [dueOption, setDueOption] = useState<DueOption>(() => {
    if (!editingTask?.dueDate) return "none";
    const today = format(new Date(), "yyyy-MM-dd");
    const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
    const week = format(addDays(new Date(), 7), "yyyy-MM-dd");
    if (editingTask.dueDate === today) return "today";
    if (editingTask.dueDate === tomorrow) return "tomorrow";
    if (editingTask.dueDate === week) return "week";
    return "today";
  });

  const dueDateFor = (opt: DueOption): string | undefined => {
    if (opt === "none") return undefined;
    if (opt === "today") return format(new Date(), "yyyy-MM-dd");
    if (opt === "tomorrow") return format(addDays(new Date(), 1), "yyyy-MM-dd");
    return format(addDays(new Date(), 7), "yyyy-MM-dd");
  };

  const canSave = title.trim().length > 0;

  const onSave = async () => {
    if (!canSave) return;
    const payload = {
      title,
      notes,
      listId,
      priority,
      dueDate: dueDateFor(dueOption),
    };
    if (editingTask) {
      await updateTask(editingTask.id, payload);
    } else {
      await addTask(payload);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>{editingTask ? "Modifica attività" : "Nuova attività"}</Text>
          <Pressable
            onPress={onSave}
            disabled={!canSave}
            style={[styles.saveBtn, !canSave && { opacity: 0.4 }]}
          >
            <Text style={styles.saveText}>Salva</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.xl }}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.titleInput}
            placeholder="Cosa devi fare?"
            placeholderTextColor={colors.mutedText}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />
          <TextInput
            style={styles.notesInput}
            placeholder="Note (opzionale)"
            placeholderTextColor={colors.mutedText}
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <Text style={styles.sectionLabel}>Lista</Text>
          <View style={styles.chipsRow}>
            {lists.map((l) => (
              <Pressable
                key={l.id}
                onPress={() => setListId(l.id)}
                style={[
                  styles.listChip,
                  listId === l.id && { backgroundColor: l.color + "22", borderColor: l.color },
                ]}
              >
                <Ionicons name={l.icon as any} size={14} color={listId === l.id ? l.color : colors.mutedText} />
                <Text style={[styles.listChipText, listId === l.id && { color: l.color }]}>{l.name}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Priorità</Text>
          <View style={styles.chipsRow}>
            {PRIORITIES.map((p) => (
              <Pressable
                key={p}
                onPress={() => setPriority(p)}
                style={[
                  styles.priorityChip,
                  priority === p && { backgroundColor: priorityColor(p) + "22", borderColor: priorityColor(p) },
                ]}
              >
                <View style={[styles.priorityDot, { backgroundColor: priorityColor(p) }]} />
                <Text style={[styles.listChipText, priority === p && { color: priorityColor(p) }]}>
                  {PRIORITY_LABEL[p]}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Scadenza</Text>
          <View style={styles.chipsRow}>
            {(
              [
                { key: "none", label: "Nessuna" },
                { key: "today", label: "Oggi" },
                { key: "tomorrow", label: "Domani" },
                { key: "week", label: "Tra 7gg" },
              ] as { key: DueOption; label: string }[]
            ).map((opt) => (
              <Pressable
                key={opt.key}
                onPress={() => setDueOption(opt.key)}
                style={[styles.dueChip, dueOption === opt.key && styles.dueChipActive]}
              >
                <Text style={[styles.listChipText, dueOption === opt.key && { color: colors.accent }]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  closeBtn: { width: 40, height: 40, alignItems: "flex-start", justifyContent: "center" },
  headerTitle: { ...type.heading, color: colors.text },
  saveBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  saveText: { ...type.body, color: colors.accent, fontWeight: "700" },
  titleInput: {
    ...type.title,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  notesInput: {
    ...type.bodyRegular,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: spacing.md,
    minHeight: 80,
    textAlignVertical: "top",
  },
  sectionLabel: { ...type.caption, color: colors.mutedText, marginTop: spacing.xl, marginBottom: spacing.sm },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  listChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  priorityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  dueChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dueChipActive: { backgroundColor: colors.accentTint, borderColor: colors.accent },
  listChipText: { fontSize: 13, fontWeight: "600", color: colors.mutedText },
});
