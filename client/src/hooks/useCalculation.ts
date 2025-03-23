import { useState, useCallback, useEffect } from 'react';

export function useCalculation() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [operator, setOperator] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  const handleGesture = useCallback((gesture: string) => {
    // Convert gesture to number or operator
    const value = gestureToValue(gesture);
    
    if (typeof value === 'number') {
      setNumbers(prev => [...prev, value]);
    } else if (typeof value === 'string') {
      setOperator(value);
    }
  }, []);

  // Automatically calculate when we have both numbers and an operator
  useEffect(() => {
    if (numbers.length === 2 && operator) {
      const [a, b] = numbers;
      let calculatedResult: number;

      switch (operator) {
        case '+':
          calculatedResult = a + b;
          break;
        case '-':
          calculatedResult = a - b;
          break;
        case '*':
          calculatedResult = a * b;
          break;
        case '/':
          calculatedResult = b !== 0 ? a / b : 0;
          break;
        default:
          return;
      }

      setResult(calculatedResult);
      
      // Reset after a short delay to allow for the result to be seen
      setTimeout(() => {
        setNumbers([]);
        setOperator('');
      }, 2000);
    }
  }, [numbers, operator]);

  const clear = useCallback(() => {
    setNumbers([]);
    setOperator('');
    setResult(null);
  }, []);

  const getExpression = useCallback(() => {
    if (result !== null) {
      return `${numbers[0]} ${operator} ${numbers[1]} = ${result}`;
    }
    return numbers.length === 0 
      ? 'Show a number gesture...'
      : numbers.length === 1 
        ? `${numbers[0]} ${operator ? operator + ' Show another number...' : 'Show an operator...'}`
        : `${numbers.join(' ')} ${operator}`;
  }, [numbers, operator, result]);

  return {
    handleGesture,
    clear,
    getExpression,
    result: result?.toString() ?? '',
  };
}

function gestureToValue(gesture: string): number | string | null {
  const gestureMap: { [key: string]: number | string } = {
    'Thumb_Up': 1,
    'Victory': 2,
    'Open_Palm': 3,
    'Pointing_Up': 4,
    'Closed_Fist': 5,
    'ILoveYou': '+',
    'Thumb_Down': '-',
    'OK': '*',
    'Peace': '/',
  };

  return gestureMap[gesture] ?? null;
} 