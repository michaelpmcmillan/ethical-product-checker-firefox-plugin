// shows the GPT/Mistral result
type Props = {
  result: string | null;
};

export default function ResultDisplay({ result }: Props) {
  if (!result) return null;

  return (
    <div className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap mt-2">
      {result}
    </div>
  );
}
