'use client';

function CustomCodeRenderer({ data }: any) {
  data;

  return (
    <pre className="p-4 overflow-scroll bg-gray-800 rounded-md">
      <code className="text-sm text-gray-100">{data.code}</code>
    </pre>
  );
}

export default CustomCodeRenderer;
