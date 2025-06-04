import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useThemeColor } from '@/src/common/hooks/useThemeColor';
import { useHints } from '../store/hooks/useHints';
import { useQuizStore } from '../store/Quiz.store';

interface HintPanelProps {
  quizId: string;
  questionId: number;
  isVisible: boolean;
  onClose: () => void;
}

export const HintPanel: React.FC<HintPanelProps> = ({
  quizId,
  questionId,
  isVisible,
  onClose
}) => {
  const { availableHints, pointsBalance, handleUseHint: applyHint } = useHints(quizId, questionId);
  const [usedHintContent, setUsedHintContent] = useState<string | null>(null);
  
  const textColor = useThemeColor({}, 'text') as string;
  const backgroundColor = useThemeColor({}, 'background') as string;
  
  const handleUseHint = async (hintId: string) => {
    const result = await applyHint(hintId);
    if (result.success && result.hintContent) {
      setUsedHintContent(result.hintContent);
    }
  };

  if (!isVisible) return null;

  return (
    <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
      <View style={[styles.panel, { backgroundColor }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Hinweise</Text>
          <View style={styles.pointsContainer}>
            <FontAwesome6 name="coins" size={16} color="#FFD700" />
            <Text style={[styles.pointsText, { color: textColor }]}>
              {pointsBalance} Punkte
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome6 name="times" size={20} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* Used Hint Display */}
        {usedHintContent && (
          <View style={styles.usedHintContainer}>
            <Text style={styles.usedHintTitle}>💡 Dein Hinweis:</Text>
            <Text style={styles.usedHintContent}>{usedHintContent}</Text>
          </View>
        )}

        {/* Available Hints */}
        <ScrollView style={styles.hintsList}>
          {availableHints.map(({ hint, canUse, reason, content }) => (
            <TouchableOpacity
              key={hint.id}
              style={[
                styles.hintButton,
                !canUse && styles.disabledHint,
                hint.cost === 0 && styles.freeHint
              ]}
              onPress={() => canUse && handleUseHint(hint.id)}
              disabled={!canUse}
            >
              <View style={styles.hintHeader}>
                <Text style={[styles.hintTitle, !canUse && styles.disabledText]}>
                  {hint.title}
                </Text>
                <View style={styles.hintCost}>
                  {hint.cost === 0 ? (
                    <Text style={styles.freeText}>Kostenlos</Text>
                  ) : (
                    <>
                      <FontAwesome6 name="coins" size={12} color="#FFD700" />
                      <Text style={styles.costText}>{hint.cost}</Text>
                    </>
                  )}
                </View>
              </View>
              
              <Text style={[styles.hintDescription, !canUse && styles.disabledText]}>
                {hint.description}
              </Text>
              
              {!canUse && reason && (
                <Text style={styles.hintReason}>{reason}</Text>
              )}
              
              {content && (
                <View style={styles.previewContainer}>
                  <Text style={styles.previewText}>{content}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {availableHints.length === 0 && (
          <Text style={[styles.noHintsText, { color: textColor }]}>
            Keine Hinweise verfügbar
          </Text>
        )}
      </View>
    </View>
  );
};

// ==========================================
// POINTS DISPLAY COMPONENT
// ==========================================

interface PointsDisplayProps {
  quizId: string;
  compact?: boolean;
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({ 
  quizId, 
  compact = false 
}) => {
  const pointsBalance = useQuizStore(state => state.getPointsBalance());
  const textColor = useThemeColor({}, 'text') as string;
  
  return (
    <View style={[styles.pointsDisplay, compact && styles.pointsDisplayCompact]}>
      <FontAwesome6 name="coins" size={compact ? 14 : 18} color="#FFD700" />
      <Text style={[
        compact ? styles.pointsTextCompact : styles.pointsTextLarge,
        { color: textColor }
      ]}>
        {pointsBalance}
      </Text>
    </View>
  );
};

// ==========================================
// HINT BUTTON (für Question Screen)
// ==========================================

interface HintButtonProps {
  quizId: string;
  questionId: number;
  onOpenHints: () => void;
}

export const HintButton: React.FC<HintButtonProps> = ({
  quizId,
  questionId,
  onOpenHints
}) => {
  const { availableHints } = useHints(quizId, questionId);
  const availableCount = availableHints.filter(h => h.canUse).length;
  const tintColor = useThemeColor({}, 'tint') as string;
  
  return (
    <TouchableOpacity 
      style={[styles.hintFloatingButton, { backgroundColor: tintColor }]}
      onPress={onOpenHints}
    >
      <FontAwesome6 name="lightbulb" size={20} color="white" />
      {availableCount > 0 && (
        <View style={styles.hintBadge}>
          <Text style={styles.hintBadgeText}>{availableCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  panel: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  usedHintContainer: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  usedHintTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 4,
  },
  usedHintContent: {
    fontSize: 16,
    color: '#1B5E20',
    lineHeight: 22,
  },
  hintsList: {
    maxHeight: 300,
  },
  hintButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledHint: {
    opacity: 0.6,
    backgroundColor: '#f1f3f4',
  },
  freeHint: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  hintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hintTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
  },
  hintCost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff3cd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  costText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#856404',
  },
  hintDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
    lineHeight: 18,
  },
  hintReason: {
    fontSize: 12,
    color: '#dc3545',
    fontStyle: 'italic',
    marginTop: 4,
  },
  previewContainer: {
    backgroundColor: '#e7f3ff',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '500',
  },
  disabledText: {
    color: '#adb5bd',
  },
  noHintsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 32,
    fontStyle: 'italic',
  },
  pointsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pointsDisplayCompact: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pointsTextLarge: {
    fontSize: 16,
    fontWeight: '600',
  },
  pointsTextCompact: {
    fontSize: 14,
    fontWeight: '600',
  },
  hintFloatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  hintBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});