import React from 'react';

import { Toast as ToastComponent } from '@/src/quiz/components/Toast';
import { useQuizStore } from '../store/Quiz.store';


export function ToastContainer() {
  const toast = useQuizStore((state) => state.toast);
  const hideToast = useQuizStore((state) => state.hideToast);
  
  if (!toast?.visible) return null;
  
  return (
    <ToastComponent
      visible={toast.visible}
      message={toast.message}
      type={toast.type}
      duration={toast.duration}
      onHide={hideToast}
    />
  );
}
