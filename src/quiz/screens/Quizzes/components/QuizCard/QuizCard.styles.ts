import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  quizTitle: {
    fontSize: 18,
    fontWeight: '600',
    zIndex: 1,
  },
  quizCardOuter: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    flex: 1,
    height: 100,
    maxWidth: '100%',
    minWidth: '100%',
    overflow: 'hidden',
  },
  quizCardInner: {
    flex: 1,
    flexDirection: 'row',
  },
  quizCardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  quizCardStartItem: {
    width: 105,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressSection: {
    marginTop: 8,
    gap: 4,
  },
  unlockDescription: {
    fontSize: 12,
    color: '#6c757d',
    lineHeight: 16,
  },
  unlockProgress: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    color: '#495057',
  },
  locked: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    opacity: 0.8,
  },
  new: {
    borderStyle: 'dotted',
    borderColor: '#ff4444',
    borderWidth: 2,
  },
  loadingCard: {
    opacity: 0.7,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});