import { StyleSheet } from "react-native";

export const sharedStyles = StyleSheet.create({
  quizTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    zIndex: 1,
  },
  quizCardLongOuter: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    flex: 1,
    height: 100,
    maxWidth: '100%',
    minWidth: '100%',
    overflow: 'hidden',
  },
  quizCardLongInner: {
    flex: 1,
    flexDirection: 'row',
  },
  quizCardLongcontent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  quizCardLongStartItem: {
		width: 105,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  }
});