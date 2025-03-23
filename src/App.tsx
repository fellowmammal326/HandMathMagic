import { CameraModule } from './components/CameraModule';
import { CalculationDisplay } from './components/CalculationDisplay';
import { useCalculation } from './hooks/useCalculation';

function App() {
  const { handleGesture, getExpression, result } = useCalculation();

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Hand Math Magic</h1>
        <p className="mt-2 text-gray-600">Use hand gestures to perform calculations!</p>
      </header>

      <main className="container mx-auto px-4 space-y-6">
        <CameraModule onGestureDetected={handleGesture} />
        <CalculationDisplay expression={getExpression()} result={result} />
        
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Gesture Guide</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Numbers:</h3>
              <ul className="list-disc list-inside">
                <li>Thumb Up: 1</li>
                <li>Victory: 2</li>
                <li>Open Palm: 3</li>
                <li>Pointing Up: 4</li>
                <li>Closed Fist: 5</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Operators:</h3>
              <ul className="list-disc list-inside">
                <li>I Love You: Add (+)</li>
                <li>Thumb Down: Subtract (-)</li>
                <li>OK: Multiply (*)</li>
                <li>Peace: Divide (/)</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App; 