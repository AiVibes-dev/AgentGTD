import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../constants';

interface CreateGoalModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string) => Promise<void>;
  loading?: boolean;
}

export default function CreateGoalModal({ 
  visible, 
  onClose, 
  onSubmit, 
  loading = false 
}: CreateGoalModalProps) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(title.trim());
      setTitle('');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create goal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('');
      onClose();
    }
  };

  const isSubmitDisabled = !title.trim() || isSubmitting || loading;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={handleClose}
            disabled={isSubmitting}
          >
            <Ionicons name="close" size={24} color={COLORS.text.secondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Goal</Text>
          <TouchableOpacity 
            style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
          >
            <Text style={[styles.submitButtonText, isSubmitDisabled && styles.submitButtonTextDisabled]}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Goal Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter your goal title..."
              placeholderTextColor={COLORS.text.tertiary}
              autoFocus
              maxLength={100}
              multiline
              numberOfLines={3}
              editable={!isSubmitting}
            />
            <Text style={styles.characterCount}>
              {title.length}/100
            </Text>
          </View>

          <View style={styles.helpText}>
            <Ionicons name="information-circle-outline" size={16} color={COLORS.text.secondary} />
            <Text style={styles.helpTextContent}>
              Keep your goal title clear and specific to help you stay focused.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
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
  closeButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.text.tertiary,
  },
  submitButtonText: {
    color: COLORS.text.inverse,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  submitButtonTextDisabled: {
    color: COLORS.text.secondary,
  },
  form: {
    flex: 1,
    padding: SPACING.lg,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.primary,
    textAlignVertical: 'top',
    minHeight: 80,
    ...SHADOWS.sm,
  },
  characterCount: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  helpText: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  helpTextContent: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginLeft: SPACING.sm,
    flex: 1,
    lineHeight: 20,
  },
}); 