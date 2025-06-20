import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TasksList from './TasksList';
import { Goal } from '../types/goal';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../constants';

interface GoalDetailsProps {
  goal: Goal;
  onBack: () => void;
}

export default function GoalDetails({ goal, onBack }: GoalDetailsProps) {
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const handleTaskPress = (task: any) => {
    // TODO: Navigate to task details or edit task
    console.log('Task pressed:', task);
  };

  const handleAddTask = () => {
    // TODO: Open create task modal
    console.log('Add task pressed for goal:', goal.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {goal.title}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddTask}
          disabled={isCreatingTask}
        >
          <Ionicons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Tasks List */}
      <TasksList
        goalId={goal.id}
        goalTitle={goal.title}
        onTaskPress={handleTaskPress}
        creating={isCreatingTask}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  backButton: {
    padding: SPACING.xs,
    marginRight: SPACING.sm,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  addButton: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.surface,
    ...SHADOWS.sm,
  },
}); 