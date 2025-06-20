import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GoalsList from './components/GoalsList';
import GoalDetails from './components/GoalDetails';
import CreateGoalModal from './components/CreateGoalModal';
import Toast from './components/Toast';
import { Goal } from './types/goal';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from './constants';
import { useGoals } from './hooks/useGoals';

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

type Screen = 'goals' | 'goalDetails';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('goals');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
  });
  const { createGoal, loading } = useGoals();

  const handleGoalPress = (goal: Goal) => {
    setSelectedGoal(goal);
    setCurrentScreen('goalDetails');
  };

  const handleBackToGoals = () => {
    setCurrentScreen('goals');
    setSelectedGoal(null);
  };

  const handleCreateGoal = async (title: string) => {
    setIsCreating(true);
    try {
      const newGoal = await createGoal({ title });
      if (newGoal) {
        console.log('Goal created successfully:', newGoal);
        showToast('Goal created successfully!', 'success');
      }
    } catch (error) {
      console.error('Failed to create goal:', error);
      showToast('Failed to create goal. Please try again.', 'error');
      throw error; // Re-throw to let the modal handle the error
    } finally {
      setIsCreating(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      visible: true,
      message,
      type,
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleAddPress = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const renderGoalsScreen = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="list" size={28} color={COLORS.primary} />
          <Text style={styles.headerTitle}>Goals</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddPress}
            disabled={loading || isCreating}
          >
            <Ionicons name="add" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Goals List */}
      <GoalsList onGoalPress={handleGoalPress} creating={isCreating} />
    </>
  );

  const renderGoalDetailsScreen = () => {
    if (!selectedGoal) return null;
    
    return (
      <GoalDetails
        goal={selectedGoal}
        onBack={handleBackToGoals}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {currentScreen === 'goals' && renderGoalsScreen()}
      {currentScreen === 'goalDetails' && renderGoalDetailsScreen()}

      {/* Create Goal Modal */}
      <CreateGoalModal
        visible={showCreateModal}
        onClose={handleCloseModal}
        onSubmit={handleCreateGoal}
        loading={loading || isCreating}
      />

      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
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
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginLeft: SPACING.md,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.surface,
    ...SHADOWS.sm,
  },
});
