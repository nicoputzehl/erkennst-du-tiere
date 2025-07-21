import React, { createContext, useContext, type ReactNode, useEffect, useState } from 'react';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { db, optimizeDatabase } from '../db/client';
import migrations from '../drizzle/migrations';
import { Text, View } from 'react-native';


interface DatabaseContextType {
  db: typeof db;
  isReady: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const { success, error } = useMigrations(db, migrations);

  const [isOptimized, setIsOptimized] = useState(false);

  
  useEffect(() => {
    if (success && !isOptimized) {
      optimizeDatabase().then(() => {
        setIsOptimized(true);
      }).catch(console.error);
    }
  }, [success, isOptimized]);

  if (error) {
    throw new Error(`Database migration failed: ${error.message}`);
  }

  if (!success || !isOptimized) {
    return (
      <View>
        <Text>
          Initializing database...
        </Text>
      </View>

    );
  }

  return (
    <DatabaseContext.Provider value={{
      db,
      isReady: success && isOptimized,
      error: error ?? null
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
}