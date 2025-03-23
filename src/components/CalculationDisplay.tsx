interface CalculationDisplayProps {
  expression: string;
  result: string | number;
}

export function CalculationDisplay({ expression, result }: CalculationDisplayProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto text-center">
      <div className="text-2xl font-mono mb-2">{expression}</div>
      <div className="text-4xl font-bold text-blue-600">{result}</div>
    </div>
  );
} 