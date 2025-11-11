"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { increment, decrement, reset } from "@/lib/slices/counterSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Counter() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Redux Counter Example</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-4xl font-bold">{count}</p>
        </div>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => dispatch(decrement())} variant="outline">
            -
          </Button>
          <Button onClick={() => dispatch(reset())} variant="outline">
            Reset
          </Button>
          <Button onClick={() => dispatch(increment())} variant="outline">
            +
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

