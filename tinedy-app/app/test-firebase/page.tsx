'use client';

import { useEffect, useState } from 'react';
import { app, auth, db } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function TestFirebasePage() {
  const [status, setStatus] = useState<string>('Testing Firebase connection...');
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    async function testFirebase() {
      const testResults: string[] = [];

      try {
        // Test 1: Check Firebase app initialization
        if (app) {
          testResults.push('✅ Firebase app initialized successfully');
        } else {
          testResults.push('❌ Firebase app initialization failed');
        }

        // Test 2: Check Auth service
        if (auth) {
          testResults.push('✅ Firebase Auth service accessible');
        } else {
          testResults.push('❌ Firebase Auth service not accessible');
        }

        // Test 3: Check Firestore service
        if (db) {
          testResults.push('✅ Firestore database service accessible');
        } else {
          testResults.push('❌ Firestore database service not accessible');
        }

        // Test 4: Test Firestore write operation
        try {
          const testCollection = collection(db, 'test_connection');
          const docRef = await addDoc(testCollection, {
            test: true,
            timestamp: new Date().toISOString(),
            message: 'Firebase integration test',
          });
          testResults.push(`✅ Firestore write operation successful (doc: ${docRef.id})`);

          // Test 5: Test Firestore read operation
          const snapshot = await getDocs(testCollection);
          testResults.push(`✅ Firestore read operation successful (${snapshot.size} documents found)`);

          // Test 6: Clean up test data
          await deleteDoc(doc(db, 'test_connection', docRef.id));
          testResults.push('✅ Test document cleaned up successfully');
        } catch (firestoreError: unknown) {
          const message = firestoreError instanceof Error ? firestoreError.message : 'Unknown error';
          testResults.push(`❌ Firestore operations failed: ${message}`);
        }

        setStatus('Firebase connection test completed!');
        setResults(testResults);
      } catch (error: unknown) {
        setStatus('Firebase connection test failed!');
        const message = error instanceof Error ? error.message : 'Unknown error';
        testResults.push(`❌ Error: ${message}`);
        setResults(testResults);
      }
    }

    testFirebase();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Firebase Integration Test</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{status}</h2>

          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded ${
                  result.startsWith('✅')
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {result}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a test page to verify Firebase integration.
            It will be removed in production builds.
          </p>
        </div>
      </div>
    </div>
  );
}
