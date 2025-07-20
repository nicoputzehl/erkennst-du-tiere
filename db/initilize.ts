import { PointsOperations, UIOperations } from "./operations";

export async function initializeApp() {
  // Initialize points if not exists
  await PointsOperations.initializePoints();
  
  // Initialize UI state if not exists
  await UIOperations.getUiState();
  
  console.log('App initialized successfully');
}
