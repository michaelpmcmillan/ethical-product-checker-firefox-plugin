export default function ResultDisplay({ result }: { result: string }) {
  return (
    <div className="mt-4 p-3 bg-muted text-sm rounded whitespace-pre-wrap">
      {result}
    </div>
  );
}
