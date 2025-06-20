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
import { Goal } from '../types/goal';
import { useGoals } from '../hooks/useGoals';
import { getRelativeTime } from '../utils/dateUtils';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../constants';

interface GoalsListProps {
  onGoalPress?: (goal: Goal) => void;
  creating?: boolean;
}

export default function GoalsList({ onGoalPress, creating = false }: GoalsListProps) {
  const {
    goals,
    loading,
    error,
    refreshing,
    refreshGoals,
  } = useGoals();

  const renderGoalItem = ({ item }: { item: Goal }) => (
    <TouchableOpacity
      style={styles.goalItem}
      onPress={() => onGoalPress?.(item)}
      activeOpacity={0.7}
      disabled={creating}
    >
      <View style={styles.goalContent}>
        <Text style={styles.goalTitle}>{item.title}</Text>
        <Text style={styles.goalDate}>Created: {getRelativeTime(item.createdAt)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.text.secondary} />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="list-outline" size={64} color={COLORS.text.tertiary} />
      <Text style={styles.emptyStateText}>No goals yet</Text>
      <Text style={styles.emptyStateSubtext}>Create your first goal to get started</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
      <Text style={styles.errorText}>Failed to load goals</Text>
      <Text style={styles.errorSubtext}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refreshGoals}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCreatingState = () => (
    <View style={styles.creatingState}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.creatingText}>Creating goal...</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading goals...</Text>
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
      data={goals}
      renderItem={renderGoalItem}
      keyExtractor={(item) => item.id.toString()}
      style={styles.container}
      contentContainerStyle={goals.length === 0 ? styles.emptyContainer : undefined}
      ListEmptyComponent={renderEmptyState}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshGoals} />
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
  goalItem: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  goalDate: {
    fontSize: TYPOGRAPHY.sizes.sm,
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