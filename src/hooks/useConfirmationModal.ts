'use client';

import { useState, useCallback } from 'react';

/**
 * Confirmation modal state
 */
export interface ConfirmationModalState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  variant: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
  loading: boolean;
}

/**
 * Hook for managing confirmation modals
 */
export function useConfirmationModal() {
  const [state, setState] = useState<ConfirmationModalState>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'danger',
    onConfirm: () => {},
    loading: false,
  });

  /**
   * Show confirmation modal
   */
  const showConfirmation = useCallback((config: {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void | Promise<void>;
  }) => {
    setState({
      isOpen: true,
      title: config.title,
      description: config.description,
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel',
      variant: config.variant || 'danger',
      onConfirm: config.onConfirm,
      loading: false,
    });
  }, []);

  /**
   * Hide confirmation modal
   */
  const hideConfirmation = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  /**
   * Handle confirm action
   */
  const handleConfirm = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      await state.onConfirm();
      hideConfirmation();
    } catch (error) {
      console.error('Confirmation action failed:', error);
      // Keep modal open on error so user can retry
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.onConfirm, hideConfirmation]);

  /**
   * Quick confirmation for delete actions
   */
  const confirmDelete = useCallback((itemName: string, onDelete: () => void | Promise<void>) => {
    showConfirmation({
      title: 'Delete Item',
      description: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'danger',
      onConfirm: onDelete,
    });
  }, [showConfirmation]);

  /**
   * Quick confirmation for logout
   */
  const confirmLogout = useCallback((onLogout: () => void | Promise<void>) => {
    showConfirmation({
      title: 'Sign Out',
      description: 'Are you sure you want to sign out?',
      confirmText: 'Sign Out',
      variant: 'warning',
      onConfirm: onLogout,
    });
  }, [showConfirmation]);

  /**
   * Quick confirmation for unsaved changes
   */
  const confirmUnsavedChanges = useCallback((onDiscard: () => void | Promise<void>) => {
    showConfirmation({
      title: 'Unsaved Changes',
      description: 'You have unsaved changes. Are you sure you want to leave without saving?',
      confirmText: 'Discard Changes',
      variant: 'warning',
      onConfirm: onDiscard,
    });
  }, [showConfirmation]);

  return {
    ...state,
    showConfirmation,
    hideConfirmation,
    handleConfirm,
    confirmDelete,
    confirmLogout,
    confirmUnsavedChanges,
  };
}
