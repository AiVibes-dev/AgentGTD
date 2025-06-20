import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types/task';
import { useTasks } from '../hooks/useTasks';
import { getRelativeTime } from '../utils/dateUtils';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../constants';

interface TasksListProps {
  goalId: number;
  goalTitle: string;
  onTaskPress?: (task: Task) => void;
  creating?: boolean;
  showToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function TasksList({ 
  goalId, 
  goalTitle, 
  onTaskPress, 
  creating = false,
  showToast
}: TasksListProps) {
  const {
    tasks,
    loading,
    error,
    refreshing,
    refreshTasks,
    toggleTaskCompletion,
    pendingCount,
    completedCount,
  } = useTasks(goalId);

  const handleToggleCompletion = async (task: Task) => {
    const result = await toggleTaskCompletion(task.id, !task.completed);
    if (result && showToast) {
      showToast(
        task.completed ? 'Task marked as incomplete!' : 'Task marked as complete!',
        'success'
      );
    } else if (!result && showToast) {
      showToast('Failed to update task. Please try again.', 'error');
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={[styles.taskItem, item.completed && styles.taskItemCompleted]}
      onPress={() => onTaskPress?.(item)}
      activeOpacity={0.7}
      disabled={creating}
    >
      <TouchableOpacity
        style={[styles.checkbox, item.completed && styles.checkboxCompleted]}
        onPress={() => handleToggleCompletion(item)}
        disabled={creating}
      >
        {item.completed && (
          <Ionicons name="checkmark" size={16} color={COLORS.text.inverse} />
        )}
      </TouchableOpacity>
      
      <View style={styles.taskContent}>
        <Text style={[
          styles.taskTitle, 
          item.completed && styles.taskTitleCompleted
        ]}>
          {item.title}
        </Text>
        <Text style={styles.taskDate}>
          Created: {getRelativeTime(item.createdAt)}
        </Text>
      </View>
      
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={item.completed ? COLORS.text.tertiary : COLORS.text.secondary} 
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="checkmark-circle-outline" size={64} color={COLORS.text.tertiary} />
      <Text style={styles.emptyStateText}>No tasks yet</Text>
      <Text style={styles.emptyStateSubtext}>Add your first task to get started</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
      <Text style={styles.errorText}>Failed to load tasks</Text>
      <Text style={styles.errorSubtext}>{error}</Text>
      <TouchableOpacity 
        style={styles.retryButton} 
        onPress={() => refreshTasks(goalId)}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCreatingState = () => (
    <View style={styles.creatingState}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.creatingText}>Creating task...</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.goalTitle}>{goalTitle}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  if (error && !refreshing) {
    return renderErrorState();
  }

  if (creating) {
    return renderCreatingState();
  }

  return (
    <FlatList
      data={tasks}
      renderItem={renderTaskItem}
      keyExtractor={(item) => item.id.toString()}
      style={styles.container}
      contentContainerStyle={tasks.length === 0 ? styles.emptyContainer : undefined}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmptyState}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => refreshTasks(goalId)} />
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
  },
  creatingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  creatingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
  },
  header: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  headerContent: {
    gap: SPACING.md,
  },
  goalTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  taskItem: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  taskItemCompleted: {
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.text.tertiary,
  },
  taskDate: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.secondary,
    marginTop: SPACING.md,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.tertiary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.error,
    marginTop: SPACING.md,
  },
  errorSubtext: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  retryButtonText: {
    color: COLORS.text.inverse,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
}); 